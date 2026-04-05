"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/useAuthStore";
import { fetchApps, approveApp, rejectApp, deleteApp, createApp, updateApp, AppItem, AppInput } from "./appsService";

export function useAdminApps() {
    const { token, isAdmin, isLoading: isAuthLoading } = useAuthStore();
    const queryClient = useQueryClient();

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [isPendingFilter, setIsPendingFilter] = useState(false);

    const [actionTarget, setActionTarget] = useState<{ app: AppItem, action: "approve" | "reject" | "delete" } | null>(null);
    const [formTarget, setFormTarget] = useState<{ app?: AppItem, action: "create" | "edit" } | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const notify = (msg: string, type: "success" | "error") => {
        setToast({ message: msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const { data: appsData, isLoading } = useQuery({
        queryKey: ["apps", page, limit, isPendingFilter],
        queryFn: () => fetchApps(page, limit, isPendingFilter, token),
    });

    const apps = appsData?.docs || [];
    const totalPages = appsData?.totalPages || 1;
    const totalDocs = appsData?.totalDocs || 0;

    const mApprove = useMutation({
        mutationFn: (id: string) => approveApp(id, token),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["apps"] }); setActionTarget(null); notify("Duyệt App thành công!", "success"); },
        onError: () => notify("Lỗi khi duyệt App!", "error"),
    });

    const mReject = useMutation({
        mutationFn: (id: string) => rejectApp(id, token),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["apps"] }); setActionTarget(null); notify("Từ chối App thành công!", "success"); },
        onError: () => notify("Lỗi khi từ chối App!", "error"),
    });

    const mDelete = useMutation({
        mutationFn: (id: string) => deleteApp(id, token),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["apps"] }); setActionTarget(null); notify("Xoá App thành công!", "success"); },
        onError: () => notify("Lỗi khi xoá App!", "error"),
    });

    const mCreate = useMutation({
        mutationFn: (data: AppInput) => createApp(data, token),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["apps"] }); setFormTarget(null); notify("Thêm ứng dụng thành công!", "success"); },
        onError: () => notify("Lỗi khi thêm ứng dụng!", "error"),
    });

    const mUpdate = useMutation({
        mutationFn: ({ id, data }: { id: string, data: AppInput }) => updateApp(id, data, token),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["apps"] }); setFormTarget(null); notify("Cập nhật ứng dụng thành công!", "success"); },
        onError: () => notify("Lỗi khi cập nhật ứng dụng!", "error"),
    });

    return {
        isAdmin, isAuthLoading, apps, isLoading,
        actionTarget, setActionTarget,
        formTarget, setFormTarget,
        toast, mApprove, mReject, mDelete, mCreate, mUpdate,
        page, setPage, totalPages, totalDocs,
        isPendingFilter, setIsPendingFilter
    };
}
