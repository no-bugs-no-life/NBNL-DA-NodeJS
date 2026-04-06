"use client";
import { WishlistItem } from "@/hooks/useWishlist";
import { Pagination } from "@/components/ui/Pagination";
import { API_URL } from "@/configs/api";

const getImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:"))
    return url;
  if (/^[a-fA-F0-9]{24}$/.test(url)) return "https://i.sstatic.net/l60Hf.png";
  return `${API_URL}/${url.replace(/\\/g, "/")}`;
};

interface Props {
  wishlists: WishlistItem[];
  isLoading: boolean;
  onDelete: (wishlist: WishlistItem) => void;
  onView: (wishlist: WishlistItem) => void;
  onUpdate: (wishlist: WishlistItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export function WishlistTable({
  wishlists,
  isLoading,
  onDelete,
  onView,
  onUpdate,
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
                Số App
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Danh sách App
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
                wishlists={wishlists}
                onDelete={onDelete}
                onView={onView}
                onUpdate={onUpdate}
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
            wishlists={wishlists}
            onDelete={onDelete}
            onView={onView}
            onUpdate={onUpdate}
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
          <td colSpan={4} className="px-6 py-4">
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
  wishlist,
  onView,
  onUpdate,
  onDelete,
  showLabels = false,
}: {
  wishlist: WishlistItem;
  onView: (wishlist: WishlistItem) => void;
  onUpdate: (wishlist: WishlistItem) => void;
  onDelete: (wishlist: WishlistItem) => void;
  showLabels?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${showLabels ? "justify-start mt-2 border-t border-slate-50 pt-3 flex-wrap" : "justify-end"}`}
    >
      <button
        title="Xem"
        onClick={() => onView(wishlist)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-semibold"
      >
        <span className="material-symbols-outlined text-sm">visibility</span>
        {showLabels && "Xem"}
      </button>
      <button
        title="Sửa"
        onClick={() => onUpdate(wishlist)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold"
      >
        <span className="material-symbols-outlined text-sm">edit</span>
        {showLabels && "Sửa"}
      </button>
      <button
        title="Xoá"
        onClick={() => onDelete(wishlist)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold"
      >
        <span className="material-symbols-outlined text-sm">delete</span>
        {showLabels && "Xoá"}
      </button>
    </div>
  );
}

function MobileCards({
  wishlists,
  onDelete,
  onView,
  onUpdate,
}: {
  wishlists: WishlistItem[];
  onDelete: (w: WishlistItem) => void;
  onView: (w: WishlistItem) => void;
  onUpdate: (w: WishlistItem) => void;
}) {
  if (wishlists.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 bg-white rounded-xl">
        Chưa có wishlist nào.
      </div>
    );
  }
  return (
    <>
      {wishlists.map((w) => (
        <div
          key={w._id}
          className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col gap-3"
        >
          <UserCell user={w.userId} />
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="font-semibold text-slate-500">
              Số App:
              <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold ml-1">
                {w.appIds?.length || 0}
              </span>
            </span>
          </div>
          {w.appIds && w.appIds.length > 0 && (
            <div className="mt-1">
              <AppListCell apps={w.appIds || []} />
            </div>
          )}
          <ActionButtons
            wishlist={w}
            onView={onView}
            onUpdate={onUpdate}
            onDelete={onDelete}
            showLabels={true}
          />
        </div>
      ))}
    </>
  );
}

function DataRows({
  wishlists,
  onDelete,
  onView,
  onUpdate,
}: {
  wishlists: WishlistItem[];
  onDelete: (w: WishlistItem) => void;
  onView: (w: WishlistItem) => void;
  onUpdate: (w: WishlistItem) => void;
}) {
  if (wishlists.length === 0) {
    return (
      <tr>
        <td colSpan={4} className="text-center py-16 text-slate-400">
          Chưa có wishlist nào.
        </td>
      </tr>
    );
  }
  return (
    <>
      {wishlists.map((w) => (
        <tr
          key={w._id}
          className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-none"
        >
          <td className="px-6 py-4">
            <UserCell user={w.userId} />
          </td>
          <td className="px-6 py-4">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-sm">
              {w.appIds?.length || 0}
            </span>
          </td>
          <td className="px-6 py-4">
            <AppListCell apps={w.appIds || []} />
          </td>
          <td className="px-6 py-4 text-right">
            <ActionButtons
              wishlist={w}
              onView={onView}
              onUpdate={onUpdate}
              onDelete={onDelete}
              showLabels={false}
            />
          </td>
        </tr>
      ))}
    </>
  );
}

function UserCell({ user }: { user: WishlistItem["userId"] }) {
  const avatarUrl = user?.avatarUrl ? getImageUrl(user.avatarUrl) : "";
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <span className="material-symbols-outlined text-lg">person</span>
          </div>
        )}
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

function AppListCell({ apps }: { apps: WishlistItem["appIds"] }) {
  if (!apps || apps.length === 0)
    return <span className="text-slate-400 text-xs">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5 max-w-[240px]">
      {apps.slice(0, 4).map((app) => (
        <div
          key={app._id}
          title={app.name}
          className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 hover:ring-2 hover:ring-blue-500/50 transition-all"
        >
          {app.iconUrl ? (
            <img
              src={getImageUrl(app.iconUrl)}
              alt={app.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-sm">apps</span>
            </div>
          )}
        </div>
      ))}
      {apps.length > 4 && (
        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
          <span className="text-[10px] font-bold text-slate-500">
            +{apps.length - 4}
          </span>
        </div>
      )}
    </div>
  );
}
