import Link from "next/link";

export default function HomeProductivity() {
  return (
    <section className="px-8 max-w-screen-2xl mx-auto mb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Stay Productive</h2>
          <p className="text-on-surface-variant text-sm mt-1">
            Tools to help you get more done, more easily.
          </p>
        </div>
        <Link
          href="/category"
          className="bg-surface-container-high px-6 py-2 rounded-lg font-bold text-sm hover:bg-surface-dim transition-colors"
        >
          Manage Apps
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link
          href="/apps/writenow"
          className="flex items-center gap-5 p-4 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer group block"
        >
          <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-primary text-3xl font-bold">
              description
            </span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold">WriteNow Editor</h4>
            <p className="text-xs text-on-surface-variant">
              Focus-driven word processor
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-[10px] bg-tertiary-container/10 text-tertiary font-bold px-1.5 py-0.5 rounded">
                Free
              </span>
              <div className="flex items-center text-amber-500 text-[10px]">
                <span
                  className="material-symbols-outlined text-[10px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="ml-0.5">4.8</span>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/apps/datascope"
          className="flex items-center gap-5 p-4 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer group block"
        >
          <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-primary text-3xl font-bold">
              analytics
            </span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold">DataScope Pro</h4>
            <p className="text-xs text-on-surface-variant">
              Advanced visualization &amp; stats
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-[10px] bg-surface-container-highest text-on-surface font-bold px-1.5 py-0.5 rounded">
                $14.99
              </span>
              <div className="flex items-center text-amber-500 text-[10px]">
                <span
                  className="material-symbols-outlined text-[10px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="ml-0.5">4.9</span>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/apps/luminousmail"
          className="flex items-center gap-5 p-4 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer group block"
        >
          <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-primary text-3xl font-bold">
              mail
            </span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold">Luminous Mail</h4>
            <p className="text-xs text-on-surface-variant">
              Intelligent inbox management
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-[10px] bg-tertiary-container/10 text-tertiary font-bold px-1.5 py-0.5 rounded">
                Free
              </span>
              <div className="flex items-center text-amber-500 text-[10px]">
                <span
                  className="material-symbols-outlined text-[10px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="ml-0.5">4.7</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
