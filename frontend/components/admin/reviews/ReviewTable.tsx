"use client";
import { ReviewItem } from "@/app/admin/(protected)/reviews/reviewsService";
import { Pagination } from "@/components/ui/Pagination";
type ReviewAction = "approve" | "reject" | "delete" | "reset" | "edit";
interface Props {
  reviews: ReviewItem[];
  isLoading: boolean;
  isPendingFilter: boolean;
  onAction: (review: ReviewItem, action: ReviewAction) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}
const STATUS_LABEL: Record<string, string> = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-[16px] ${i < rating ? "text-amber-400" : "text-slate-200"}`}
          style={{
            fontVariationSettings: i < rating ? '"FILL" 1' : '"FILL" 0',
          }}
        >
          star
        </span>
      ))}
    </div>
  );
}
function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  if (avatarUrl)
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="w-9 h-9 rounded-full object-cover bg-slate-100"
      />
    );
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
      {initials}
    </div>
  );
}
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "text-amber-600 bg-amber-50",
    approved: "text-green-600 bg-green-50",
    rejected: "text-red-600 bg-red-50",
  };
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-md ${styles[status] ?? "text-slate-500 bg-slate-50"}`}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
function ActionButton({
  action,
  review,
  onAction,
  showLabel,
}: {
  action: ReviewAction;
  review: ReviewItem;
  onAction: (r: ReviewItem, a: ReviewAction) => void;
  showLabel?: boolean;
}) {
  const configs: Record<
    ReviewAction,
    { label: string; icon: string; color: string }
  > = {
    approve: {
      label: "Duyệt",
      icon: "check_circle",
      color: "bg-green-50 text-green-600 hover:bg-green-100",
    },
    reject: {
      label: "Từ chối",
      icon: "cancel",
      color: "bg-amber-50 text-amber-600 hover:bg-amber-100",
    },
    reset: {
      label: "Đặt lại",
      icon: "restart_alt",
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    },
    delete: {
      label: "Xoá",
      icon: "delete",
      color: "bg-red-50 text-red-600 hover:bg-red-100",
    },
    edit: {
      label: "Sửa",
      icon: "edit",
      color: "bg-amber-100 text-amber-700 hover:bg-amber-200",
    },
  };
  const cfg = configs[action];
  return (
    <button
      title={cfg.label}
      onClick={() => onAction(review, action)}
      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${cfg.color}`}
    >
      <span className="material-symbols-outlined text-sm">{cfg.icon}</span>
      {showLabel && cfg.label}
    </button>
  );
}
export function ReviewTable({
  reviews,
  isLoading,
  isPendingFilter,
  onAction,
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div className="bg-transparent md:bg-white md:rounded-2xl md:overflow-hidden">
      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 bg-slate-50/50 border-b border-slate-100/50">
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Người dùng
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Ứng dụng
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Đánh giá
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Trạng thái
              </th>
              <th className="text-right px-6 py-4 font-semibold text-slate-600">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <LoadingRows />
            ) : (
              <DataRows
                reviews={reviews}
                isPendingFilter={isPendingFilter}
                onAction={onAction}
              />
            )}
          </tbody>
        </table>
      </div>
      {/* MOBILE CARDS VIEW */}
      <div className="block md:hidden space-y-4">
        {isLoading ? (
          <LoadingCards />
        ) : (
          <MobileCards
            reviews={reviews}
            isPendingFilter={isPendingFilter}
            onAction={onAction}
          />
        )}
      </div>
      {!isLoading && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-slate-50">
          <td colSpan={5} className="px-6 py-4">
            <div className="h-4 bg-slate-100 rounded w-full" />
          </td>
        </tr>
      ))}
    </>
  );
}
function LoadingCards() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white p-4 rounded-xl border border-slate-100"
        >
          <div className="flex gap-4 mb-4">
            <div className="w-9 h-9 bg-slate-100 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-slate-100 rounded w-1/2 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-1/4" />
            </div>
          </div>
          <div className="h-8 bg-slate-100 rounded w-full" />
        </div>
      ))}
    </>
  );
}
function MobileCards({
  reviews,
  isPendingFilter,
  onAction,
}: {
  reviews: ReviewItem[];
  isPendingFilter: boolean;
  onAction: (r: ReviewItem, a: ReviewAction) => void;
}) {
  if (reviews.length === 0)
    return (
      <div className="text-center py-12 text-slate-400 bg-white rounded-xl">
        Không tìm thấy đánh giá nào.
      </div>
    );
  return (
    <>
      {reviews.map((review) => (
        <div
          key={review._id}
          className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col gap-3"
        >
          <div className="flex items-start gap-3">
            <Avatar
              name={review.userId?.fullName || "Người dùng vô danh"}
              avatarUrl={review.userId?.avatarUrl}
            />
            <div className="flex-1 overflow-hidden">
              <h3 className="font-bold text-slate-800 text-sm">
                {review.userId?.fullName || "Người dùng vô danh"}
              </h3>
              <p className="text-xs text-slate-500">
                {review.appId?.name || "Ứng dụng đã xoá"}
              </p>
              <div className="mt-1.5">
                <StarRating rating={review.rating} />
              </div>
            </div>
          </div>
          {review.comment && (
            <p className="text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2 line-clamp-2">
              {review.comment}
            </p>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
            <StatusBadge status={review.status} />
            <MobileActions
              review={review}
              isPendingFilter={isPendingFilter}
              onAction={onAction}
            />
          </div>
        </div>
      ))}
    </>
  );
}
function MobileActions({
  review,
  isPendingFilter,
  onAction,
}: {
  review: ReviewItem;
  isPendingFilter: boolean;
  onAction: (r: ReviewItem, a: ReviewAction) => void;
}) {
  const actions = getRowActions(review, isPendingFilter);
  if (!actions.length) return null;
  return (
    <div className="flex items-center gap-1.5">
      {actions.map((a) => (
        <ActionButton
          key={a}
          action={a}
          review={review}
          onAction={onAction}
          showLabel={false}
        />
      ))}
    </div>
  );
}
function getRowActions(
  review: ReviewItem,
  isPendingFilter: boolean,
): ReviewAction[] {
  if (isPendingFilter) {
    return review.status === "pending" ? ["edit", "approve", "reject"] : [];
  }
  switch (review.status) {
    case "pending":
      return ["edit", "approve", "reject", "delete"];
    case "approved":
      return ["edit", "reset", "delete"];
    case "rejected":
      return ["edit", "approve", "delete"];
    default:
      return ["edit", "delete"];
  }
}
function DataRows({
  reviews,
  isPendingFilter,
  onAction,
}: {
  reviews: ReviewItem[];
  isPendingFilter: boolean;
  onAction: (r: ReviewItem, a: ReviewAction) => void;
}) {
  if (reviews.length === 0)
    return (
      <tr>
        <td colSpan={5} className="text-center py-16 text-slate-400">
          Không tìm thấy đánh giá nào.
        </td>
      </tr>
    );
  return (
    <>
      {reviews.map((review) => {
        const actions = getRowActions(review, isPendingFilter);
        return (
          <tr
            key={review._id}
            className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 group"
          >
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <Avatar
                  name={review.userId?.fullName || "Người dùng vô danh"}
                  avatarUrl={review.userId?.avatarUrl}
                />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    {review.userId?.fullName || "Người dùng vô danh"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {review.userId?.email || ""}
                  </p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <p className="font-medium text-slate-700 text-sm">
                {review.appId?.name || "Ứng dụng đã xoá"}
              </p>
            </td>
            <td className="px-6 py-4">
              <StarRating rating={review.rating} />
              {review.comment && (
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 max-w-xs">
                  {review.comment}
                </p>
              )}
            </td>
            <td className="px-6 py-4">
              <StatusBadge status={review.status} />
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex items-center justify-end gap-2">
                {actions.map((a) => (
                  <ActionButton
                    key={a}
                    action={a}
                    review={review}
                    onAction={onAction}
                    showLabel={false}
                  />
                ))}
              </div>
            </td>
          </tr>
        );
      })}
    </>
  );
}
