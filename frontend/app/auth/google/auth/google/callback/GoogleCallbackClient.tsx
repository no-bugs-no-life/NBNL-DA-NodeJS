"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/configs/api";

/**
 * Forwards id_token/state to backend callback endpoint.
 */
export function GoogleCallbackClient() {
  const params = useSearchParams();

  useEffect(() => {
    const idToken = params.get("id_token");
    const state = params.get("state");

    const url = new URL(`${API_URL}/api/v1/auth/google/callback`);
    if (idToken) url.searchParams.set("id_token", idToken);
    if (state) url.searchParams.set("state", state);

    window.location.href = url.toString();
  }, [params]);

  return null;
}

