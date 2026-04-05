"use client";

import { use } from "react";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import ProductGrid from "../../../components/category/ProductGrid";
import { mockApps, mockCategories } from "../../../components/category/data";
import Link from "next/link";

interface CategoryDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function CategoryDetailPage(props: CategoryDetailPageProps) {
    const params = use(props.params);
    const categoryId = params.id;
    const category = mockCategories.find((c) => c._id === categoryId);
    const title = category ? category.name : "Danh mục không tìm thấy";

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-24 px-6 max-w-[1920px] mx-auto min-h-screen">
                <div className="mb-12">
                    <Link href="/category" className="text-sm font-medium text-on-surface-variant hover:text-primary mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-surface-container-high transition-colors">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Tất cả danh mục
                    </Link>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-primary">
                                {category?.iconUrl || "category"}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">
                            {title}
                        </h1>
                    </div>
                    <p className="mt-4 text-on-surface-variant text-lg max-w-2xl">
                        Hiển thị các ứng dụng phổ biến và tốt nhất thuộc danh mục {title}.
                    </p>
                </div>

                <div className="border-t border-outline/10 pt-12">
                    {category ? <ProductGrid apps={mockApps} /> : <p className="text-on-surface-variant">Không tìm thấy nội dung cho danh mục này.</p>}
                </div>
            </main>
            <Footer />
        </>
    );
}
