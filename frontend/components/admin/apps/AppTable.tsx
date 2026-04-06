"use client";
import { AppItem } from "@/app/admin/(protected)/apps/appsService";
import { Pagination } from "@/components/ui/Pagination";
import { API_URL } from "@/configs/api";

const getImageUrl = (url?: string) => {
  if (!url) return "";
  if (
    url.startsWith("http") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  )
    return url;
  if (/^[a-fA-F0-9]{24}$/.test(url)) return "https://i.sstatic.net/l60Hf.png"; // Fallback for old corrupt icons
  return `${API_URL}/${url.replace(/\\/g, "/")}`;
};
interface Props {
  apps: AppItem[];
  isLoading: boolean;
  onAction: (
    app: AppItem,
    action: "approve" | "reject" | "delete" | "edit" | "info" | "publish",
  ) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}
export function AppTable({
  apps,
  isLoading,
  onAction,
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div className="bg-transparent md:bg-white md:rounded-2xl md:overflow-hidden">
      {" "}
      {/* DESKTOP TABLE VIEW */}{" "}
      <div className="hidden md:block">
        {" "}
        <table className="w-full text-sm">
          {" "}
          <thead>
            {" "}
            <tr className="text-slate-500 bg-slate-50/50 border-b border-slate-100/50">
              {" "}
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Ứng dụng
              </th>{" "}
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Tác giả
              </th>{" "}
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Danh mục
              </th>{" "}
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Trạng thái
              </th>{" "}
              <th className="text-right px-6 py-4 font-semibold text-slate-600">
                Thao tác
              </th>{" "}
            </tr>{" "}
          </thead>{" "}
          <tbody>
            {" "}
            {isLoading ? (
              <LoadingRows />
            ) : (
              <DataRows apps={apps} onAction={onAction} />
            )}{" "}
          </tbody>{" "}
        </table>{" "}
      </div>{" "}
      {/* MOBILE CARDS VIEW */}{" "}
      <div className="block md:hidden space-y-4">
        {" "}
        {isLoading ? (
          <LoadingCards />
        ) : (
          <MobileCards apps={apps} onAction={onAction} />
        )}{" "}
      </div>{" "}
      {!isLoading && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}{" "}
    </div>
  );
}
function LoadingRows() {
  return (
    <>
      {" "}
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          {" "}
          <td colSpan={5} className="px-6 py-4">
            <div className="h-4 bg-slate-100 rounded w-full" />
          </td>{" "}
        </tr>
      ))}{" "}
    </>
  );
}
function LoadingCards() {
  return (
    <>
      {" "}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white p-4 rounded-xl border border-slate-100"
        >
          {" "}
          <div className="flex gap-4 mb-4">
            {" "}
            <div className="w-12 h-12 bg-slate-100 rounded-lg"></div>{" "}
            <div className="flex-1">
              {" "}
              <div className="h-4 bg-slate-100 rounded w-1/2 mb-2"></div>{" "}
              <div className="h-3 bg-slate-100 rounded w-1/4"></div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="h-8 bg-slate-100 rounded w-full"></div>{" "}
        </div>
      ))}{" "}
    </>
  );
}
function ActionButtons({
  app,
  onAction,
  showLabels = false,
}: {
  app: AppItem;
  onAction: (
    app: AppItem,
    action: "approve" | "reject" | "delete" | "edit" | "info" | "publish",
  ) => void;
  showLabels?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${showLabels ? "justify-start mt-2 border-t border-slate-50 pt-3 flex-wrap" : "justify-end flex-wrap"}`}
    >
      {" "}
      <button
        title="Chi tiết"
        onClick={() => onAction(app, "info")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-semibold"
      >
        {" "}
        <span className="material-symbols-outlined text-sm">info</span>{" "}
        {showLabels && "Chi tiết"}{" "}
      </button>{" "}
      <button
        title="Sửa"
        onClick={() => onAction(app, "edit")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold"
      >
        {" "}
        <span className="material-symbols-outlined text-sm">edit</span>{" "}
        {showLabels && "Sửa"}{" "}
      </button>{" "}
      {app.status === "pending" && (
        <>
          {" "}
          <button
            title="Duyệt"
            onClick={() => onAction(app, "approve")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 text-xs font-semibold"
          >
            {" "}
            <span className="material-symbols-outlined text-sm">
              check_circle
            </span>{" "}
            {showLabels && "Duyệt"}{" "}
          </button>{" "}
          <button
            title="Từ chối"
            onClick={() => onAction(app, "reject")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 text-xs font-semibold"
          >
            {" "}
            <span className="material-symbols-outlined text-sm">
              cancel
            </span>{" "}
            {showLabels && "Từ chối"}{" "}
          </button>{" "}
        </>
      )}{" "}
      {app.status === "approved" && !app.isDeleted && (
        <button
          title="Xuất bản"
          onClick={() => onAction(app, "publish")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 text-xs font-semibold"
        >
          {" "}
          <span className="material-symbols-outlined text-sm">
            publish
          </span>{" "}
          {showLabels && "Xuất bản"}{" "}
        </button>
      )}{" "}
      {!app.isDeleted && (
        <button
          title="Xóa"
          onClick={() => onAction(app, "delete")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold"
        >
          {" "}
          <span className="material-symbols-outlined text-sm">delete</span>{" "}
          {showLabels && "Xóa"}{" "}
        </button>
      )}{" "}
    </div>
  );
}
function MobileCards({
  apps,
  onAction,
}: {
  apps: AppItem[];
  onAction: (
    app: AppItem,
    action: "approve" | "reject" | "delete" | "edit" | "info" | "publish",
  ) => void;
}) {
  if (apps.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 bg-white rounded-xl">
        Không tìm thấy ứng dụng nào.
      </div>
    );
  }
  return (
    <>
      {" "}
      {apps.map((app) => (
        <div
          key={app._id}
          className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col gap-3"
        >
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            {app.iconUrl ? (
              <img
                src={getImageUrl(app.iconUrl)}
                alt={app.name}
                className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-100"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                {" "}
                <span className="material-symbols-outlined text-slate-400">
                  apps
                </span>{" "}
              </div>
            )}{" "}
            <div className="flex-1 overflow-hidden">
              {" "}
              <h3 className="font-bold text-slate-800 truncate leading-tight">
                {app.name}
              </h3>{" "}
              <p className="text-xs text-slate-500 mb-0.5">
                {app.developerId?.name || "N/A"}
              </p>{" "}
              <div className="flex items-center gap-2 mt-1">
                {" "}
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {" "}
                  {app.price === 0
                    ? "Miễn phí"
                    : `${app.price.toLocaleString("vi-VN")} đ`}{" "}
                </span>{" "}
                {app.status === "published" && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                    Đã XB
                  </span>
                )}{" "}
                {app.status === "pending" && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                    Chờ duyệt
                  </span>
                )}{" "}
                {app.status === "rejected" && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                    Từ chối
                  </span>
                )}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <ActionButtons app={app} onAction={onAction} showLabels={true} />{" "}
        </div>
      ))}{" "}
    </>
  );
}
function DataRows({
  apps,
  onAction,
}: {
  apps: AppItem[];
  onAction: (
    app: AppItem,
    action: "approve" | "reject" | "delete" | "edit" | "info" | "publish",
  ) => void;
}) {
  if (apps.length === 0) {
    return (
      <tr>
        <td colSpan={5} className="text-center py-16 text-slate-400">
          Không tìm thấy ứng dụng nào.
        </td>
      </tr>
    );
  }
  return (
    <>
      {" "}
      {apps.map((app) => (
        <tr
          key={app._id}
          className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50"
        >
          {" "}
          <td className="px-6 py-4">
            {" "}
            <div className="flex items-center gap-3">
              {" "}
              {app.iconUrl ? (
                <img
                  src={getImageUrl(app.iconUrl)}
                  alt={app.name}
                  className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  {" "}
                  <span className="material-symbols-outlined text-slate-400">
                    apps
                  </span>{" "}
                </div>
              )}{" "}
              <div>
                {" "}
                <h3 className="font-semibold text-slate-800">
                  {app.name}
                </h3>{" "}
                <p className="text-xs text-slate-500">
                  {app.price === 0
                    ? "Miễn phí"
                    : `${app.price.toLocaleString("vi-VN")} đ`}
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </td>{" "}
          <td className="px-6 py-4">
            {" "}
            <p className="font-medium text-slate-700">
              {app.developerId?.name || "N/A"}
            </p>{" "}
            <p className="text-xs text-slate-400">
              {app.developerId?.contactEmail}
            </p>{" "}
          </td>{" "}
          <td className="px-6 py-4">
            {" "}
            <span className="inline-flex px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
              {" "}
              {app.categoryId?.name || "N/A"}{" "}
            </span>{" "}
          </td>{" "}
          <td className="px-6 py-4">
            {" "}
            {app.status === "published" && (
              <span className="text-green-600 bg-green-50 px-2.5 py-1 rounded-md text-xs font-semibold">
                Đã xuất bản
              </span>
            )}{" "}
            {app.status === "pending" && (
              <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md text-xs font-semibold">
                Chờ duyệt
              </span>
            )}{" "}
            {app.status === "rejected" && (
              <span className="text-red-600 bg-red-50 px-2.5 py-1 rounded-md text-xs font-semibold">
                Đã từ chối
              </span>
            )}{" "}
          </td>{" "}
          <td className="px-6 py-4 text-right">
            {" "}
            <ActionButtons
              app={app}
              onAction={onAction}
              showLabels={false}
            />{" "}
          </td>{" "}
        </tr>
      ))}{" "}
    </>
  );
}
