"use client";
import { useMyWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useMyWishlist();
  const removeMutation = useRemoveFromWishlist();

  const apps = wishlist?.appIds || [];

  const handleRemove = async (appId: string) => {
    try {
      await removeMutation.mutateAsync(appId);
    } catch {
      // silent fail
    }
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader totalApps={apps.length} />
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
              isRemoving={removeMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PageHeader({ totalApps }: { totalApps: number }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Danh sách Ước</h2>
        <p className="text-slate-500 text-sm mt-1">
          {totalApps} app{totalApps !== 1 ? "s" : ""} trong wishlist
        </p>
      </div>
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
      <button
        onClick={onRemove}
        disabled={isRemoving}
        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
      >
        <span className="material-symbols-outlined text-base text-red-500">
          favorite
        </span>
      </button>
    </div>
  );
}
