import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Sidebar from "../../components/category/Sidebar";
import ProductGrid from "../../components/category/ProductGrid";
import SearchResultHeader from "../../components/search/SearchResultHeader";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-[1920px] mx-auto flex flex-col md:flex-row gap-12">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <SearchResultHeader query={q || "Tất cả"} count={50} />
          <ProductGrid />
        </div>
      </main>
      <Footer />
    </>
  );
}
