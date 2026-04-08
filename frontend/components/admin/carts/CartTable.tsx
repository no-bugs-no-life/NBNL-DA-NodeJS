"use client";
import { CartItem } from "@/hooks/useCart";
import { Pagination } from "@/components/ui/Pagination";
interface Props {
  carts: CartItem[];
  isLoading: boolean;
  onView: (cart: CartItem) => void;
  onDelete: (cart: CartItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}
export function CartTable({
  carts,
  isLoading,
  onView,
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
                Người dùng
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Số Items
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Tổng tiền
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Cập nhật
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
              <DataRows carts={carts} onView={onView} onDelete={onDelete} />
            )}
          </tbody>
        </table>
      </div>
      {/* MOBILE CARDS VIEW */}
      <div className="block md:hidden space-y-4">
        {isLoading ? (
          <LoadingCards />
        ) : (
          <MobileCards carts={carts} onView={onView} onDelete={onDelete} />
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
            <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0" />
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
function ActionButtons({
  cart,
  onView,
  onDelete,
  showLabels = false,
}: {
  cart: CartItem;
  onView: (cart: CartItem) => void;
  onDelete: (cart: CartItem) => void;
  showLabels?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${showLabels ? "justify-start mt-2 border-t border-slate-50 pt-3 flex-wrap" : "justify-end"}`}
    >
      <button
        title="Xem"
        onClick={() => onView(cart)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold"
      >
        <span className="material-symbols-outlined text-sm">
          visibility
        </span>
        {showLabels && "Xem"}
      </button>
      <button
        title="Xoá"
        onClick={() => onDelete(cart)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold"
      >
        <span className="material-symbols-outlined text-sm">delete</span>
        {showLabels && "Xoá"}
      </button>
    </div>
  );
}
function MobileCards({
  carts,
  onView,
  onDelete,
}: {
  carts: CartItem[];
  onView: (cart: CartItem) => void;
  onDelete: (cart: CartItem) => void;
}) {
  if (carts.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 bg-white rounded-xl">
        Chưa có cart nào.
      </div>
    );
  }
  return (
    <>
      {carts.map((cart) => (
        <div
          key={cart._id}
          className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col gap-3"
        >
          <div className="flex items-start justify-between">
            <UserCell user={cart.user} />
          </div>
          <div className="flex items-center justify-between mt-1 text-xs">
            <span className="font-semibold text-slate-500">
              Số Items:
              <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold ml-1">
                {cart.items?.length || 0}
              </span>
            </span>
            <span className="font-semibold text-slate-500">
              Tổng:
              <span className="text-slate-800 font-mono font-bold text-sm ml-1">
                ${cart.totalPrice?.toFixed(2) || "0.00"}
              </span>
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>
              Cập nhật:
              {cart.updatedAt
                ? new Date(cart.updatedAt).toLocaleDateString("vi-VN")
                : "—"}
            </span>
          </div>
          <ActionButtons
            cart={cart}
            onView={onView}
            onDelete={onDelete}
            showLabels={true}
          />
        </div>
      ))}
    </>
  );
}
function DataRows({
  carts,
  onView,
  onDelete,
}: {
  carts: CartItem[];
  onView: (c: CartItem) => void;
  onDelete: (c: CartItem) => void;
}) {
  if (carts.length === 0) {
    return (
      <tr>
        <td colSpan={5} className="text-center py-16 text-slate-400">
          Chưa có cart nào.
        </td>
      </tr>
    );
  }
  return (
    <>
      {carts.map((cart) => (
        <tr
          key={cart._id}
          className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none group"
        >
          <td className="px-6 py-4">
            <UserCell user={cart.user} />
          </td>
          <td className="px-6 py-4">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-sm">
              {cart.items?.length || 0}
            </span>
          </td>
          <td className="px-6 py-4">
            <span className="font-bold text-slate-800 font-mono text-sm">
              ${cart.totalPrice?.toFixed(2) || "0.00"}
            </span>
          </td>
          <td className="px-6 py-4 text-slate-400 text-xs">
            {cart.updatedAt
              ? new Date(cart.updatedAt).toLocaleDateString("vi-VN")
              : "—"}
          </td>
          <td className="px-6 py-4 text-right">
            <ActionButtons
              cart={cart}
              onView={onView}
              onDelete={onDelete}
              showLabels={false}
            />
          </td>
        </tr>
      ))}
    </>
  );
}
function UserCell({ user }: { user: CartItem["user"] }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
        <img
          src={user?.avatarUrl || "https://i.sstatic.net/l60Hf.png"}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <p className="font-semibold text-slate-800 text-sm leading-tight">
          {user?.fullName || "Người dùng ẩn"}
        </p>
        {user?.email && (
          <p className="text-[11px] text-slate-500 mt-0.5">{user.email}</p>
        )}
      </div>
    </div>
  );
}
