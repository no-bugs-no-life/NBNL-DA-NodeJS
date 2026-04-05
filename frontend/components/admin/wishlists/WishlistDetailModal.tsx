"use client";
import { WishlistItem } from "@/hooks/useWishlist";
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
      {" "}
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {" "}
        <ModalHeader user={wishlist.userId} onClose={onClose} />{" "}
        <div className="p-6 overflow-y-auto flex-1">
          {" "}
          {apps.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {" "}
              {apps.map((app) => (
                <AppCard
                  key={app._id}
                  app={app}
                  isRemoving={removingAppId === app._id}
                  onRemove={() => onRemoveApp(app._id)}
                />
              ))}{" "}
            </div>
          )}{" "}
        </div>{" "}
        <ModalFooter onClose={onClose} totalApps={apps.length} />{" "}
      </div>{" "}
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
  return (
    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
      {" "}
      <div>
        {" "}
        <h2 className="text-xl font-bold text-slate-800">
          Chi tiết Wishlist
        </h2>{" "}
        <p className="text-xs text-slate-500 mt-1">
          {user?.fullName} · {user?.email}
        </p>{" "}
      </div>{" "}
      <button
        onClick={onClose}
        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
      >
        {" "}
        <span className="material-symbols-outlined text-xl">close</span>{" "}
      </button>{" "}
    </div>
  );
}
function EmptyState() {
  return (
    <div className="text-center py-12">
      {" "}
      <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">
        favorite_border
      </span>{" "}
      <p className="text-slate-500 text-sm">
        Không có app nào trong wishlist
      </p>{" "}
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
      {" "}
      <p className="text-sm text-slate-500">
        {totalApps} app{totalApps !== 1 ? "s" : ""} trong wishlist
      </p>{" "}
      <button
        onClick={onClose}
        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
      >
        {" "}
        Đóng{" "}
      </button>{" "}
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
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group">
      {" "}
      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
        {" "}
        <img
          src={app.iconUrl || "https://i.sstatic.net/l60Hf.png"}
          alt={app.name}
          className="w-full h-full object-cover"
        />{" "}
      </div>{" "}
      <div className="flex-1 min-w-0">
        {" "}
        <p className="font-semibold text-slate-800 text-sm truncate">
          {app.name}
        </p>{" "}
        <p className="text-xs text-slate-500">
          {" "}
          {app.price === 0 ? "Miễn phí" : `$${app.price}`}{" "}
          {app.developerId?.fullName && ` · ${app.developerId.fullName}`}{" "}
        </p>{" "}
      </div>{" "}
      <button
        onClick={onRemove}
        disabled={isRemoving}
        className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition-all disabled:opacity-50"
      >
        {" "}
        {isRemoving ? (
          <span className="material-symbols-outlined text-sm animate-spin">
            progress_activity
          </span>
        ) : (
          <span className="material-symbols-outlined text-sm">delete</span>
        )}{" "}
        Xoá{" "}
      </button>{" "}
    </div>
  );
}
