"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/store/useAuthStore";

type UserRole = "USER" | "DEVELOPER" | "MODERATOR" | "ADMIN";

interface AdminUser {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  role: UserRole;
  coin?: number;
}

function parseUsers(payload: any): { items: AdminUser[]; total: number } {
  const data = payload?.data ?? payload;
  const items = data?.items ?? data?.docs ?? [];
  const total = data?.total ?? data?.totalDocs ?? items.length ?? 0;
  return { items: Array.isArray(items) ? items : [], total };
}

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [amount, setAmount] = useState("10000");
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["admin-users-page", page, search],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/users", {
        params: { page, limit: 20, search: search || undefined },
      });
      return parseUsers(res.data);
    },
  });

  const addBalanceMutation = useMutation({
    mutationFn: async ({ userId, value }: { userId: string; value: number }) =>
      apiClient.patch(`/api/v1/users/${userId}/balance`, { amount: value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users-page"] });
      setSelectedUser(null);
      setAmount("10000");
    },
  });

  const users = usersQuery.data?.items ?? [];
  const total = usersQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 20));
  const canSubmit = useMemo(
    () => Number.isInteger(Number(amount)) && Number(amount) > 0,
    [amount],
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Quản lý Người dùng</h1>
          <p className="text-sm text-slate-500">Tổng cộng {total.toLocaleString("vi-VN")} tài khoản</p>
        </div>
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Tìm theo username/email/tên..."
          className="w-full md:w-80 px-4 py-2.5 rounded-xl border border-slate-200"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-3 text-xs font-semibold text-slate-500 bg-slate-50">
          <span className="col-span-3">Người dùng</span>
          <span className="col-span-3">Email</span>
          <span className="col-span-2">Vai trò</span>
          <span className="col-span-2">Balance</span>
          <span className="col-span-2 text-right">Thao tác</span>
        </div>
        {usersQuery.isLoading ? (
          <p className="px-4 py-5 text-sm text-slate-500">Đang tải...</p>
        ) : users.length === 0 ? (
          <p className="px-4 py-5 text-sm text-slate-500">Không có dữ liệu người dùng.</p>
        ) : (
          users.map((u) => (
            <div
              key={u._id}
              className="grid grid-cols-12 px-4 py-3 text-sm border-t border-slate-100 items-center"
            >
              <div className="col-span-3 min-w-0">
                <p className="font-semibold truncate">{u.fullName || u.username}</p>
                <p className="text-xs text-slate-500 truncate">@{u.username}</p>
              </div>
              <span className="col-span-3 truncate">{u.email}</span>
              <span className="col-span-2">{u.role}</span>
              <span className="col-span-2 font-semibold">
                {(u.coin || 0).toLocaleString("vi-VN")}
              </span>
              <div className="col-span-2 text-right">
                <button
                  onClick={() => setSelectedUser(u)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 font-semibold text-xs hover:bg-emerald-200"
                >
                  Add balance
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-50"
        >
          Trước
        </button>
        <span className="text-sm text-slate-600">
          Trang {page}/{totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-50"
        >
          Sau
        </button>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h2 className="text-lg font-bold">Add balance cho người dùng</h2>
            <p className="text-sm text-slate-600">
              {selectedUser.fullName || selectedUser.username} ({selectedUser.email})
            </p>
            <input
              type="number"
              min={1}
              step={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
              placeholder="Nhập số coin cần nạp"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-lg border border-slate-200"
              >
                Huỷ
              </button>
              <button
                disabled={!canSubmit || addBalanceMutation.isPending}
                onClick={() =>
                  addBalanceMutation.mutate({
                    userId: selectedUser._id,
                    value: Number(amount),
                  })
                }
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-50"
              >
                {addBalanceMutation.isPending ? "Đang xử lý..." : "Xác nhận nạp"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
