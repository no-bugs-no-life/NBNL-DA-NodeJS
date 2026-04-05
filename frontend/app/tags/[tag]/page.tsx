"use client";

import { use } from "react";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import ProductGrid from "../../../components/category/ProductGrid";
import { mockApps } from "../../../components/category/data";
import Link from "next/link";

interface TagsPageProps {
    params: Promise<{
        tag: string;
    }>;
}

export default function TagsPage(props: TagsPageProps) {
    const params = use(props.params);
    const tag = decodeURIComponent(params.tag);

    // Note: in a real app, this would fetch from an API filtering by `tag`
    // We use `mockApps` here with a static list as fallback/placeholder 
    // since the mock data doesn't contain tags. We can just return mock apps.
    const apps = mockApps;

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-24 px-6 max-w-[1920px] mx-auto min-h-screen">
                <div className="mb-12">
                    <Link href="/" className="text-sm text-on-surface-variant hover:text-primary mb-4 inline-flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Trang chủ
                    </Link>
                    <div className="flex items-center gap-4 mt-4">
                        <span className="material-symbols-outlined text-4xl text-primary">tag</span>
                        <h1 className="text-4xl font-bold capitalize">
                            {tag}
                        </h1>
                    </div>
                    <p className="mt-4 text-on-surface-variant text-lg">
                        Hiển thị kết quả cho từ khóa &quot;{tag}&quot;
                    </p>
                </div>

                <div className="border-t border-outline/10 pt-12">
                    <ProductGrid apps={apps} />
                </div>
            </main>
            <Footer />
        </>
    );
}
