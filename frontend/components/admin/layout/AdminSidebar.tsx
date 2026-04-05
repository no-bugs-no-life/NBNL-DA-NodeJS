import Link from 'next/link';

function SidebarLogo() {
    return (
        <div className="flex items-center gap-3 mb-8 px-4 mt-2">
            <img src="/logo.png" alt="Logo" className="h-8 rounded-lg object-contain bg-slate-100" />
            <span className="font-bold text-xl tracking-tight text-slate-800">Admin Panel</span>
        </div>
    );
}

const MENUS = [
    { name: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
    { name: 'Quản lý Danh mục', icon: 'category', path: '/admin/categories' },
    { name: 'Quản lý App', icon: 'apps', path: '/admin/apps' },
];

function SidebarItem({ menu }: { menu: { name: string; icon: string; path: string } }) {
    return (
        <Link href={menu.path} className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-blue-50/50 hover:text-blue-600 transition-colors text-slate-600 font-semibold mb-1 border border-transparent hover:border-blue-100/50">
            <span className="material-symbols-outlined text-[20px]">{menu.icon}</span>
            <span className="text-sm">{menu.name}</span>
        </Link>
    );
}

export function AdminSidebar() {
    return (
        <aside className="w-64 border-r border-slate-200 bg-white h-screen shrink-0 overflow-y-auto hidden md:block p-4 sticky top-0 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]">
            <SidebarLogo />
            <nav>
                {MENUS.map((m) => <SidebarItem key={m.path} menu={m} />)}
            </nav>
        </aside>
    );
}
