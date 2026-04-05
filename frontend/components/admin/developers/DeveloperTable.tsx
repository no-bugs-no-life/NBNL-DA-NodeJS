"use client";
import { DeveloperItem } from "@/hooks/useDevelopers";
import { Pagination } from "@/components/ui/Pagination";

interface Props {
  developers: DeveloperItem[];
  isLoading: boolean;
  onAction: (
    dev: DeveloperItem,
    action: "edit" | "delete" | "approve" | "reject",
  ) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

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

export function DeveloperTable({
  developers,
  isLoading,
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
                Developer Profile
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Bio / Website
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Thống kê
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
              <DataRows developers={developers} onAction={onAction} />
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS VIEW */}
      <div className="block md:hidden space-y-4">
        {isLoading ? (
          <LoadingCards />
        ) : (
          <MobileCards developers={developers} onAction={onAction} />
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
        <tr
          key={i}
          className="animate-pulse border-b border-slate-50 lg:last:border-none"
        >
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
        </div>
      ))}
    </>
  );
}

function ActionButtons({
  dev,
  onAction,
  showLabels = false,
}: {
  dev: DeveloperItem;
  onAction: (
    dev: DeveloperItem,
    action: "edit" | "delete" | "approve" | "reject",
  ) => void;
  showLabels?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${showLabels ? "justify-start mt-2 border-t border-slate-50 pt-3 flex-wrap" : "justify-end flex-wrap"}`}
    >
      <button
        title="Sửa"
        onClick={() => onAction(dev, "edit")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold"
      >
        <span className="material-symbols-outlined text-sm">edit</span>
        {showLabels && "Sửa"}
      </button>
      {dev.status === "pending" && (
        <>
          <button
            title="Duyệt"
            onClick={() => onAction(dev, "approve")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-sm">
              check_circle
            </span>
            {showLabels && "Duyệt"}
          </button>
          <button
            title="Từ chối"
            onClick={() => onAction(dev, "reject")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-sm">cancel</span>
            {showLabels && "Từ chối"}
          </button>
        </>
      )}
      <button
        title="Xóa"
        onClick={() => onAction(dev, "delete")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold"
      >
        <span className="material-symbols-outlined text-sm">delete</span>
        {showLabels && "Xóa"}
      </button>
    </div>
  );
}

function MobileCards({
  developers,
  onAction,
}: {
  developers: DeveloperItem[];
  onAction: (
    dev: DeveloperItem,
    action: "edit" | "delete" | "approve" | "reject",
  ) => void;
}) {
  if (developers.length === 0)
    return (
      <div className="text-center py-12 text-slate-400 bg-white rounded-xl">
        Chưa có developer nào.
      </div>
    );
  return (
    <>
      {developers.map((dev) => (
        <div
          key={dev._id}
          className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col gap-3"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0">
              <img
                src={dev.avatarUrl || "https://i.sstatic.net/l60Hf.png"}
                alt={dev.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="font-bold text-slate-800 text-sm">{dev.name}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 break-all">
                {dev.userId?.email || "N/A"}
              </p>
              <div className="flex gap-2 text-xs text-slate-500 mt-1">
                <span title="Apps">
                  <span className="material-symbols-outlined text-[12px] inline-block align-middle mr-0.5">
                    apps
                  </span>
                  {dev.stats?.totalApps || 0}
                </span>
                <span title="Ratings">
                  <span className="material-symbols-outlined text-[12px] inline-block align-middle mr-0.5">
                    star
                  </span>
                  {dev.stats?.avgRating ? dev.stats.avgRating.toFixed(1) : "0"}
                </span>
              </div>
            </div>
          </div>
          {dev.bio && (
            <p className="text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2 line-clamp-2">
              {dev.bio}
            </p>
          )}
          <div className="flex items-center justify-between pt-1">
            <StatusBadge status={dev.status} />
          </div>
          <ActionButtons dev={dev} onAction={onAction} showLabels={true} />
        </div>
      ))}
    </>
  );
}

function DataRows({
  developers,
  onAction,
}: {
  developers: DeveloperItem[];
  onAction: (
    dev: DeveloperItem,
    action: "edit" | "delete" | "approve" | "reject",
  ) => void;
}) {
  if (developers.length === 0) {
    return (
      <tr>
        <td colSpan={5} className="text-center py-16 text-slate-400">
          Chưa có developer nào.
        </td>
      </tr>
    );
  }

  return (
    <>
      {developers.map((dev) => (
        <tr
          key={dev._id}
          className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-none"
        >
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                <img
                  src={dev.avatarUrl || "https://i.sstatic.net/l60Hf.png"}
                  alt={dev.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{dev.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  User: {dev.userId?.email || "N/A"}
                </p>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 max-w-[250px]">
            <p
              className="text-slate-600 text-xs line-clamp-1 mb-1"
              title={dev.bio}
            >
              {dev.bio || "Chưa có bio"}
            </p>
            {dev.website && (
              <a
                href={dev.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-[11px] font-mono hover:underline line-clamp-1 block"
              >
                {dev.website}
              </a>
            )}
          </td>
          <td className="px-6 py-4 text-slate-600 text-xs">
            <div className="flex flex-col gap-1">
              <span>
                Apps: <b>{dev.stats?.totalApps || 0}</b>
              </span>
              <span>
                Đánh giá:{" "}
                <b>
                  {dev.stats?.avgRating ? dev.stats.avgRating.toFixed(1) : "0"}
                </b>
              </span>
            </div>
          </td>
          <td className="px-6 py-4">
            <StatusBadge status={dev.status} />
          </td>
          <td className="px-6 py-4 text-right">
            <ActionButtons dev={dev} onAction={onAction} showLabels={false} />
          </td>
        </tr>
      ))}
    </>
  );
}
