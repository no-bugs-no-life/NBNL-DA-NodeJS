import FeaturedApp from "./FeaturedApp";
import PromoCard from "./PromoCard";

export default function FeaturedArea() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <FeaturedApp />
      <PromoCard />
    </div>
  );
}
