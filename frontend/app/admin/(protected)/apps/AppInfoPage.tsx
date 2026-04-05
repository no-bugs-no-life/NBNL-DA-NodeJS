"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppItem, AppInput } from "./appsService";
import { useCategories } from "@/hooks/useCategories";
import { apiClient } from "@/store/useAuthStore";
import useAuthStore from "@/store/useAuthStore";
interface Props {
  app: AppItem;
  onApprove: () => void;
  onReject: () => void;
  onToggleDisable: () => void;
  onEdit: (data: AppInput) => void;
  onBack: () => void;
  loadingAction?: boolean;
}
// ── View mode ──────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { label: string; cls: string }> = {
    published: { label: "Đã phát hành", cls: "text-green-600 bg-green-50" },
    pending: { label: "Chờ duyệt", cls: "text-amber-600 bg-amber-50" },
    rejected: { label: "Từ chối", cls: "text-red-600 bg-red-50" },
  };
  const s = styles[status] ?? {
    label: status,
    cls: "text-slate-500 bg-slate-50",
  };
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-md ${s.cls}`}>
      {s.label}
    </span>
  );
}
function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      {" "}
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
        {" "}
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
          {title}
        </h2>{" "}
      </div>{" "}
      <div className="p-5">{children}</div>{" "}
    </div>
  );
}
function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-3">
      {" "}
      <span className="text-xs font-semibold text-slate-400 w-36 shrink-0 pt-0.5">
        {label}
      </span>{" "}
      <span className="text-sm text-slate-700 font-medium break-all">
        {value || "—"}
      </span>{" "}
    </div>
  );
}
function MetaChip({
  label,
  value,
}: {
  label: string;
  value?: string | null | number;
}) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-xl bg-slate-50 border border-slate-100 min-w-[100px]">
      {" "}
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </span>{" "}
      <span className="text-sm font-bold text-slate-800">
        {value ?? "—"}
      </span>{" "}
    </div>
  );
}
// ── Edit form (inline) ─────────────────────────────────────
interface EditFormProps {
  app: AppItem;
  onSave: (data: AppInput) => void;
  onCancel: () => void;
  loading: boolean;
}
function EditForm({ app, onSave, onCancel, loading }: EditFormProps) {
  const { data: categories = [] } = useCategories();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<AppInput>({
    name: app.name || "",
    slug: app.slug || "",
    description: (app as any).description || "",
    price: app.price || 0,
    categoryId: app.categoryId?._id || "",
    iconUrl: app.iconUrl || "",
  });
  const [uploading, setUploading] = useState(false);
  const uploadIcon = async (file: File) => {
    const formPayload = new FormData();
    formPayload.append("file", file);
    formPayload.append("ownerType", "APP");
    formPayload.append("ownerId", app._id || "ADMIN");
    formPayload.append("fileType", "icon");
    const res = await apiClient.post(
      "/api/v1/files/upload-image",
      formPayload,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data._id;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData });
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      {" "}
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        {" "}
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
          Chỉnh sửa ứng dụng
        </h2>{" "}
        <button
          onClick={onCancel}
          disabled={loading}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-50"
        >
          {" "}
          Huỷ{" "}
        </button>{" "}
      </div>{" "}
      <form
        id="app-edit-form"
        onSubmit={handleSubmit}
        className="p-5 space-y-4"
      >
        {" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {" "}
          <Field label="Tên ứng dụng">
            {" "}
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white"
            />{" "}
          </Field>{" "}
          <Field label="Slug">
            {" "}
            <input
              required
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white"
            />{" "}
          </Field>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {" "}
          <Field label="Giá ($)">
            {" "}
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white"
            />{" "}
          </Field>{" "}
          <Field label="Danh mục">
            {" "}
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white"
            >
              {" "}
              <option value="">-- Chọn danh mục --</option>{" "}
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}{" "}
            </select>{" "}
          </Field>{" "}
        </div>{" "}
        <Field label="Mô tả">
          {" "}
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="form-input resize-none"
          />{" "}
        </Field>{" "}
        <Field label="Icon URL">
          {" "}
          <input
            type="text"
            value={formData.iconUrl}
            onChange={(e) =>
              setFormData({ ...formData, iconUrl: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-white"
            placeholder="https://..."
          />{" "}
        </Field>{" "}
      </form>{" "}
      <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
        {" "}
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition-colors"
        >
          {" "}
          Huỷ bỏ{" "}
        </button>{" "}
        <button
          type="submit"
          form="app-edit-form"
          disabled={loading || uploading}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {" "}
          {loading && (
            <span className="material-symbols-outlined animate-spin text-sm">
              progress_activity
            </span>
          )}{" "}
          Lưu thay đổi{" "}
        </button>{" "}
      </div>{" "}
    </div>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {" "}
      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
        {label}
      </label>{" "}
      {children}{" "}
    </div>
  );
}
// ── Main component ──────────────────────────────────────────
export function AppInfoPage({
  app,
  onApprove,
  onReject,
  onToggleDisable,
  onEdit,
  onBack,
  loadingAction,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const isDisabled = app.isDisabled ?? false;
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {" "}
      {/* Header bar */}{" "}
      <div className="flex items-center gap-4">
        {" "}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />{" "}
          </svg>{" "}
          Quay lại{" "}
        </button>{" "}
        <div className="flex-1" />{" "}
        {isDisabled && (
          <span className="text-xs font-semibold px-3 py-1 rounded-md bg-red-50 text-red-600 border border-red-100">
            {" "}
            Đã vô hiệu hoá{" "}
          </span>
        )}{" "}
        <StatusBadge status={app.status} />{" "}
      </div>{" "}
      {editMode ? (
        <InlineEditSection
          app={app}
          onEdit={(data) => {
            onEdit(data);
            setEditMode(false);
          }}
          onCancel={() => setEditMode(false)}
          loading={loadingAction ?? false}
        />
      ) : (
        <>
          {" "}
          {/* Identity card */}{" "}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-start gap-5">
            {" "}
            {app.iconUrl ? (
              <img
                src={app.iconUrl}
                alt={app.name}
                className="w-20 h-20 rounded-2xl object-cover bg-slate-100 shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                {" "}
                <span className="material-symbols-outlined text-4xl text-slate-300">
                  apps
                </span>{" "}
              </div>
            )}{" "}
            <div className="flex-1 min-w-0">
              {" "}
              <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                {app.name}
              </h1>{" "}
              <p className="text-slate-500 text-sm mt-1">{app.slug}</p>{" "}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                {" "}
                <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                  {" "}
                  {app.price === 0
                    ? "Miễn phí"
                    : `${app.price.toLocaleString("vi-VN")} đ`}{" "}
                </span>{" "}
                {app.categoryId?.name && (
                  <span className="text-sm font-medium text-slate-600 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
                    {" "}
                    {app.categoryId.name}{" "}
                  </span>
                )}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Description */}{" "}
          {(app as any).description && (
            <SectionCard title="Mô tả">
              {" "}
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {(app as any).description}
              </p>{" "}
            </SectionCard>
          )}{" "}
          {/* Meta chips */}{" "}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {" "}
            <MetaChip
              label="Giá"
              value={
                app.price === 0
                  ? "Miễn phí"
                  : `${app.price.toLocaleString("vi-VN")} đ`
              }
            />{" "}
            <MetaChip label="Slug" value={app.slug} />{" "}
            <MetaChip label="Danh mục" value={app.categoryId?.name} />{" "}
            <MetaChip label="Trạng thái" value={app.status} />{" "}
          </div>{" "}
          {/* Developer */}{" "}
          <SectionCard title="Nhà phát triển">
            {" "}
            {app.developerId ? (
              <div className="flex items-center gap-4">
                {" "}
                {app.developerId.avatarUrl ? (
                  <img
                    src={app.developerId.avatarUrl}
                    alt={app.developerId.fullName}
                    className="w-12 h-12 rounded-full object-cover bg-slate-100 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
                    {" "}
                    {(app.developerId.fullName || "?")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}{" "}
                  </div>
                )}{" "}
                <div>
                  {" "}
                  <p className="font-semibold text-slate-800 text-sm">
                    {app.developerId.fullName}
                  </p>{" "}
                  <p className="text-xs text-slate-400">
                    {app.developerId.email}
                  </p>{" "}
                </div>{" "}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Không có thông tin</p>
            )}{" "}
          </SectionCard>{" "}
          {/* System info */}{" "}
          <SectionCard title="Thông tin hệ thống">
            {" "}
            <div className="space-y-2">
              {" "}
              <InfoRow label="ID" value={app._id} />{" "}
              <InfoRow
                label="Ngày tạo"
                value={
                  app.createdAt
                    ? new Date(app.createdAt).toLocaleString("vi-VN")
                    : undefined
                }
              />{" "}
              <InfoRow label="Trạng thái" value={app.status} />{" "}
              <InfoRow
                label="Vô hiệu hoá"
                value={isDisabled ? "Có" : "Không"}
              />{" "}
            </div>{" "}
          </SectionCard>{" "}
          {/* Admin actions */}{" "}
          <SectionCard title="Thao tác Admin">
            {" "}
            <div className="flex flex-wrap gap-3">
              {" "}
              <button
                onClick={() => setEditMode(true)}
                disabled={loadingAction}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 "
              >
                {" "}
                <span className="material-symbols-outlined text-sm">
                  edit
                </span>{" "}
                Sửa ứng dụng{" "}
              </button>{" "}
              {app.status === "pending" && (
                <>
                  {" "}
                  <button
                    onClick={onApprove}
                    disabled={loadingAction}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50 "
                  >
                    {" "}
                    <span className="material-symbols-outlined text-sm">
                      check_circle
                    </span>{" "}
                    Duyệt &amp; phát hành{" "}
                  </button>{" "}
                  <button
                    onClick={onReject}
                    disabled={loadingAction}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors disabled:opacity-50 "
                  >
                    {" "}
                    <span className="material-symbols-outlined text-sm">
                      cancel
                    </span>{" "}
                    Từ chối{" "}
                  </button>{" "}
                </>
              )}{" "}
              <button
                onClick={onToggleDisable}
                disabled={loadingAction}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${isDisabled ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}
              >
                {" "}
                <span className="material-symbols-outlined text-sm">
                  {isDisabled ? "lock_open" : "block"}
                </span>{" "}
                {isDisabled ? "Kích hoạt lại" : "Vô hiệu hoá"}{" "}
              </button>{" "}
            </div>{" "}
          </SectionCard>{" "}
        </>
      )}{" "}
    </div>
  );
}
// ── Inline edit wrapper ────────────────────────────────────
function InlineEditSection({
  app,
  onEdit,
  onCancel,
  loading,
}: {
  app: AppItem;
  onEdit: (data: AppInput) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <EditForm app={app} onSave={onEdit} onCancel={onCancel} loading={loading} />
  );
}
