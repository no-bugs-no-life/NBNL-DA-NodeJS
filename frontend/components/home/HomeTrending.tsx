import Link from "next/link";

export default function HomeTrending() {
  return (
    <section className="px-8 max-w-screen-2xl mx-auto mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Trending Apps</h2>
        <Link
          href="/category"
          className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline"
        >
          See all{" "}
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/apps/photoshop"
          className="md:col-span-2 lg:row-span-2 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between group cursor-pointer hover:bg-surface-bright transition-all duration-500"
        >
          <div>
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-4xl text-primary font-bold">
                edit_square
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Designer Pro 2024</h3>
            <p className="text-on-surface-variant mb-6 max-w-xs">
              The industry standard for vector graphics and digital
              illustration.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center text-amber-500">
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="text-sm font-bold text-on-surface ml-1">
                  4.8
                </span>
              </div>
              <span className="text-sm text-on-surface-variant">$49.99</span>
            </div>
            <button className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
              Install
            </button>
          </div>
        </Link>

        <Link
          href="/apps/streamconnect"
          className="bg-surface-container-lowest rounded-xl p-6 flex items-start gap-4 hover:bg-surface-bright transition-all shadow-[0_32px_64px_-12px_rgba(0,0,0,0.04)] cursor-pointer group"
        >
          <div className="w-14 h-14 bg-secondary-container/20 rounded-xl flex-shrink-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary text-2xl">
              video_call
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">
              StreamConnect
            </h4>
            <p className="text-xs text-on-surface-variant mb-3">Conferencing</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-bold text-tertiary">Free</span>
              <div className="flex items-center text-amber-500 text-[10px]">
                <span
                  className="material-symbols-outlined text-[10px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="ml-0.5">4.5</span>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/apps/taskflow"
          className="bg-surface-container-lowest rounded-xl p-6 flex items-start gap-4 hover:bg-surface-bright transition-all shadow-[0_32px_64px_-12px_rgba(0,0,0,0.04)] cursor-pointer group"
        >
          <div className="w-14 h-14 bg-tertiary-container/10 rounded-xl flex-shrink-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary text-2xl">
              task_alt
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">
              TaskFlow AI
            </h4>
            <p className="text-xs text-on-surface-variant mb-3">Productivity</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-bold text-on-surface">$2.99</span>
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
          href="/apps/echo"
          className="bg-surface-container-lowest rounded-xl p-6 flex items-start gap-4 hover:bg-surface-bright transition-all shadow-[0_32px_64px_-12px_rgba(0,0,0,0.04)] cursor-pointer group"
        >
          <div className="w-14 h-14 bg-error-container/20 rounded-xl flex-shrink-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-error text-2xl">
              music_note
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">
              Echo Studio
            </h4>
            <p className="text-xs text-on-surface-variant mb-3">
              Audio Editing
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-bold text-tertiary">Free</span>
              <div className="flex items-center text-amber-500 text-[10px]">
                <span
                  className="material-symbols-outlined text-[10px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="ml-0.5">4.2</span>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/apps/cloud"
          className="bg-surface-container-lowest rounded-xl p-6 flex items-start gap-4 hover:bg-surface-bright transition-all shadow-[0_32px_64px_-12px_rgba(0,0,0,0.04)] cursor-pointer group"
        >
          <div className="w-14 h-14 bg-primary-fixed/30 rounded-xl flex-shrink-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl">
              cloud
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">
              CloudDrive X
            </h4>
            <p className="text-xs text-on-surface-variant mb-3">Utilities</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-bold text-on-surface">$12.00</span>
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
