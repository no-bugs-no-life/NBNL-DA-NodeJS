"use client";
import { useState, useEffect } from "react";
import {
  SubPackageItem,
  CreateSubPackageInput,
  UpdateSubPackageInput,
} from "@/app/admin/(protected)/sub-packages/subPackagesService";
import { useAdminApps } from "@/hooks/useAdminApps";
import { API_URL } from "@/configs/api";
interface Props {
  initialData?: SubPackageItem | null;
  onClose: () => void;
  onSubmit: (data: CreateSubPackageInput | UpdateSubPackageInput) => void;
  loading?: boolean;
}
const TYPE_OPTIONS = [
  { value: "monthly", label: "Hàng tháng", duration: 30 },
  { value: "yearly", label: "Hàng năm", duration: 365 },
  { value: "lifetime", label: "Vĩnh viễn", duration: 0 },
];

function AppIcon({ iconUrl, name }: { iconUrl?: string; name: string }) {
  const getImageUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith("http")) return url;
    return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  if (iconUrl)
    return (
      <img
        src={getImageUrl(iconUrl)}
        alt={name}
        className="w-8 h-8 rounded-xl object-cover shrink-0"
      />
    );
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
  return (
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
      {initials}
    </div>
  );
}

export function SubPackageModal({
  initialData,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const isEdit = !!initialData;
  const [name, setName] = useState("");
  const [type, setType] = useState("monthly");
  const [price, setPrice] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [appId, setAppId] = useState("");

  const { data: appsData, isLoading: isLoadingApps } = useAdminApps();
  const apps = appsData || [];

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setType(initialData.type);
      setPrice(String(initialData.price));
      setDurationDays(String(initialData.durationDays));
      setDescription(initialData.description || "");
      setIsActive(initialData.isActive);
      setAppId(typeof initialData.appId === "object" ? initialData.appId?._id || "" : initialData.appId || "");
    }
  }, [initialData]);
  const isValid = name.trim() && price !== "" && Number(price) >= 0 && appId !== "";
  const handleTypeChange = (newType: string) => {
    setType(newType);
    const opt = TYPE_OPTIONS.find((t) => t.value === newType);
    if (opt) setDurationDays(String(opt.duration));
  };
  const handleSubmit = () => {
    if (!isValid) return;
    const data = {
      name: name.trim(),
      appId,
      type,
      price: Number(price),
      durationDays: type === "lifetime" ? 0 : Number(durationDays) || 30,
      description: description.trim(),
      ...(isEdit ? { isActive } : {}),
    };
    onSubmit(data);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      {" "}
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {" "}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          {" "}
          <h2 className="text-xl font-bold text-slate-800">
            {isEdit ? "Sửa gói" : "Tạo gói Subscription"}
          </h2>{" "}
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            {" "}
            <span className="material-symbols-outlined text-xl">
              close
            </span>{" "}
          </button>{" "}
        </div>{" "}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* App selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Ứng dụng <span className="text-red-500">*</span>
            </label>
            {isLoadingApps ? (
              <div className="text-sm text-slate-400 py-2">
                Đang tải danh sách ứng dụng...
              </div>
            ) : apps.length === 0 ? (
              <div className="text-sm text-slate-400 py-2">
                Không có ứng dụng nào.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {apps.map((app) => {
                  const isSelected = appId === app._id;
                  return (
                    <button
                      key={app._id}
                      type="button"
                      onClick={() => setAppId(app._id)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all text-sm ${isSelected
                        ? "border-blue-400 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                    >
                      <AppIcon iconUrl={app.iconUrl} name={app.name} />
                      <span className="font-medium text-slate-700 truncate flex-1">
                        {app.name}
                      </span>
                      {isSelected && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-blue-600 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            {" "}
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Tên gói <span className="text-red-500">*</span>
            </label>{" "}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Premium Monthly"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
            />{" "}
          </div>{" "}
          {/* Type */}{" "}
          <div>
            {" "}
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Loại gói <span className="text-red-500">*</span>
            </label>{" "}
            <div className="flex gap-3">
              {" "}
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleTypeChange(opt.value)}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${type === opt.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"}`}
                >
                  {" "}
                  {opt.label}{" "}
                </button>
              ))}{" "}
            </div>{" "}
          </div>{" "}
          {/* Price */}{" "}
          <div>
            {" "}
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Giá (VND) <span className="text-red-500">*</span>
            </label>{" "}
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="VD: 99000"
              min="0"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
            />{" "}
          </div>{" "}
          {/* Duration */}{" "}
          {type !== "lifetime" && (
            <div>
              {" "}
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Số ngày
              </label>{" "}
              <input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                min="1"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
              />{" "}
            </div>
          )}{" "}
          {/* Description */}{" "}
          <div>
            {" "}
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Mô tả
            </label>{" "}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả chi tiết về gói..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm resize-none"
            />{" "}
          </div>{" "}
          {/* Active toggle (edit only) */}{" "}
          {isEdit && (
            <div className="flex items-center gap-3">
              {" "}
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? "bg-green-500" : "bg-slate-300"}`}
              >
                {" "}
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? "translate-x-6" : "translate-x-1"}`}
                />{" "}
              </button>{" "}
              <span className="text-sm font-medium text-slate-600">
                {isActive ? "Đang hoạt động" : "Tắt"}
              </span>{" "}
            </div>
          )}{" "}
        </div>{" "}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          {" "}
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Hủy
          </button>{" "}
          <button
            disabled={!isValid || loading}
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {" "}
            {loading && (
              <span className="material-symbols-outlined text-sm animate-spin">
                progress_activity
              </span>
            )}{" "}
            {loading
              ? "Đang xử lý..."
              : isEdit
                ? "Lưu thay đổi"
                : "Tạo gói"}{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
