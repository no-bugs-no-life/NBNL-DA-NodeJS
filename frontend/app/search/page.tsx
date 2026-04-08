import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Sidebar from "../../components/category/Sidebar";
import ProductGrid from "../../components/category/ProductGrid";
import SearchResultHeader from "../../components/search/SearchResultHeader";
import { API_URL } from "@/configs/api";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";

  let totalCount = 0;
  try {
    const qs = new URLSearchParams({ limit: "1" });
    if (q.trim()) qs.set("search", q.trim());
    const res = await fetch(`${API_URL}/api/v1/apps?${qs.toString()}`, {
      cache: "no-store",
    });
    const json = await res.json();
    totalCount =
      json?.data?.totalDocs ?? json?.totalDocs ?? json?.data?.docs?.length ?? 0;
  } catch {
    totalCount = 0;
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-[1920px] mx-auto flex flex-col md:flex-row gap-12">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <SearchResultHeader query={q || "Tất cả"} count={totalCount} />
          <ProductGrid searchQuery={q} />
        </div>
      </main>
      <Footer />
    </>
  );
}
