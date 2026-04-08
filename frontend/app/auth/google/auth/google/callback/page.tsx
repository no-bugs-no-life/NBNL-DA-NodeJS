import { Suspense } from "react";
import { GoogleCallbackClient } from "./GoogleCallbackClient";

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <div className="text-lg font-bold text-on-surface">Đang đăng nhập...</div>
        <div className="text-sm text-on-surface-variant mt-2">
          Vui lòng đợi trong giây lát.
        </div>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <GoogleCallbackClient />
    </Suspense>
  );
}

