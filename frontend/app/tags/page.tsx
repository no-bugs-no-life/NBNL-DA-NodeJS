
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Link from "next/link";
import { Metadata } from "next";
import { mockTags } from "../../components/category/Sidebar/TagsSidebar";

// Map tag names to Material Symbols icons
const tagIconMap: Record<string, string> = {
    "Thiết kế": "palette",
    "Đồ họa": "brush",
    "Chỉnh sửa ảnh": "photo_camera",
    "Phần mềm": "apps",
    "Công cụ AI": "smart_toy",
    "Năng suất": "trending_up",
    "Tiện ích": "widgets",
    "Lập trình": "code",
    "Video & Hoạt hình": "movie",
};

function getTagIcon(tag: string) {
    return tagIconMap[tag] || "tag";
}

export const metadata: Metadata = {
    title: "Từ khóa | Cửa hàng",
    description: "Duyệt qua các từ khóa ứng dụng phổ biến",
};

export default function TagsIndexPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-24 px-6 max-w-[1920px] mx-auto min-h-screen">
                <h1 className="text-4xl font-bold mb-8">Từ khóa tìm kiếm phổ biến</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mockTags.map((t, idx) => (
                        <Link key={idx} href={`/tags/${encodeURIComponent(t)}`}>
                            <div className="bg-surface-container-low rounded-[20px] p-8 flex flex-col items-center justify-center text-center hover:bg-surface-container-high transition-colors border border-outline/10 cursor-pointer h-full group hover:shadow-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] active:scale-95 duration-300 min-h-[140px]">
                                <span className="material-symbols-outlined text-5xl text-primary mb-5 group-hover:scale-110 transition-transform">
                                    {getTagIcon(t)}
                                </span>
                                <h3 className="text-xl font-bold text-on-surface tracking-tight">{t}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </main >
            <Footer />
        </>
    );
}
