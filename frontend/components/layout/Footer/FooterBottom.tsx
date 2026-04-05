export function FooterBottom() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-6 border-t border-slate-200/60 flex justify-between items-center">
      <p className="text-sm text-slate-500">
        © 2024 APKBugs. All rights reserved.
      </p>
      <div className="flex gap-6">
        <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary transition-colors">
          language
        </span>
        <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary transition-colors">
          help
        </span>
      </div>
    </div>
  );
}
