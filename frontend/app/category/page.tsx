"use client";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { useAuthStore } from "@/store/useAuthStore";

export default function CategoryIndexPage() {
    const { data: categories = [], isLoading } = useCategories();
    const { isAdmin } = useAuthStore();

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-24 px-6 max-w-[1920px] mx-auto min-h-screen">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold">Danh mục ứng dụng</h1>
                    {isAdmin() && (
                        <Link
                            href="/admin/categories"
                            id="manage-categories-btn"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                        >
                            <span className="material-symbols-outlined text-base">shield</span>
                            Quản lý danh mục
                        </Link>
                    )}
                </div>
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-surface-container-low rounded-[20px] p-8 flex flex-col items-center justify-center h-40 animate-pulse" />
                        ))}
                    </div>
                ) : categories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((c) => (
                            <Link key={c._id} href={`/category/${c._id}`}>
                                <div className="bg-surface-container-low rounded-[20px] p-8 flex flex-col items-center justify-center text-center hover:bg-surface-container-high transition-colors border border-outline/10 cursor-pointer h-full group hover:shadow-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] active:scale-95 duration-300">
                                    {c.iconUrl ? (
                                        <img
                                            src={c.iconUrl}
                                            alt={c.name}
                                            className="w-14 h-14 object-contain mb-4 group-hover:scale-110 transition-transform duration-300"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <span className="material-symbols-outlined text-5xl text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                                            category
                                        </span>
                                    )}
                                    <h3 className="text-xl font-bold text-on-surface tracking-tight">{c.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-on-surface-variant">Không có danh mục nào.</p>
                )}
            </main>
            <Footer />
        </>
    );
}
