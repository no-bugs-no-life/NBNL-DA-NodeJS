"use client";
import { SubscriptionItem } from "@/app/admin/(protected)/subscriptions/subscriptionsService";
import { Pagination } from "@/components/ui/Pagination";
interface Props {
  subscriptions: SubscriptionItem[];
  isLoading: boolean;
  onRenew: (sub: SubscriptionItem) => void;
  onCancel: (sub: SubscriptionItem) => void;
  onDelete: (sub: SubscriptionItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}
const TYPE_COLORS: Record<string, string> = {
  monthly: "bg-yellow-100 text-yellow-700",
  yearly: "bg-blue-100 text-blue-700",
  lifetime: "bg-green-100 text-green-700",
};
const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-50 text-green-600 border-green-200",
  expired: "bg-red-50 text-red-600 border-red-200",
  cancelled: "bg-slate-100 text-slate-500 border-slate-200",
};
const TYPE_LABELS: Record<string, string> = {
  monthly: "Hàng tháng",
  yearly: "Hàng năm",
  lifetime: "Vĩnh viễn",
};
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}
function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    active: "Hoạt động",
    expired: "Hết hạn",
    cancelled: "Đã hủy",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${STATUS_COLORS[status] || STATUS_COLORS.cancelled}`}
    >
      {labels[status] || status}
    </span>
  );
}
function UserCell({ user }: { user: SubscriptionItem["userId"] }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0 overflow-hidden">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          user.fullName?.charAt(0)?.toUpperCase() || "?"
        )}
      </div>
      <div className="min-w-0">
        <div className="font-medium text-slate-800 text-sm truncate">
          {user.fullName || "N/A"}
        </div>
        <div className="text-xs text-slate-400 truncate">
          {user.email || "—"}
        </div>
      </div>
    </div>
  );
}
function AppCell({ app }: { app: SubscriptionItem["appId"] }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0 overflow-hidden">
        {app.iconUrl ? (
          <img
            src={app.iconUrl}
            alt={app.name}
            className="w-full h-full object-cover"
          />
        ) : (
          app.name?.charAt(0)?.toUpperCase() || "?"
        )}
      </div>
      <div className="font-medium text-slate-700 text-sm truncate">
        {app.name || "N/A"}
      </div>
    </div>
  );
}
function ActionButtons({
  sub,
  onRenew,
  onCancel,
  onDelete,
  showLabels = false,
}: {
  sub: SubscriptionItem;
  onRenew: (s: SubscriptionItem) => void;
  onCancel: (s: SubscriptionItem) => void;
  onDelete: (s: SubscriptionItem) => void;
  showLabels?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${showLabels ? "justify-start mt-2 border-t border-slate-50 pt-3 flex-wrap" : "justify-end flex-wrap"}`}
    >
      {sub.status === "active" && (
        <button
          title="Gia hạn"
          onClick={() => onRenew(sub)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 text-xs font-semibold"
        >
          <span className="material-symbols-outlined text-sm">
            autorenew
          </span>
          {showLabels && "Gia hạn"}
        </button>
      )}
      {sub.status === "active" && (
        <button
          title="Hủy"
          onClick={() => onCancel(sub)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 text-xs font-semibold"
        >
          <span className="material-symbols-outlined text-sm">cancel</span>
          {showLabels && "Hủy"}
        </button>
      )}
      <button
        title="Xóa"
        onClick={() => onDelete(sub)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold"
      >
        <span className="material-symbols-outlined text-sm">delete</span>
        {showLabels && "Xóa"}
      </button>
    </div>
  );
}
function MobileCard({
  sub,
  onRenew,
  onCancel,
  onDelete,
}: {
  sub: SubscriptionItem;
  onRenew: (s: SubscriptionItem) => void;
  onCancel: (s: SubscriptionItem) => void;
  onDelete: (s: SubscriptionItem) => void;
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <UserCell user={sub.userId} /> <StatusBadge status={sub.status} />
      </div>
      <div className="flex items-center gap-3">
        <AppCell app={sub.appId} />
      </div>
      <div className="flex items-center justify-between text-xs mt-1 bg-slate-50 p-2 rounded-lg">
        <div>
          <span className="text-slate-400 font-medium block text-[10px] uppercase mb-0.5">
            Từ:
          </span>
          <span className="text-slate-700 font-semibold">
            {formatDate(sub.startDate)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 font-medium block text-[10px] uppercase mb-0.5">
            Đến:
          </span>
          <span className="text-slate-700 font-semibold">
            {formatDate(sub.endDate)}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-50 border-dashed">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${TYPE_COLORS[sub.packageId?.type || "monthly"]}`}
        >
          {TYPE_LABELS[sub.packageId?.type || "monthly"]}
        </span>
      </div>
      <ActionButtons
        sub={sub}
        onRenew={onRenew}
        onCancel={onCancel}
        onDelete={onDelete}
        showLabels={true}
      />
    </div>
  );
}
export function SubscriptionTable({
  subscriptions,
  isLoading,
  onRenew,
  onCancel,
  onDelete,
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <>
      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 bg-slate-50/50 border-b border-slate-100/50">
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Người dùng
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                App
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Loại
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Trạng thái
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Bắt đầu
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Hết hạn
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
                subscriptions={subscriptions}
                onRenew={onRenew}
                onCancel={onCancel}
                onDelete={onDelete}
              />
            )}
          </tbody>
        </table>
        {!isLoading && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
      {/* MOBILE CARDS */}
      <div className="block md:hidden space-y-4">
        {isLoading ? (
          <LoadingCards />
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-white rounded-xl">
            Chưa có subscription nào.
          </div>
        ) : (
          subscriptions.map((sub) => (
            <MobileCard
              key={sub._id}
              sub={sub}
              onRenew={onRenew}
              onCancel={onCancel}
              onDelete={onDelete}
            />
          ))
        )}
        {!isLoading && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </>
  );
}
function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-slate-50">
          <td colSpan={7} className="px-6 py-4">
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
            <div className="w-10 h-10 bg-slate-100 rounded-full shrink-0" />
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
function DataRows({
  subscriptions,
  onRenew,
  onCancel,
  onDelete,
}: {
  subscriptions: SubscriptionItem[];
  onRenew: (s: SubscriptionItem) => void;
  onCancel: (s: SubscriptionItem) => void;
  onDelete: (s: SubscriptionItem) => void;
}) {
  if (subscriptions.length === 0) {
    return (
      <tr>
        <td colSpan={8} className="text-center py-16 text-slate-400">
          Chưa có subscription nào.
        </td>
      </tr>
    );
  }
  return (
    <>
      {subscriptions.map((sub) => (
        <tr
          key={sub._id}
          className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 group"
        >
          <td className="px-6 py-4">
            <UserCell user={sub.userId} />
          </td>
          <td className="px-6 py-4">
            <AppCell app={sub.appId} />
          </td>
          <td className="px-6 py-4">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${TYPE_COLORS[sub.packageId?.type || "monthly"]}`}
            >
              {TYPE_LABELS[sub.packageId?.type || "monthly"]}
            </span>
          </td>
          <td className="px-6 py-4">
            <StatusBadge status={sub.status} />
          </td>
          <td className="px-6 py-4 text-xs font-medium text-slate-600">
            <p className="text-[10px] text-slate-400 uppercase tracking-tight mb-0.5">
              Từ:
            </p>
            {formatDate(sub.startDate)}
          </td>
          <td className="px-6 py-4 text-xs font-medium text-slate-600">
            <p className="text-[10px] text-slate-400 uppercase tracking-tight mb-0.5">
              Đến:
            </p>
            {formatDate(sub.endDate)}
          </td>
          <td className="px-6 py-4 text-right">
            <ActionButtons
              sub={sub}
              onRenew={onRenew}
              onCancel={onCancel}
              onDelete={onDelete}
              showLabels={false}
            />
          </td>
        </tr>
      ))}
    </>
  );
}
