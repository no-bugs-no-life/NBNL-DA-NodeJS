import AppReviewItem from "./AppReviewItem";
import { useAppDetailStore } from "../../store/useAppDetailStore";

export default function AppReviews() {
  const { appInfo } = useAppDetailStore();

  const reviews = appInfo?.reviews && appInfo.reviews.length > 0 ? appInfo.reviews : [
    {
      userId: { fullName: "Người dùng Khách" },
      createdAt: new Date().toISOString(),
      comment: "Chưa có đánh giá nào. Hãy là người đầu tiên trải nghiệm và đánh giá phần mềm này!",
      rating: 5,
    }
  ];

  const ratingCountFormatted = appInfo?.ratingCount
    ? (appInfo.ratingCount >= 1000 ? `${(appInfo.ratingCount / 1000).toFixed(1)}K` : appInfo.ratingCount.toLocaleString())
    : 0;

  return (
    <section>
      <h2 className="text-3xl font-bold tracking-tight mb-8">
        Đánh giá từ người dùng
      </h2>
      <div className="space-y-6">
        {reviews.map((r, i) => (
          <AppReviewItem key={i} {...r} />
        ))}
        {appInfo?.ratingCount && appInfo.ratingCount > 0 ? (
          <button className="w-full py-4 border border-outline-variant rounded-xl font-semibold hover:bg-white transition-colors text-on-surface-variant">
            Xem tất cả {ratingCountFormatted} đánh giá
          </button>
        ) : null}
      </div>
    </section>
  );
}
