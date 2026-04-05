import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Link from "next/link";
import { mockCategories } from "../../components/category/data";
import { Metadata } from "next";

import Sidebar from "../../components/category/Sidebar";

export const metadata: Metadata = {
    title: "Danh mục | Cửa hàng",
    description: "Duyệt qua các danh mục ứng dụng của chúng tôi",
};

export default function CategoryIndexPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 px-6 max-w-[1920px] mx-auto flex flex-col md:flex-row gap-12">
                <Sidebar />
                <div className="flex-1 min-w-0">
                    <h1 className="text-4xl font-bold mb-8">Danh mục ứng dụng</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockCategories.map((c) => (
                            <Link key={c._id} href={`/category/${c._id}`}>
                                <div className="bg-surface-container-low rounded-[20px] p-8 flex flex-col items-center justify-center text-center hover:bg-surface-container-high transition-colors border border-outline/10 cursor-pointer h-full group hover:shadow-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] active:scale-95 duration-300">
                                    <span className="material-symbols-outlined text-5xl text-primary mb-5 group-hover:scale-110 transition-transform">
                                        {c.iconUrl || "category"}
                                    </span>
                                    <h3 className="text-xl font-bold text-on-surface tracking-tight">{c.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
