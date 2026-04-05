import Link from "next/link";
import NavLinks from "./NavLinks";
import NavSearch from "./NavSearch";
import NavProfile from "./NavProfile";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-nav shadow-sm">
      <div className="px-4 sm:px-8 py-3 max-w-screen-2xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tighter text-slate-900 shrink-0"
          >
            <img
              src="/logo.png"
              alt="APKBugs Logo"
              className="h-8 rounded-lg object-contain"
            />
            <span className="hidden sm:block">APKBugs</span>
          </Link>
          <NavLinks />
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <NavSearch />
          <NavProfile />
        </div>
      </div>
    </nav>
  );
}
