export function FooterNewsletter() {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
        Bản tin
      </h4>
      <p className="text-xs text-slate-500 mb-4">
        Nhận thông tin cập nhật mới nhất về các ứng dụng.
      </p>
      <div className="flex gap-2">
        <input
          className="bg-white border-none rounded-lg text-xs px-3 py-2 w-full focus:ring-1 focus:ring-primary"
          placeholder="Email của bạn"
          type="email"
        />
        <button className="bg-primary text-white p-2 rounded-lg">
          <span className="material-symbols-outlined text-sm">send</span>
        </button>
      </div>
    </div>
  );
}
