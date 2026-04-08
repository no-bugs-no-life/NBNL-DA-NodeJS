"use client";
import Link from "next/link";
import { useMemo } from "react";
import {
  useMyWishlist,
  useRemoveFromWishlist,
  useClearWishlist,
} from "@/hooks/useWishlist";

export default function WishlistPage() {
  const { data: wishlist, isLoading, isError, refetch } = useMyWishlist();
  const removeMutation = useRemoveFromWishlist();
  const clearMutation = useClearWishlist();

  const apps = useMemo(() => wishlist?.apps || wishlist?.appIds || [], [wishlist]);

  const handleRemove = async (appId: string) => {
    try {
      await removeMutation.mutateAsync(appId);
    } catch {
      // silent fail
    }
  };

  const handleClear = async () => {
    if (apps.length === 0 || clearMutation.isPending) return;
    try {
      await clearMutation.mutateAsync();
    } catch {
      // silent fail
    }
  };

  if (isError) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-sm mx-auto">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M6.938 4h10.124c1.54 0 2.502 1.667 1.732 3L13.732 19c-.77 1.333-2.694 1.333-3.464 0L5.206 7c-.77-1.333.192-3 1.732-3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Không tải được Wishlist
          </h2>
          <p className="text-slate-500 text-sm mb-4">
            Đã có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <PageHeader
        totalApps={apps.length}
        onClear={handleClear}
        clearing={clearMutation.isPending}
      />
      {isLoading ? (
        <LoadingSkeleton />
      ) : apps.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {apps.map((app) => (
            <AppCard
              key={app._id}
              app={app}
              onRemove={() => handleRemove(app._id)}
              isRemoving={removeMutation.isPending || clearMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PageHeader({
  totalApps,
  onClear,
  clearing,
}: {
  totalApps: number;
  onClear: () => void;
  clearing: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Danh sách Ước</h2>
        <p className="text-slate-500 text-sm mt-1">
          {totalApps} app{totalApps !== 1 ? "s" : ""} trong wishlist
        </p>
      </div>

      {totalApps > 0 ? (
        <button
          onClick={onClear}
          disabled={clearing}
          className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          {clearing ? "Đang xoá..." : "Xoá tất cả"}
        </button>
      ) : null}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center text-center max-w-sm mx-auto">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
          <svg
            className="w-8 h-8 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Danh sách Ước
        </h2>
        <p className="text-slate-500 text-sm">
          Hiển thị các tựa game và ứng dụng bạn đã yêu thích nhưng chưa mua.
        </p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden border border-slate-100 animate-pulse"
        >
          <div className="aspect-square bg-slate-100" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-slate-100 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function AppCard({
  app,
  onRemove,
  isRemoving,
}: {
  app: any;
  onRemove: () => void;
  isRemoving: boolean;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-100 hover:shadow-md transition-shadow group relative">
      <Link href={`/apps/${app._id}`} className="block">
        <div className="aspect-square bg-slate-100 overflow-hidden">
          <img
            src={app.iconUrl || "https://i.sstatic.net/l60Hf.png"}
            alt={app.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-3">
          <p className="font-semibold text-slate-800 text-sm truncate">
            {app.name}
          </p>
          <p className="text-slate-500 text-xs mt-0.5">
            {app.price === 0 ? "Miễn phí" : `$${app.price}`}
          </p>
        </div>
      </Link>

      <button
        onClick={onRemove}
        disabled={isRemoving}
        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-base text-red-500">
          favorite
        </span>
      </button>
    </div>
  );
}
