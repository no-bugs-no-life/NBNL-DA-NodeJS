import Link from "next/link";

export default function NavLinks() {
  return (
    <div className="hidden md:flex items-center gap-6 text-sm font-medium tracking-tight">
      <Link
        className="text-slate-600 hover:text-slate-900 transition-colors"
        href="/"
      >
        Home
      </Link>
      <Link
        className="text-blue-700 border-b-2 border-blue-700 pb-1"
        href="/category"
      >
        Apps
      </Link>
      <Link
        className="text-slate-600 hover:text-slate-900 transition-colors"
        href="/games"
      >
        Games
      </Link>
      <Link
        className="text-slate-600 hover:text-slate-900 transition-colors"
        href="/entertainment"
      >
        Entertainment
      </Link>
      <Link
        className="text-slate-600 hover:text-slate-900 transition-colors"
        href="/deals"
      >
        Deals
      </Link>
    </div>
  );
}
