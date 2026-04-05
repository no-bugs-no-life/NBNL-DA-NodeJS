export default function FeaturedApp() {
  return (
    <div className="md:col-span-2 relative h-80 rounded-xl overflow-hidden group">
      <img
        alt="Featured App"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzs1axLENQQnJtNlDT10FdxcL-UU3Ca7btzzL5ESQM3hr7hlCFAjSlVZ7u0ZeOIckpaFY22SApKwNJNPjEBSrFo6z1pfTBJSyR9hxVZRyOAH5THh26WPjXPzCHZqnJ7AtjAf0yuS4N8yxpZcvl0jk-FjoSPrxbbLo6NJoEDIqcKCD3C98acfdSlHQVb4ifAJpCmBDrDibsLCOhr2FFFHd1sRv0kM5_x4i4j370SF1qo5Ypnr_btY5tEOoizBHn1ex5H_HfRTeco9c"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
        <span className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">
          Đề xuất hàng đầu
        </span>
        <h2 className="text-3xl font-bold text-white mb-2">APKBugs Docs Pro</h2>
        <p className="text-white/70 max-w-md mb-6 leading-relaxed">
          Công cụ soạn thảo văn bản thế hệ mới với tích hợp AI thông minh nhất
          hiện nay.
        </p>
        <button className="w-fit px-8 py-3 bg-white text-slate-900 rounded-lg font-bold text-sm hover:bg-slate-100 transition-colors">
          Tải xuống ngay
        </button>
      </div>
    </div>
  );
}
