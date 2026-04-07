"use client";
import { CouponItem } from "@/app/admin/(protected)/coupons/couponsService";
import { Pagination } from "@/components/ui/Pagination";
interface Props {
  coupons: CouponItem[];
  isLoading: boolean;
  onEdit: (coupon: CouponItem) => void;
  onDelete: (coupon: CouponItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
function formatDateTime(d: string) {
  return new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function StatusBadge({ coupon }: { coupon: CouponItem }) {
  const now = new Date();
  const start = new Date(coupon.startDate);
  const end = new Date(coupon.endDate);
  const isActive = now >= start && now <= end;
  const isExpired = now > end;
  if (isExpired) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
        Hết hạn
      </span>
    );
  }
  if (!isActive) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        Chưa kích hoạt
      </span>
    );
  }
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
        Hết lượt
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
      Đang hoạt động
    </span>
  );
}
function DiscountBadge({ type, value }: { type: string; value: number }) {
  if (type === "percentage") {
    return <span className="font-bold text-blue-600">{value}%</span>;
  }
  return (
    <span className="font-bold text-purple-600">
      {value.toLocaleString("vi-VN")}đ
    </span>
  );
}
export function CouponTable({
  coupons,
  isLoading,
  onEdit,
  onDelete,
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
                Code
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Giảm giá
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Hạn sử dụng
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Lượt dùng
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
              <DataRows coupons={coupons} onEdit={onEdit} onDelete={onDelete} />
            )}
          </tbody>
        </table>
      </div>
      {/* MOBILE CARDS VIEW */}
      <div className="block md:hidden space-y-4">
        {isLoading ? (
          <LoadingCards />
        ) : (
          <MobileCards coupons={coupons} onEdit={onEdit} onDelete={onDelete} />
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
        <tr key={i} className="animate-pulse">
          <td colSpan={6} className="px-6 py-4">
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
          <div className="h-4 bg-slate-100 rounded w-1/2 mb-3" />
          <div className="h-3 bg-slate-100 rounded w-3/4 mb-2" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
      ))}
    </>
  );
}
function ActionButtons({
  coupon,
  onEdit,
  onDelete,
  showLabels = false,
}: {
  coupon: CouponItem;
  onEdit: (c: CouponItem) => void;
  onDelete: (c: CouponItem) => void;
  showLabels?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${showLabels ? "justify-start mt-2 border-t border-slate-50 pt-3 flex-wrap" : "justify-end"}`}
    >
      <button
        title="Sửa"
        onClick={() => onEdit(coupon)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold"
      >
        <span className="material-symbols-outlined text-sm">edit</span>
        {showLabels && "Sửa"}
      </button>
      <button
        title="Xóa"
        onClick={() => onDelete(coupon)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold"
      >
        <span className="material-symbols-outlined text-sm">delete</span>
        {showLabels && "Xóa"}
      </button>
    </div>
  );
}
function MobileCards({
  coupons,
  onEdit,
  onDelete,
}: {
  coupons: CouponItem[];
  onEdit: (c: CouponItem) => void;
  onDelete: (c: CouponItem) => void;
}) {
  if (coupons.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 bg-white rounded-xl">
        Chưa có coupon nào.
      </div>
    );
  }
  return (
    <>
      {coupons.map((c) => (
        <div
          key={c._id}
          className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col gap-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-mono font-bold text-slate-800 text-base">
                {c.code}
              </p>
              <p className="text-sm text-slate-500 mt-0.5">
                {formatDate(c.startDate)} → {formatDate(c.endDate)}
              </p>
            </div>
            <StatusBadge coupon={c} />
          </div>
          <div className="flex items-center gap-4 text-sm mt-1">
            <div>
              <span className="text-slate-400 text-xs">Giảm: </span>
              <DiscountBadge
                type={c.discountType}
                value={c.discountValue}
              />
            </div>
            <div className="text-slate-200">|</div>
            <div className="text-sm">
              <span className="text-slate-400 text-xs">Lượt dùng: </span>
              <span className="font-semibold text-slate-700 mx-1">
                {c.usedCount}
              </span>
              <span className="text-slate-400 text-xs">
                {c.usageLimit > 0 ? `/ ${c.usageLimit}` : ""}
              </span>
            </div>
          </div>
          <ActionButtons
            coupon={c}
            onEdit={onEdit}
            onDelete={onDelete}
            showLabels={true}
          />
        </div>
      ))}
    </>
  );
}
function DataRows({
  coupons,
  onEdit,
  onDelete,
}: {
  coupons: CouponItem[];
  onEdit: (c: CouponItem) => void;
  onDelete: (c: CouponItem) => void;
}) {
  if (coupons.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="text-center py-16 text-slate-400">
          Chưa có coupon nào.
        </td>
      </tr>
    );
  }
  return (
    <>
      {coupons.map((c) => (
        <tr
          key={c._id}
          className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50"
        >
          <td className="px-6 py-4">
            <p className="font-mono font-bold text-slate-800">{c.code}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {formatDateTime(c.createdAt)}
            </p>
          </td>
          <td className="px-6 py-4">
            <DiscountBadge type={c.discountType} value={c.discountValue} />
          </td>
          <td className="px-6 py-4 text-slate-600 text-xs tracking-tight">
            <p>
              Từ:
              <span className="font-medium text-slate-700">
                {formatDate(c.startDate)}
              </span>
            </p>
            <p>
              Đến:
              <span className="font-medium text-slate-700">
                {formatDate(c.endDate)}
              </span>
            </p>
          </td>
          <td className="px-6 py-4">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-700">
                {c.usedCount}
                {c.usageLimit > 0 ? ` / ${c.usageLimit}` : " / ∞"}
              </span>
              {c.usageLimit > 0 && (
                <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${c.usedCount >= c.usageLimit ? "bg-red-400" : "bg-blue-400"}`}
                    style={{
                      width: `${Math.min(100, (c.usedCount / c.usageLimit) * 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </td>
          <td className="px-6 py-4">
            <StatusBadge coupon={c} />
          </td>
          <td className="px-6 py-4 text-right">
            <ActionButtons
              coupon={c}
              onEdit={onEdit}
              onDelete={onDelete}
              showLabels={false}
            />
          </td>
        </tr>
      ))}
    </>
  );
}
