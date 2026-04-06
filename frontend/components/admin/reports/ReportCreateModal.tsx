"use client";
import { useState, useEffect } from "react";
import { useAdminApps } from "@/hooks/useAdminApps";
import api from "@/lib/axios";
import { ReportTargetType } from "@/app/admin/(protected)/reports/reportsService";
import { API_URL } from "@/configs/api";

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

interface ModalProps {
  onClose: () => void;
  onSubmit: (data: {
    targetType: ReportTargetType;
    targetId: string;
    reason: string;
  }) => void;
  loading?: boolean;
}

export function ReportCreateModal({ onClose, onSubmit, loading }: ModalProps) {
  const [targetType, setTargetType] = useState<ReportTargetType>("app");
  const [targetId, setTargetId] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const { data: apps = [], isLoading: isLoadingApps } = useAdminApps();

  // Search state for reviews
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // Debounced search for reviews
  useEffect(() => {
    if (targetType === "app") return;
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => fetchTargets(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, targetType]);

  const fetchTargets = async (query: string) => {
    setSearching(true);
    try {
      const endpoint =
        targetType === "app"
          ? `/api/v1/apps?page=1&limit=20&search=${encodeURIComponent(query)}`
          : `/api/v1/reviews?page=1&limit=20`;
      const { data } = await api.get(endpoint);
      const items = data.docs || data || [];
      // Filter client-side by name/content
      const filtered = items.filter((item: any) => {
        const name =
          targetType === "app"
            ? (item.name || "").toLowerCase()
            : (item.comment || item.userId?.fullName || "").toLowerCase();
        return name.includes(query.toLowerCase());
      });
      setSearchResults(filtered.slice(0, 10));
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = () => {
    if (!targetId) {
      setError("Vui lòng chọn mục bị báo cáo.");
      return;
    }
    if (!reason.trim() || reason.trim().length < 5) {
      setError("Lý do phải có ít nhất 5 ký tự.");
      return;
    }
    setError("");
    onSubmit({ targetType, targetId, reason: reason.trim() });
  };

  const getItemLabel = (item: any) => {
    if (targetType === "app") return item.name || "Không tên";
    return `${item.userId?.fullName || "Ẩn danh"} — ${(item.comment || "").slice(0, 60)}${(item.comment || "").length > 60 ? "..." : ""}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4 animate-in fade-in slide-in-from-bottom-4 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Tạo Report mới</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>{" "}
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Target type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Loại bị báo cáo
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTargetType("app");
                  setTargetId("");
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${targetType === "app"
                  ? "bg-purple-50 border-purple-300 text-purple-700"
                  : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                  }`}
              >
                <span className="material-symbols-outlined text-sm mr-1">
                  apps
                </span>{" "}
                App
              </button>
              <button
                type="button"
                onClick={() => {
                  setTargetType("review");
                  setTargetId("");
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${targetType === "review"
                  ? "bg-orange-50 border-orange-300 text-orange-700"
                  : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                  }`}
              >
                <span className="material-symbols-outlined text-sm mr-1">
                  star
                </span>{" "}
                Review
              </button>
            </div>
          </div>

          {/* Target search */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Chọn {targetType === "app" ? "App" : "Review"}{" "}
              <span className="text-red-500">*</span>
            </label>
            {targetType === "app" ? (
              isLoadingApps ? (
                <div className="text-sm text-slate-400 py-2">
                  Đang tải danh sách ứng dụng...
                </div>
              ) : apps.length === 0 ? (
                <div className="text-sm text-slate-400 py-2">
                  Không có ứng dụng nào.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {apps.map((app) => {
                    const isSelected = targetId === app._id;
                    return (
                      <button
                        key={app._id}
                        type="button"
                        onClick={() => setTargetId(isSelected ? "" : app._id)}
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
              )
            ) : targetId ? (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                <span className="material-symbols-outlined text-green-600 text-sm">
                  check_circle
                </span>
                <span className="text-sm text-green-700 font-medium flex-1 truncate">
                  {searchResults.find((r) => r._id === targetId)
                    ? getItemLabel(
                      searchResults.find((r) => r._id === targetId),
                    )
                    : targetId}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setTargetId("");
                    setSearchQuery("");
                  }}
                  className="text-green-600 hover:text-green-800"
                >
                  <span className="material-symbols-outlined text-sm">
                    close
                  </span>
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm review..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                    {searchResults.map((item) => (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => {
                          setTargetId(item._id);
                          setSearchQuery(getItemLabel(item));
                          setSearchResults([]);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors"
                      >
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {getItemLabel(item)}
                        </p>
                        {item.rating && (
                          <p className="text-xs text-amber-500">
                            ★ {item.rating}/5
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                {searchQuery && !searchResults.length && !searching && (
                  <p className="text-xs text-slate-400 mt-1">
                    Không tìm thấy kết quả phù hợp.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Lý do báo cáo <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Mô tả chi tiết lý do báo cáo..."
              rows={4}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">
              {reason.length} ký tự
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Đang tạo..." : "Tạo Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
