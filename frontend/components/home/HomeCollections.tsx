import Link from "next/link";

export default function HomeCollections() {
  return (
    <section className="bg-surface-container-low py-20 mb-20">
      <div className="px-8 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <Link
            href="/category"
            className="flex-1 bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.04)] group cursor-pointer block"
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="racing collection"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDn-kgwJpwUToDuGIj9BfACQQ9Axe4DtmiywBpSNSwxZVhgE6wX0oINKJ9KhlYqZGhiFy4QleO8SEfmKNtrRteBtCQNCpr-N8SZ7L8Q-G_K16yy_NbITwBvYkgMHJzYt5fRKx2PZ1JF1Um_9ZQuoZEtDBRWRyxu-_WIPcj2WgQsSR07TdVQG3OijIyhuf3GdqJZzNAfOzu9eA1UHlkd75jlwm-cSqPChOMET_3m2avfRq4a_ZAWuoybClT61lmgUYbrBdd_9wZU1uY"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-white text-2xl font-bold">
                  Racing Essentials
                </h3>
                <p className="text-white/80 text-sm">
                  Top-rated simulation and arcade racing
                </p>
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">
                    speed
                  </span>
                </div>
                <span className="text-xs font-bold truncate">Forza Drift</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">
                    settings
                  </span>
                </div>
                <span className="text-xs font-bold truncate">TuneMaster</span>
              </div>
            </div>
          </Link>

          <Link
            href="/category"
            className="flex-1 bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.04)] group cursor-pointer block"
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="windows themes collection"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBnh_IuaV15FuqeJaYfDUJFXmhykPYxZhvsGXzLpOLbx00zXXfmfJlT8kfu5eswTmyXVTnZswdDy9jmZGLG2nLfVbE0j4Pjlhny4kZ1QJgRb0Ur32jcTLJ8H5Tg5kpoZ3j5fQZaDSU7cGdfSk4il1albHogf26ziSdk87wuGX_nR7VjuqCk3gdsNdCoDIly3RJ15zWHAgzPn0NZqq56vvnTUgFJDlnMZ5hp4WokpgORmMZyIWBA6h-1sdXFLc-mtbmKF9QXFASKlE"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-white text-2xl font-bold">
                  Windows Themes
                </h3>
                <p className="text-white/80 text-sm">
                  Personalize your desktop experience
                </p>
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">
                    palette
                  </span>
                </div>
                <span className="text-xs font-bold truncate">Neon Night</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">
                    filter_vintage
                  </span>
                </div>
                <span className="text-xs font-bold truncate">Nordic Sky</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
