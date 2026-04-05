import { useState } from "react";
import axios from "axios";
import { useAppDetailStore } from "../../store/useAppDetailStore";
import AppStats from "./AppStats";
import { API_URL } from "@/configs/api";

export default function AppDetailHeader() {
  const { appInfo } = useAppDetailStore();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!appInfo) return null;

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      const response = await axios.get(`${API_URL}/api/v1/apps/download/${appInfo._id}`, {
        withCredentials: true
      });
      const data = response.data;
      if (data.fileUrl) {
        // Build the full URL if necessary depending on environment, but typically it returns a relative path from the backend
        // Assume fileUrl can be an absolute path or relative depending on upload handler
        const downloadUrl = data.fileUrl.startsWith("http") ? data.fileUrl : `${API_URL}/${data.fileUrl}`;
        window.open(downloadUrl, '_blank');
      } else {
        alert("Có lỗi xảy ra khi tải xuống.");
      }
    } catch (error) {
      let msg = "Lỗi tải xuống hoặc bạn chưa mua.";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      alert(msg);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <header className="relative py-12 flex flex-col md:flex-row items-start gap-10">
      <div className="w-48 h-48 rounded-[32px] bg-white shadow-xl flex-shrink-0 flex items-center justify-center p-4">
        {appInfo.iconUrl && (
          <img
            alt={appInfo.name}
            className="w-full h-full object-contain"
            src={appInfo.iconUrl}
          />
        )}
      </div>
      <div className="flex-grow space-y-6">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-on-background mb-2">
            {appInfo.name}
          </h1>
          <p className="text-xl text-primary font-medium">{appInfo.developerId?.fullName || "Developer"}</p>
        </div>
        <AppStats />
        <div className="flex gap-4 items-center">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="primary-cta text-on-primary px-10 py-3 rounded-lg font-semibold text-lg shadow-lg hover:brightness-110 transition-all scale-95 duration-150 ease-in-out active:scale-90 disabled:opacity-70 disabled:cursor-not-allowed">
            {isDownloading ? "Đang xử lý..." : (appInfo.price === 0 ? "Tải về ngay" : `Tải hoặc Mua: $${appInfo.price}`)}
          </button>
          <button className="bg-surface-container-high text-on-surface px-6 py-3 rounded-lg font-semibold text-lg hover:bg-surface-dim transition-colors">
            Dùng thử miễn phí
          </button>
        </div>
      </div>
    </header>
  );
}
