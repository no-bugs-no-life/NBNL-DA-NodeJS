"use client";
import AdminLayout from "../../../components/admin/layout/AdminLayout";
import { ReactNode } from "react";

export default function ProtectedAdminLayout({ children }: { children: ReactNode }) {
    return <AdminLayout>{children}</AdminLayout>;
}
