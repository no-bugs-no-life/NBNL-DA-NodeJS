import AppReviewItem from "./AppReviewItem";

export default function AppReviews() {
  const reviews = [
    {
      name: "Trần Nam",
      initials: "TN",
      time: "2 ngày trước",
      text: "Phần mềm chỉnh sửa ảnh tuyệt vời nhất mà tôi từng sử dụng. Các tính năng AI mới thực sự giúp tiết kiệm rất nhiều thời gian trong quy trình làm việc hàng ngày của tôi.",
      rating: 5,
    },
    {
      name: "Hoàng Lan",
      initials: "HL",
      time: "1 tuần trước",
      text: "Rất mạnh mẽ nhưng cần máy cấu hình cao để chạy mượt mà. Tuy nhiên, không có sự thay thế nào xứng đáng cho các tính năng layer và masking của Photoshop.",
      rating: 4,
    },
  ];
  return (
    <section>
      <h2 className="text-3xl font-bold tracking-tight mb-8">
        Đánh giá từ người dùng
      </h2>
      <div className="space-y-6">
        {reviews.map((r, i) => (
          <AppReviewItem key={i} {...r} />
        ))}
        <button className="w-full py-4 border border-outline-variant rounded-xl font-semibold hover:bg-white transition-colors text-on-surface-variant">
          Xem tất cả 25,482 đánh giá
        </button>
      </div>
    </section>
  );
}
