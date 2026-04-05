"use client";
import { SubPackageItem } from "@/app/admin/(protected)/sub-packages/subPackagesService";
import { Pagination } from "@/components/ui/Pagination";
interface Props {
  packages: SubPackageItem[];
  isLoading: boolean;
  onEdit: (pkg: SubPackageItem) => void;
  onDelete: (pkg: SubPackageItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}
const TYPE_COLORS: Record<string, string> = {
  monthly: "bg-yellow-100 text-yellow-700",
  yearly: "bg-blue-100 text-blue-700",
  lifetime: "bg-green-100 text-green-700",
};
const TYPE_LABELS: Record<string, string> = {
  monthly: "Hàng tháng",
  yearly: "Hàng năm",
  lifetime: "Vĩnh viễn",
};
function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}
function formatDuration(days: number): string {
  if (days === 0) return "Vĩnh viễn";
  if (days === 30) return "1 tháng";
  if (days === 365) return "1 năm";
  return `${days} ngày`;
}
export function SubPackageTable({
  packages,
  isLoading,
  onEdit,
  onDelete,
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <>
      {" "}
      <div className="hidden md:block bg-white rounded-2xl overflow-hidden">
        {" "}
        <table className="w-full text-sm">
          {" "}
          <thead>
            {" "}
            <tr className="text-slate-500 bg-slate-50/50 border-b border-slate-100/50">
              {" "}
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Tên gói
              </th>{" "}
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Loại
              </th>{" "}
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Giá
              </th>{" "}
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Thời hạn
              </th>{" "}
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Mô tả
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
              <DataRows
                packages={packages}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}{" "}
          </tbody>{" "}
        </table>{" "}
        {!isLoading && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}{" "}
      </div>{" "}
      {/* MOBILE CARDS */}{" "}
      <div className="block md:hidden space-y-4">
        {" "}
        {isLoading ? (
          <LoadingCards />
        ) : packages.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-white rounded-xl ">
            Chưa có gói nào.
          </div>
        ) : (
          packages.map((pkg) => (
            <div
              key={pkg._id}
              className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col gap-3"
            >
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <div className="font-bold text-slate-800">{pkg.name}</div>{" "}
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${TYPE_COLORS[pkg.type]}`}
                >
                  {TYPE_LABELS[pkg.type]}
                </span>{" "}
              </div>{" "}
              <div className="flex items-center gap-4 text-xs">
                {" "}
                <span className="text-slate-600 font-semibold">
                  {formatPrice(pkg.price)}
                </span>{" "}
                <span className="text-slate-400">
                  {formatDuration(pkg.durationDays)}
                </span>{" "}
                <span
                  className={`text-xs font-semibold ${pkg.isActive ? "text-green-600" : "text-slate-400"}`}
                >
                  {" "}
                  {pkg.isActive ? "Hoạt động" : "Tắt"}{" "}
                </span>{" "}
              </div>{" "}
              {pkg.description && (
                <p className="text-xs text-slate-400 line-clamp-2">
                  {pkg.description}
                </p>
              )}{" "}
              <div className="flex items-center justify-end gap-2 border-t border-slate-50 pt-3">
                {" "}
                <button
                  onClick={() => onEdit(pkg)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold"
                >
                  {" "}
                  <span className="material-symbols-outlined text-sm">
                    edit
                  </span>{" "}
                  Sửa{" "}
                </button>{" "}
                <button
                  onClick={() => onDelete(pkg)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold"
                >
                  {" "}
                  <span className="material-symbols-outlined text-sm">
                    delete
                  </span>{" "}
                  Xóa{" "}
                </button>{" "}
              </div>{" "}
            </div>
          ))
        )}{" "}
      </div>{" "}
    </>
  );
}
function LoadingRows() {
  return (
    <>
      {" "}
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-slate-50">
          {" "}
          <td colSpan={7} className="px-6 py-4">
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
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white p-4 rounded-xl border border-slate-100"
        >
          {" "}
          <div className="h-5 bg-slate-100 rounded w-1/3 mb-3" />{" "}
          <div className="h-4 bg-slate-100 rounded w-2/3 mb-3" />{" "}
          <div className="h-8 bg-slate-100 rounded w-full" />{" "}
        </div>
      ))}{" "}
    </>
  );
}
function DataRows({
  packages,
  onEdit,
  onDelete,
}: {
  packages: SubPackageItem[];
  onEdit: (p: SubPackageItem) => void;
  onDelete: (p: SubPackageItem) => void;
}) {
  if (packages.length === 0) {
    return (
      <tr>
        <td colSpan={7} className="text-center py-16 text-slate-400">
          Chưa có gói nào.
        </td>
      </tr>
    );
  }
  return (
    <>
      {" "}
      {packages.map((pkg) => (
        <tr
          key={pkg._id}
          className="hover:bg-slate-50/50 transition-colors border-b border-slate-50"
        >
          {" "}
          <td className="px-6 py-4">
            {" "}
            <div className="font-semibold text-slate-800">{pkg.name}</div>{" "}
          </td>{" "}
          <td className="px-6 py-4">
            {" "}
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${TYPE_COLORS[pkg.type]}`}
            >
              {TYPE_LABELS[pkg.type]}
            </span>{" "}
          </td>{" "}
          <td className="px-6 py-4">
            {" "}
            <span className="font-semibold text-slate-700">
              {formatPrice(pkg.price)}
            </span>{" "}
          </td>{" "}
          <td className="px-6 py-4 text-slate-500 text-xs">
            {formatDuration(pkg.durationDays)}
          </td>{" "}
          <td className="px-6 py-4">
            {" "}
            <p className="text-xs text-slate-400 line-clamp-2 max-w-[200px]">
              {pkg.description || "—"}
            </p>{" "}
          </td>{" "}
          <td className="px-6 py-4">
            {" "}
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${pkg.isActive ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-400"}`}
            >
              {" "}
              {pkg.isActive ? "Hoạt động" : "Tắt"}{" "}
            </span>{" "}
          </td>{" "}
          <td className="px-6 py-4 text-right">
            {" "}
            <div className="flex items-center justify-end gap-2">
              {" "}
              <button
                onClick={() => onEdit(pkg)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold"
              >
                {" "}
                <span className="material-symbols-outlined text-sm">
                  edit
                </span>{" "}
              </button>{" "}
              <button
                onClick={() => onDelete(pkg)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold"
              >
                {" "}
                <span className="material-symbols-outlined text-sm">
                  delete
                </span>{" "}
              </button>{" "}
            </div>{" "}
          </td>{" "}
        </tr>
      ))}{" "}
    </>
  );
}
