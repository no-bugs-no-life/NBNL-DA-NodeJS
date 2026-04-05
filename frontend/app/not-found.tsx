import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-slate-50">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-xl">
                <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl shadow-indigo-900/5 rounded-[2.5rem] p-10 md:p-14 flex flex-col items-center text-center relative overflow-hidden group">
                    {/* Subtle inner glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10"></div>

                    <div className="relative mb-6">
                        <h1 className="text-[8rem] leading-none md:text-[10rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 drop-shadow-sm select-none">
                            404
                        </h1>
                        <div className="absolute -bottom-2 -right-4 w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-400/30 animate-bounce">
                            <span className="material-symbols-outlined text-white text-2xl">
                                priority_high
                            </span>
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">
                        Ôi không! Lạc đường rồi
                    </h2>

                    <p className="text-slate-500 md:text-lg mb-10 max-w-md mx-auto leading-relaxed">
                        Trang bạn đang cố gắng truy cập có thể đã bị gỡ bỏ, đổi tên hoặc hiện tại không thể phân giải được.
                    </p>

                    <Link
                        href="/"
                        className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all hover:shadow-xl hover:shadow-slate-900/20 active:scale-95 overflow-hidden"
                    >
                        {/* Button shine effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 scale-x-0 group-hover:scale-x-100 origin-left transition-all duration-500 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none"></div>

                        <span className="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-1">
                            home
                        </span>
                        Về lại Trang chủ
                    </Link>
                </div>

                {/* Help links below card */}
                <div className="mt-8 text-center flex items-center justify-center gap-6 text-sm font-medium text-slate-500">
                    <Link href="/contact" className="hover:text-blue-600 transition-colors">
                        Liên hệ hỗ trợ
                    </Link>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <Link href="/help" className="hover:text-blue-600 transition-colors">
                        Trung tâm trợ giúp
                    </Link>
                </div>
            </div>
        </div>
    );
}
