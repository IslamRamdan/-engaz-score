import { Head, Link } from "@inertiajs/react";
import ThemeToggle from "@/Components/ThemeToggle";
import {
    LayoutDashboard,
    Users,
    PieChart,
    Receipt,
    ArrowLeft,
    Globe,
} from "lucide-react";

export default function Welcome() {
    return (
        <>
            <Head title="إنجاز سكور — المنصة الأولى لشركات إلحاق العمالة" />

            <div
                dir="rtl"
                className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 font-sans selection:bg-[#006C35] selection:text-white"
                style={{ fontFamily: "'Cairo', sans-serif" }}
            >
                {/* ======================================================
                    الـ Navbar العُلوي
                ====================================================== */}
                <header className="fixed top-0 inset-x-0 z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 transition-all">
                    <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <img
                                src="/logo.png"
                                alt="إنجاز سكور"
                                className="h-9 w-auto dark:invert dark:brightness-200 drop-shadow-sm"
                            />
                            <span className="text-xl font-black bg-gradient-to-l from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent tracking-tight">
                                إنجاز سكور
                            </span>
                        </div>

                        <div className="flex items-center gap-5">
                            <ThemeToggle />
                            <div className="hidden sm:block w-px h-6 bg-zinc-200 dark:bg-zinc-800"></div>
                            <Link
                                href={route("login")}
                                className="hidden sm:block text-sm font-bold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                            >
                                تسجيل الدخول
                            </Link>
                            <Link
                                href={route("register")}
                                className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                ابدأ مجاناً
                                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* ======================================================
                    قسم الـ Hero (بعد التعديل المخصص لإلحاق العمالة)
                ====================================================== */}
                <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
                    <div className="absolute top-20 -right-20 w-96 h-96 bg-[#006C35]/10 dark:bg-[#006C35]/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 -left-20 w-96 h-96 bg-[#eab308]/10 dark:bg-[#eab308]/15 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 shadow-sm">
                            <span className="flex h-2 w-2 rounded-full bg-[#006C35] animate-pulse"></span>
                            المنصة الأولى لشركات إلحاق العمالة المصرية بالخارج
                        </div>

                        <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-[1.1] text-zinc-900 dark:text-white tracking-tight">
                            نظام متكامل صُمم خصيصاً{" "}
                            <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#006C35] to-[#00b056]">
                                لشركات إلحاق العمالة
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl font-medium text-zinc-500 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            نظام مُصمم خصيصاً لشركات إلحاق العمالة المصرية
                            بالخارج. يساعدك على إدارة عملائك ومنشأتك بنظام
                            واحترافية، وتتبع التأشيرات والمندوبين بلمح البصر من
                            لوحة تحكم واحدة.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href={route("register")}
                                className="px-8 py-4 bg-[#006C35] hover:bg-[#005428] text-white rounded-2xl font-black text-lg transition-all shadow-lg shadow-[#006C35]/25 hover:shadow-xl hover:shadow-[#006C35]/30 hover:-translate-y-1"
                            >
                                ابدأ إدارة منشأتك الآن
                            </Link>
                            <Link
                                href={route("login")}
                                className="px-8 py-4 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold text-lg transition-all shadow-sm hover:shadow-md"
                            >
                                تسجيل الدخول
                            </Link>
                        </div>

                        <div className="mt-20 mx-auto max-w-4xl rounded-t-2xl sm:rounded-3xl border border-zinc-200/50 dark:border-zinc-800 p-2 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm shadow-2xl overflow-hidden">
                            <div className="bg-zinc-100 dark:bg-zinc-950 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 aspect-[16/9] w-full flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 opacity-50"></div>
                                <Globe className="w-16 h-16 text-zinc-300 dark:text-zinc-800" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ======================================================
                    قسم المميزات 
                ====================================================== */}
                <section className="py-24 sm:py-32 relative">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white mb-5">
                                إدارة شاملة لملفات العمالة والتأشيرات
                            </h2>
                            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
                                إنجاز سكور يوفر لك كل الأدوات التي تحتاجها
                                لتسهيل دورة العمل وتقليل الأخطاء البشرية.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {[
                                {
                                    title: "إدارة العملاء والعمالة",
                                    desc: "أرشفة كاملة لبيانات العملاء وجوازات السفر بشكل آمن ومنظم.",
                                    icon: Users,
                                    color: "text-blue-500",
                                    bg: "bg-blue-50 dark:bg-blue-500/10",
                                },
                                {
                                    title: "متابعة التأشيرات",
                                    desc: "تتبع دقيق لحالة التأشيرات وإجراءات السفارة لحظة بلحظة.",
                                    icon: LayoutDashboard,
                                    color: "text-[#006C35]",
                                    bg: "bg-emerald-50 dark:bg-[#006C35]/10",
                                },
                                {
                                    title: "متابعة المندوبين",
                                    desc: "إسناد المعاملات للمندوبين ومراقبة إنجازهم اليومي بسهولة.",
                                    icon: Globe,
                                    color: "text-purple-500",
                                    bg: "bg-purple-50 dark:bg-purple-500/10",
                                },
                                {
                                    title: "تقارير وحسابات",
                                    desc: "فواتير ومؤشرات مالية دقيقة لمتابعة أرباح وحسابات الشركة.",
                                    icon: Receipt,
                                    color: "text-[#eab308]",
                                    bg: "bg-yellow-50 dark:bg-[#eab308]/10",
                                },
                            ].map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="group bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-[#006C35]/30 dark:hover:border-[#006C35]/30 transition-colors shadow-sm hover:shadow-xl"
                                >
                                    <div
                                        className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}
                                    >
                                        <feature.icon
                                            className={`w-7 h-7 ${feature.color}`}
                                        />
                                    </div>
                                    <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ======================================================
                    تذييل الصفحة
                ====================================================== */}
                <footer className="bg-white dark:bg-zinc-950 py-12 border-t border-zinc-200 dark:border-zinc-900 text-center">
                    <div className="container mx-auto px-6">
                        <img
                            src="/logo.png"
                            alt="إنجاز سكور للبرمجة"
                            className="h-8 w-auto mx-auto mb-6 dark:invert dark:brightness-100 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                        />
                        <p className="text-sm font-bold text-zinc-400 dark:text-zinc-600">
                            © {new Date().getFullYear()} إنجاز سكور للبرمجة —
                            صُنع بشغف لخدمة شركات إلحاق العمالة
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
