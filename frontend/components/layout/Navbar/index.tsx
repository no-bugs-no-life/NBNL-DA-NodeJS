import Link from "next/link";
import NavLinks from "./NavLinks";
import NavSearch from "./NavSearch";
import NavProfile from "./NavProfile";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-nav shadow-sm px-6 py-3 max-w-[1920px] mx-auto flex justify-between items-center">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter text-slate-900">
          <img src="/logo.png" alt="APKBugs Logo" className="h-8 object-contain" />
          APKBugs
        </Link>
        <NavLinks />
      </div>
      <div className="flex items-center gap-4">
        <NavSearch />
        <NavProfile />
      </div>
    </nav>
  );
}
