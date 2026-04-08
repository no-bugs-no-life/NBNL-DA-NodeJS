"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore, { apiClient } from "@/store/useAuthStore";

declare global {
  interface Window {
    google?: any;
  }
}

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "15308212703-5mrfqkbaunigro8v3oj2888hvs2rpfev.apps.googleusercontent.com";

function loadGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.google?.accounts?.id) return resolve();

    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-google-gsi]",
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("GSI load error")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.setAttribute("data-google-gsi", "true");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("GSI load error"));
    document.head.appendChild(script);
  });
}

export default function GoogleLoginButton({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>("");
  const [isBusy, setIsBusy] = useState(false);
  const { login, checkAuth } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await loadGsiScript();
        if (!mounted) return;

        if (!window.google?.accounts?.id || !buttonRef.current) return;

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (resp: { credential?: string }) => {
            try {
              setError("");
              setIsBusy(true);

              const credential = resp?.credential;
              if (!credential) throw new Error("Missing Google credential");

              const res = await apiClient.post("/api/v1/auth/google/verify", {
                credential,
              });
              const payload = res.data?.data;
              if (payload?.token) login(payload.token);

              await checkAuth();

              const { user } = useAuthStore.getState();
              const roleName = (user?.role as any)?.name || user?.role || "";
              router.push(
                roleName === "ADMIN" || roleName === "MODERATOR"
                  ? "/admin/dashboard"
                  : "/",
              );
            } catch (e) {
              setError(e instanceof Error ? e.message : "Google login failed");
            } finally {
              setIsBusy(false);
            }
          },
        });

        // Render Google's button into our container
        buttonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          width: buttonRef.current.clientWidth || 360,
          text: "continue_with",
          shape: "pill",
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Google login init failed");
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, [checkAuth, login, router]);

  return (
    <div className={className}>
      <div className={isBusy ? "opacity-70 pointer-events-none" : ""} ref={buttonRef} />
      {error && (
        <div className="mt-3 text-sm text-error font-semibold text-center">
          {error}
        </div>
      )}
    </div>
  );
}

