"use client";
import { useState } from "react";
import { User } from "@/store/useAuthStore";

export function BasicInfoForm({
  user,
  onSave,
  loading,
}: {
  user: User;
  onSave: (data: { fullName: string; bio: string }) => void;
  loading: boolean;
}) {
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [bio, setBio] = useState(user?.bio || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ fullName, bio });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-2xl"
    >
      <h3 className="text-lg font-bold text-slate-800 mb-2">
        Thông tin cơ bản
      </h3>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Tên hiển thị
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tên của bạn..."
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Tiểu sử (Bio)
        </label>
        <textarea
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Giới thiệu kết về bạn..."
        />
      </div>
      <button
        disabled={loading}
        type="submit"
        className="px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-50 text-sm"
      >
        Lưu thông tin
      </button>
    </form>
  );
}
