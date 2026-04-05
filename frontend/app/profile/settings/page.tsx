import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center text-center max-w-sm mx-auto">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
          <Settings className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Cài đặt Tài khoản
        </h2>
        <p className="text-slate-500 text-sm">
          Cập nhật thông tin cá nhân, thay đổi tên hiển thị, ảnh đại diện và
          liên kết mạng xã hội.
        </p>
      </div>
    </div>
  );
}
