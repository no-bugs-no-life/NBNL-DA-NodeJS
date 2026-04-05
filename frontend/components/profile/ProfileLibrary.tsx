import Image from "next/image";
import { LibraryItem } from "./data";
import { Play } from "lucide-react";

interface ProfileLibraryProps {
  items: LibraryItem[];
}

export default function ProfileLibrary({ items }: ProfileLibraryProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Thư viện của bạn ({items.length})
        </h2>
        <div className="text-sm font-medium text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-100 cursor-pointer transition-colors">
          Lọc gần đây
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300"
          >
            <div className="aspect-[16/9] md:aspect-[4/3] relative overflow-hidden bg-slate-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="bg-white text-slate-900 rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                  <Play className="w-6 h-6 fill-slate-900" />
                </button>
              </div>
            </div>
            <div className="p-4 bg-white">
              <h3 className="font-bold text-slate-900 mb-1 truncate">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500">
                Đã chơi:{" "}
                <span className="text-slate-700 font-medium">
                  {item.playTime} giờ
                </span>
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Lần cuối:{" "}
                {new Date(item.lastPlayed).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
