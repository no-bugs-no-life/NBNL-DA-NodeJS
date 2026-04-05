"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CategoryItem } from "@/store/useHomeStore";
import { API_URL } from "@/configs/api";

export default function HomeCollections() {
  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["categories", "home"],
    queryFn: async () => {

      const response = await axios.get(`${API_URL}/api/v1/categories`);
      const arr = response.data?.docs || response.data || [];
      return arr.filter((c: CategoryItem) => c.parentId == null).slice(0, 2);
    },
  });

  if (isLoading || collections.length === 0) return null;

  return (
    <section className="bg-surface-container-low py-20 mb-20">
      <div className="px-8 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {collections.slice(0, 2).map((col: CategoryItem, idx: number) => (
            <Link
              key={col._id || idx}
              href={`/apps?collection=${col._id || ""}`}
              className="flex-1 bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.04)] group cursor-pointer block"
            >
              <div className="aspect-video relative overflow-hidden">
                {/* Fake images for collections since they only have iconUrl in DB */}
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt={col.name}
                  src={
                    idx === 0
                      ? "https://lh3.googleusercontent.com/aida-public/AB6AXuDn-kgwJpwUToDuGIj9BfACQQ9Axe4DtmiywBpSNSwxZVhgE6wX0oINKJ9KhlYqZGhiFy4QleO8SEfmKNtrRteBtCQNCpr-N8SZ7L8Q-G_K16yy_NbITwBvYkgMHJzYt5fRKx2PZ1JF1Um_9ZQuoZEtDBRWRyxu-_WIPcj2WgQsSR07TdVQG3OijIyhuf3GdqJZzNAfOzu9eA1UHlkd75jlwm-cSqPChOMET_3m2avfRq4a_ZAWuoybClT61lmgUYbrBdd_9wZU1uY"
                      : "https://lh3.googleusercontent.com/aida-public/AB6AXuBBnh_IuaV15FuqeJaYfDUJFXmhykPYxZhvsGXzLpOLbx00zXXfmfJlT8kfu5eswTmyXVTnZswdDy9jmZGLG2nLfVbE0j4Pjlhny4kZ1QJgRb0Ur32jcTLJ8H5Tg5kpoZ3j5fQZaDSU7cGdfSk4il1albHogf26ziSdk87wuGX_nR7VjuqCk3gdsNdCoDIly3RJ15zWHAgzPn0NZqq56vvnTUgFJDlnMZ5hp4WokpgORmMZyIWBA6h-1sdXFLc-mtbmKF9QXFASKlE"
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-white text-2xl font-bold">{col.name}</h3>
                  <p className="text-white/80 text-sm">
                    {idx === 0 ? "Trò chơi mô phỏng và đua xe đỉnh cao" : "Cá nhân hóa màn hình của bạn"}
                  </p>
                </div>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">
                      {col.iconUrl || "category"}
                    </span>
                  </div>
                  <span className="text-xs font-bold truncate">Khám phá</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">
                      api
                    </span>
                  </div>
                  <span className="text-xs font-bold truncate">Tìm hiểu</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
