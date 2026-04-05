import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Sidebar from "../../components/category/Sidebar";
import FeaturedArea from "../../components/category/FeaturedArea";
import ProductGrid from "../../components/category/ProductGrid";

export default function CategoryPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-[1920px] mx-auto flex flex-col md:flex-row gap-12">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <FeaturedArea />
          <ProductGrid />
        </div>
      </main>
      <Footer />
    </>
  );
}
