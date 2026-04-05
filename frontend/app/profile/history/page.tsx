import { History } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center text-center max-w-sm mx-auto">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
          <History className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Lịch sử Mua hàng
        </h2>
        <p className="text-slate-500 text-sm">
          Ghi nhận các giao dịch và hoá đơn đã thanh toán trên APKBugs của bạn.
        </p>
      </div>
    </div>
  );
}
