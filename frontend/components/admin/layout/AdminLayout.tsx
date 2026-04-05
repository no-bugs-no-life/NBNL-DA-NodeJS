"use client";
import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen bg-slate-50/50 font-sans text-slate-900 overflow-hidden selection:bg-blue-100 selection:text-blue-900">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto w-full">
                    <div className="p-8 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
