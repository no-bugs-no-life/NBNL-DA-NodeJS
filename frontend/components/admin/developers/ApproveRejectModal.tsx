"use client";
import React, { useState } from "react";
import { DeveloperItem } from "@/hooks/useDevelopers";
interface Props {
  dev: DeveloperItem;
  action: "approve" | "reject";
  onClose: () => void;
  onApprove: (permissions?: any) => void;
  onReject: (reason: string) => void;
  loading: boolean;
}
export function ApproveRejectModal({
  dev,
  action,
  onClose,
  onApprove,
  onReject,
  loading,
}: Props) {
  const [reason, setReason] = useState("");
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    canPublishApp: true,
    canEditOwnApps: true,
    canDeleteOwnApps: false,
    canViewAnalytics: false,
    canManagePricing: true,
    canRespondReviews: true,
  });
  const handleSubmit = () => {
    if (action === "approve") {
      onApprove(permissions);
    } else {
      onReject(reason);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <ModalHeader
          action={action}
          devName={dev.name}
          onClose={onClose}
        />
        <div className="p-6 space-y-5">
          <DevSummary dev={dev} />
          {action === "approve" ? (
            <PermissionsForm
              permissions={permissions}
              onChange={setPermissions}
            />
          ) : (
            <RejectForm reason={reason} onChange={setReason} />
          )}
        </div>
        <ModalFooter
          action={action}
          loading={loading}
          reason={reason}
          onClose={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
function ModalHeader({
  action,
  devName,
  onClose,
}: {
  action: string;
  devName: string;
  onClose: () => void;
}) {
  return (
    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          {action === "approve"
            ? "Phê duyệt Developer"
            : "Từ chối Developer"}
        </h2>
        <p className="text-xs text-slate-500 mt-1">{devName}</p>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>
    </div>
  );
}
function DevSummary({ dev }: { dev: DeveloperItem }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0">
        <img
          src={dev.avatarUrl || "https://i.sstatic.net/l60Hf.png"}
          alt={dev.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <p className="font-bold text-slate-800">{dev.name}</p>
        <p className="text-xs text-slate-500">{dev.userId?.email}</p>
        {dev.website && (
          <p className="text-xs text-blue-500 truncate max-w-[200px]">
            {dev.website}
          </p>
        )}
      </div>
    </div>
  );
}
function PermissionsForm({
  permissions,
  onChange,
}: {
  permissions: Record<string, boolean>;
  onChange: (p: Record<string, boolean>) => void;
}) {
  const perms = [
    {
      key: "canPublishApp",
      label: "Xuất bản app",
      desc: "Cho phép đăng app mới",
    },
    {
      key: "canEditOwnApps",
      label: "Sửa app của mình",
      desc: "Chỉnh sửa thông tin app",
    },
    {
      key: "canDeleteOwnApps",
      label: "Xoá app của mình",
      desc: "Xoá app đã đăng",
    },
    {
      key: "canViewAnalytics",
      label: "Xem thống kê",
      desc: "Truy cập báo cáo phân tích",
    },
    { key: "canManagePricing", label: "Quản lý giá", desc: "Thay đổi giá app" },
    {
      key: "canRespondReviews",
      label: "Phản hồi đánh giá",
      desc: "Trả lời review của user",
    },
  ];
  const toggle = (key: string) => {
    onChange({ ...permissions, [key]: !permissions[key] });
  };
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-3">
        Cấp quyền cho Developer
      </label>
      <div className="space-y-2">
        {perms.map((p) => (
          <label
            key={p.key}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={permissions[p.key]}
              onChange={() => toggle(p.key)}
              className="w-4 h-4 accent-blue-600 rounded"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-700">
                {p.label}
              </p>
              <p className="text-xs text-slate-400">{p.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
function RejectForm({
  reason,
  onChange,
}: {
  reason: string;
  onChange: (r: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Lý do từ chối <span className="text-red-500">*</span>
      </label>
      <textarea
        rows={4}
        value={reason}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ví dụ: Thông tin hồ sơ không hợp lệ, nội dung vi phạm..."
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20 text-sm resize-none"
      />
    </div>
  );
}
function ModalFooter({
  action,
  loading,
  reason,
  onClose,
  onSubmit,
}: {
  action: string;
  loading: boolean;
  reason?: string;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const isApprove = action === "approve";
  return (
    <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
      <button
        onClick={onClose}
        disabled={loading}
        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
      >
        Huỷ
      </button>
      <button
        onClick={onSubmit}
        disabled={loading || (!isApprove && !reason)}
        className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${isApprove ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}
      >
        {loading && (
          <span className="material-symbols-outlined text-sm animate-spin">
            progress_activity
          </span>
        )}
        {isApprove ? "Phê duyệt" : "Từ chối"}
      </button>
    </div>
  );
}
