import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-surface">
      <div className="max-w-md w-full bg-surface-container-low rounded-2xl p-8 text-center border border-outline-variant/20">
        <h1 className="text-2xl font-bold mb-3">Đăng ký</h1>
        <p className="text-on-surface-variant mb-6">
          Chức năng đăng ký đang được hoàn thiện. Vui lòng dùng tài khoản hiện có
          để đăng nhập.
        </p>
        <Link
          href="/login"
          className="inline-block bg-primary text-on-primary px-6 py-3 rounded-xl font-semibold hover:brightness-110 transition-all"
        >
          Đến trang đăng nhập
        </Link>
      </div>
    </main>
  );
}
