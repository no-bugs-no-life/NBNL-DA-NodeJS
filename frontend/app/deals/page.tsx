import CategorySidebar from "@/components/category/Sidebar";
import DealHero from "@/components/deals/DealHero";
import DealGrid from "@/components/deals/DealGrid";

export const metadata = {
  title: "Khuyến mãi | Horizon Store",
  description: "Các ứng dụng và trò chơi đang giảm giá tại Horizon Store",
};

export default function DealsPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full lg:w-64 flex-shrink-0">
        <CategorySidebar />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-8">
        <DealHero />

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Tất cả khuyến mãi</h2>
          </div>
          <DealGrid />
        </section>
      </div>
    </div>
  );
}
