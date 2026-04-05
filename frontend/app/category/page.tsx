"use client";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";

export default function CategoryIndexPage() {
    const { data: categories = [], isLoading } = useCategories();

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-24 px-6 max-w-[1920px] mx-auto min-h-screen">
                <h1 className="text-4xl font-bold mb-8">Danh mục ứng dụng</h1>
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
