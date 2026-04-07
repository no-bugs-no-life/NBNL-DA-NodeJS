"use client";
import { CategoryItem } from "@/hooks/useCategories";
import { Pagination } from "@/components/ui/Pagination";
interface Props {
  categories: CategoryItem[];
  isLoading: boolean;
  onEdit: (cat: CategoryItem) => void;
  onDelete: (cat: CategoryItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}
export function CategoryTable({
  categories,
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
                Tên danh mục
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Icon URL
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
                categories={categories}
                onEdit={onEdit}
                onDelete={onDelete}
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
            categories={categories}
            onEdit={onEdit}
            onDelete={onDelete}
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
          <td colSpan={3} className="px-6 py-4">
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
      {" "}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white p-4 rounded-xl border border-slate-100"
        >
          {" "}
          <div className="flex gap-4 mb-4">
            {" "}
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
  item,
  onEdit,
  onDelete,
  showLabels = false,
}: {
  item: CategoryItem;
  onEdit: (cat: CategoryItem) => void;
  onDelete: (cat: CategoryItem) => void;
  showLabels?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${showLabels ? "justify-start mt-2 border-t border-slate-50 pt-3 flex-wrap" : "justify-end"}`}
    >
      {" "}
      <button
        title="Sửa"
        onClick={() => onEdit(item)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold"
      >
        {" "}
        <span className="material-symbols-outlined text-sm">edit</span>{" "}
        {showLabels && "Sửa"}{" "}
      </button>{" "}
      <button
        title="Xóa"
        onClick={() => onDelete(item)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold"
      >
        {" "}
        <span className="material-symbols-outlined text-sm">delete</span>{" "}
        {showLabels && "Xóa"}{" "}
      </button>{" "}
    </div>
  );
}
function MobileCards({
  categories,
  onEdit,
  onDelete,
}: {
  categories: CategoryItem[];
  onEdit: (cat: CategoryItem) => void;
  onDelete: (cat: CategoryItem) => void;
}) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 bg-white rounded-xl">
        Chưa có danh mục nào.
      </div>
    );
  }
  return (
    <>
      {" "}
      {categories.map((cat) => (
        <div
          key={cat._id}
          className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col gap-3"
        >
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <div className="flex-1 overflow-hidden">
              {" "}
              <h3 className="font-bold text-slate-800 truncate leading-tight flex items-center gap-2">
                {" "}
                <span className="capitalize">{cat.name}</span>{" "}
              </h3>{" "}
              <p className="text-xs text-slate-500 mb-0.5 mt-1 truncate">
                Icon: {cat.iconUrl || "—"}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <ActionButtons
            item={cat}
            onEdit={onEdit}
            onDelete={onDelete}
            showLabels={true}
          />{" "}
        </div>
      ))}{" "}
    </>
  );
}
function DataRows({
  categories,
  onEdit,
  onDelete,
}: {
  categories: CategoryItem[];
  onEdit: (cat: CategoryItem) => void;
  onDelete: (cat: CategoryItem) => void;
}) {
  if (categories.length === 0) {
    return (
      <tr>
        <td colSpan={3} className="text-center py-16 text-slate-400">
          Chưa có danh mục nào.
        </td>
      </tr>
    );
  }
  return (
    <>
      {categories.map((cat) => (
        <tr
          key={cat._id}
          className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50"
        >
          <td className="px-6 py-4 font-semibold text-slate-800 capitalize">
            {cat.name}
          </td>
          <td className="px-6 py-4 text-slate-400 max-w-[200px] truncate text-xs font-mono">
            {cat.iconUrl || "—"}
          </td>
          <td className="px-6 py-4 text-right">
            <ActionButtons
              item={cat}
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
