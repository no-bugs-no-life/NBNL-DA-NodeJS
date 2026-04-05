import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import TagsSidebar from "../../../components/category/Sidebar/TagsSidebar";
import FeaturedArea from "../../../components/category/FeaturedArea";
import ProductGrid from "../../../components/category/ProductGrid";


export default async function TagsPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 px-6 max-w-[1920px] mx-auto flex flex-col md:flex-row gap-12">
                <TagsSidebar />
                <div className="flex-1 min-w-0">
                    <FeaturedArea />
                    <ProductGrid />
                </div>
            </main>
            <Footer />
        </>
    );
}
