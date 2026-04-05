import Link from "next/link";
import NavLinks from "./NavLinks";
import NavSearch from "./NavSearch";
import NavProfile from "./NavProfile";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-nav shadow-sm px-6 py-3 max-w-[1920px] mx-auto flex justify-between items-center">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold tracking-tighter text-slate-900">
          Horizon Store
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
