"use client";
import { WishlistItem } from "@/hooks/useWishlist";
import { API_URL } from "@/configs/api";

const getImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:"))
    return url;
  if (/^[a-fA-F0-9]{24}$/.test(url)) return "https://i.sstatic.net/l60Hf.png";
  return `${API_URL}/${url.replace(/\\/g, "/")}`;
};

interface Props {
  wishlist: WishlistItem;
  onClose: () => void;
  onRemoveApp: (appId: string) => void;
  removingAppId?: string;
}

export function WishlistDetailModal({
  wishlist,
  onClose,
  onRemoveApp,
  removingAppId,
}: Props) {
  const apps = wishlist.appIds || [];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        <ModalHeader user={wishlist.userId} onClose={onClose} />
        <div className="p-6 overflow-y-auto flex-1">
          {apps.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {apps.map((app) => (
                <AppCard
                  key={app._id}
                  app={app}
                  isRemoving={removingAppId === app._id}
                  onRemove={() => onRemoveApp(app._id)}
                />
              ))}
            </div>
          )}
        </div>
        <ModalFooter onClose={onClose} totalApps={apps.length} />
      </div>
    </div>
  );
}

function ModalHeader({
  user,
  onClose,
}: {
  user: WishlistItem["userId"];
  onClose: () => void;
}) {
  const avatarUrl = user?.avatarUrl ? getImageUrl(user.avatarUrl) : "";
  return (
    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-lg">person</span>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Chi tiết Wishlist</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {user?.fullName || "Người dùng ẩn"} · {user?.email}
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">
        favorite_border
      </span>
      <p className="text-slate-500 text-sm">
        Không có app nào trong wishlist
      </p>
    </div>
  );
}

function ModalFooter({
  onClose,
  totalApps,
}: {
  onClose: () => void;
  totalApps: number;
}) {
  return (
    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
      <p className="text-sm text-slate-500">
        {totalApps} app{totalApps !== 1 ? "s" : ""} trong wishlist
      </p>
      <button
        onClick={onClose}
        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
      >
        Đóng
      </button>
    </div>
  );
}

function AppCard({
  app,
  isRemoving,
  onRemove,
}: {
  app: WishlistItem["appIds"][0];
  isRemoving: boolean;
  onRemove: () => void;
}) {
  const iconUrl = app.iconUrl ? getImageUrl(app.iconUrl) : "";
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group">
      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={app.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <span className="material-symbols-outlined text-xl">apps</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 text-sm truncate">
          {app.name}
        </p>
        <p className="text-xs text-slate-500">
          {app.price === 0 ? "Miễn phí" : `$${app.price}`}
          {app.developerId?.name && ` · ${app.developerId.name}`}
        </p>
      </div>
      <button
        onClick={onRemove}
        disabled={isRemoving}
        className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition-all disabled:opacity-50"
      >
        {isRemoving ? (
          <span className="material-symbols-outlined text-sm animate-spin">
            progress_activity
          </span>
        ) : (
          <span className="material-symbols-outlined text-sm">delete</span>
        )}
        Xoá
      </button>
    </div>
  );
}
