import { FooterLinks } from "./FooterLinks";
import { FooterNewsletter } from "./FooterNewsletter";
import { FooterBottom } from "./FooterBottom";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 mt-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8 py-16 max-w-7xl mx-auto">
        <div className="col-span-2 md:col-span-1">
          <span className="text-lg font-semibold text-slate-700 block mb-4">
            APKBugs
          </span>
          <p className="text-sm text-slate-500 leading-relaxed">
            Cửa hàng ứng dụng hiện đại dành cho mọi thiết bị của bạn.
          </p>
        </div>
        <FooterLinks />
        <FooterNewsletter />
      </div>
      <FooterBottom />
    </footer>
  );
}
