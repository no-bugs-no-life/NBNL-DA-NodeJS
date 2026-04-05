"use client";
import { useState, useEffect } from "react";
import {
  CouponItem,
  CreateCouponInput,
} from "@/app/admin/(protected)/coupons/couponsService";
interface ModalProps {
  title: string;
  onClose: () => void;
  onSubmit: (data: CreateCouponInput) => void;
  initialData?: Partial<CouponItem>;
  loading?: boolean;
}
function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 16);
}
function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(23, 59, 0, 0);
  return d.toISOString().slice(0, 16);
}
export function CouponModal({
  title,
  onClose,
  onSubmit,
  initialData,
  loading,
}: ModalProps) {
  const [code, setCode] = useState(initialData?.code || "");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    initialData?.discountType || "percentage",
  );
  const [discountValue, setDiscountValue] = useState(
    String(initialData?.discountValue || ""),
  );
  const [startDate, setStartDate] = useState(
    initialData?.startDate?.slice(0, 16) || today(),
  );
  const [endDate, setEndDate] = useState(
    initialData?.endDate?.slice(0, 16) || addDays(30),
  );
  const [usageLimit, setUsageLimit] = useState(
    String(initialData?.usageLimit || "0"),
  );
  const [error, setError] = useState("");
  const isEdit = !!initialData?._id;
  const handleSubmit = () => {
    const val = parseFloat(discountValue);
    const limit = parseInt(usageLimit);
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!code.trim()) {
      setError("Mã coupon không được để trống.");
      return;
    }
    if (!discountValue || isNaN(val) || val <= 0) {
      setError("Giá trị giảm giá phải > 0.");
      return;
    }
    if (discountType === "percentage" && (val < 0 || val > 100)) {
      setError("Phần trăm giảm giá phải từ 0 – 100.");
      return;
    }
    if (isNaN(limit) || limit < 0) {
      setError("Số lượt dùng phải >= 0.");
      return;
    }
    if (start >= end) {
      setError("Ngày bắt đầu phải trước ngày kết thúc.");
      return;
    }
    setError("");
    onSubmit({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: val,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      usageLimit: limit,
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {" "}
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg mx-4 animate-in fade-in slide-in-from-bottom-4 duration-200 max-h-[90vh] overflow-y-auto">
        {" "}
        <div className="flex items-center justify-between mb-6">
          {" "}
          <h2 className="text-xl font-bold text-slate-800">
            {title} Coupon
          </h2>{" "}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          >
            {" "}
            <span className="material-symbols-outlined text-xl">
              close
            </span>{" "}
          </button>{" "}
        </div>{" "}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
            {" "}
            <span className="material-symbols-outlined text-sm">
              error
            </span>{" "}
            {error}{" "}
          </div>
        )}{" "}
        <div className="space-y-4">
          {" "}
          {/* Code */}{" "}
          <div>
            {" "}
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {" "}
              Mã coupon <span className="text-red-500">*</span>{" "}
            </label>{" "}
            <input
              type="text"
              value={code}
              onChange={(e) =>
                setCode(
                  e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""),
                )
              }
              placeholder="VD: SUMMER2026"
              disabled={isEdit}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${isEdit ? "bg-slate-50 text-slate-400 cursor-not-allowed" : "border-slate-200"}`}
            />{" "}
          </div>{" "}
          {/* Discount type + value */}{" "}
          <div className="grid grid-cols-2 gap-4">
            {" "}
            <div>
              {" "}
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Loại giảm giá
              </label>{" "}
              <select
                value={discountType}
                onChange={(e) =>
                  setDiscountType(e.target.value as "percentage" | "fixed")
                }
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {" "}
                <option value="percentage">Phần trăm (%)</option>{" "}
                <option value="fixed">Cố định (VNĐ)</option>{" "}
              </select>{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Giá trị {discountType === "percentage" ? "(%)" : "(VNĐ)"}
              </label>{" "}
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === "percentage" ? "10" : "10000"}
                min="0"
                max={discountType === "percentage" ? "100" : undefined}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />{" "}
            </div>{" "}
          </div>{" "}
          {/* Date range */}{" "}
          <div className="grid grid-cols-2 gap-4">
            {" "}
            <div>
              {" "}
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Ngày bắt đầu
              </label>{" "}
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Ngày kết thúc
              </label>{" "}
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />{" "}
            </div>{" "}
          </div>{" "}
          {/* Usage limit */}{" "}
          <div>
            {" "}
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {" "}
              Số lượt sử dụng{" "}
              <span className="text-slate-400 font-normal">
                (0 = không giới hạn)
              </span>{" "}
            </label>{" "}
            <input
              type="number"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />{" "}
          </div>{" "}
        </div>{" "}
        <div className="flex gap-3 mt-6">
          {" "}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
          >
            {" "}
            Huỷ{" "}
          </button>{" "}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {" "}
            {loading ? "Đang lưu..." : "Lưu"}{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
