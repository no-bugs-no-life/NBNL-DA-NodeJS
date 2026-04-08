interface AppReviewItemProps {
  userId?: { fullName?: string; email?: string; avatarUrl?: string };
  createdAt?: string;
  comment?: string;
  rating?: number;
}

export default function AppReviewItem({
  userId,
  createdAt,
  comment,
  rating = 0,
}: AppReviewItemProps) {
  const name = userId?.fullName || "Người dùng Khách";
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "NK";

  const dateObj = createdAt ? new Date(createdAt) : new Date();
  const time = dateObj.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const safeRating =
    typeof rating === "number" && Number.isFinite(rating)
      ? Math.min(5, Math.max(0, Math.round(rating)))
      : 0;

  return (
    <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary overflow-hidden">
            {userId?.avatarUrl ? (
              <img
                src={userId.avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div>
            <h4 className="font-bold">{name}</h4>
            <div className="flex text-primary text-sm">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className="material-symbols-outlined text-[16px]"
                  style={{
                    fontVariationSettings: `'FILL' ${n <= safeRating ? 1 : 0}`,
                  }}
                >
                  star
                </span>
              ))}
            </div>
          </div>
        </div>
        <span className="text-sm text-on-surface-variant">{time}</span>
      </div>
      <p className="text-on-surface-variant leading-relaxed">
        {comment || "Không có bình luận"}
      </p>
    </div>
  );
}
