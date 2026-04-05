import Link from "next/link";

export function FooterLinks() {
  return (
    <>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
          Liên kết hữu ích
        </h4>
        <div className="flex flex-col gap-4">
          <Link
            className="text-sm text-slate-500 hover:underline decoration-blue-500 underline-offset-4 transition-opacity"
            href="#"
          >
            Store Policies
          </Link>
          <Link
            className="text-sm text-slate-500 hover:underline decoration-blue-500 underline-offset-4 transition-opacity"
            href="#"
          >
            Developer Resources
          </Link>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
          Hỗ trợ
        </h4>
        <div className="flex flex-col gap-4">
          <Link
            className="text-sm text-slate-500 hover:underline decoration-blue-500 underline-offset-4 transition-opacity"
            href="#"
          >
            Support
          </Link>
          <Link
            className="text-sm text-slate-500 hover:underline decoration-blue-500 underline-offset-4 transition-opacity"
            href="#"
          >
            Legal Information
          </Link>
        </div>
      </div>
    </>
  );
}
