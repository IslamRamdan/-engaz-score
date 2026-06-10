import { Head, Link } from "@inertiajs/react";
import ThemeToggle from "@/Components/ThemeToggle";

export default function Welcome() {
    return (
        <>
            <Head title="إنجاز سكور — المنصة المتكاملة لإدارة الشركات" />

            {/* الحاوية الرئيسية مع دعم الوضع الليلي */}
            <div dir="rtl" className="min-h-screen bg-white dark:bg-zinc-900 transition-colors duration-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
                
                {/* ======================================================
                    الـ Navbar العُلوي
                ====================================================== */}
                <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm border-b border-zinc-100 dark:border-zinc-800">
                    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                        {/* الشعار واسم الشركة */}
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="إنجاز سكور للبرمجة" className="h-10 w-auto dark:invert dark:brightness-0" />
                            <span className="text-xl font-black text-zinc-900 dark:text-white">إنجاز سكور</span>
                        </div>

                        {/* الروابط وأزرار التحكم */}
                        <div className="flex items-center gap-4">
                            {/* زر تبديل الوضع الليلي */}
                            <ThemeToggle />

                            <Link
                                href={route("login")}
                                className="text-sm font-bold text-zinc-700 hover:text-[#006C35] dark:text-zinc-300 dark:hover:text-[#eab308] transition-colors"
                            >
                                تسجيل الدخول
                            </Link>
                            <Link
                                href={route("register")}
                                className="text-sm font-bold px-5 py-2.5 rounded-xl bg-[#006C35] hover:bg-[#005428] text-white dark:bg-[#eab308] dark:hover:bg-[#ca8a04] dark:text-zinc-900 transition-colors shadow-lg"
                            >
                                ابدأ مجاناً
                            </Link>
                        </div>
                    </div>
                </header>

                {/* ======================================================
                    قسم الـ Hero المُرَحِّب (مستوحى من تصميم المرجع)
                ====================================================== */}
                <section className="relative overflow-hidden bg-[#06423a] dark:bg-[#042a25] text-white py-24 sm:py-32">
                    {/* خلفية بنقاط هندسية */}
                    <div
                        className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                        }}
                    />
                    
                    <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8 bg-white/10 border border-white/20 backdrop-blur-md text-[#eab308]">
                            ✨ الحل الأمثل لإدارة الشركات والوكالات
                        </div>
                        <h1 className="text-5xl sm:text-6xl font-black mb-8 leading-tight drop-shadow-md">
                            نظام متكامل صُمم ليرتقي<br className="hidden sm:block" /> بإدارة منشأتك
                        </h1>
                        <p className="text-lg sm:text-xl font-light text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                            لم نبنِ إنجاز سكور لنضيف أداة جديدة إلى قائمتك. بل بنيناه ليكون مركز التحكم الشامل لشركتك. راقب التأشيرات، المندوبين، والمؤشرات بلمح البصر.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href={route("register")}
                                className="px-8 py-4 bg-[#eab308] hover:bg-[#ca8a04] text-zinc-900 rounded-xl font-black text-lg transition-transform hover:scale-105 shadow-xl"
                            >
                                ابدأ تجربتك الآن
                            </Link>
                            <Link
                                href={route("login")}
                                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-lg backdrop-blur-md transition-colors"
                            >
                                تعرف على المزيد
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ======================================================
                    قسم المميزات - Features
                ====================================================== */}
                <section className="py-24 bg-zinc-50 dark:bg-zinc-800/50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4">
                                كل ما تحتاجه لإدارة شركتك بنجاح
                            </h2>
                            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
                                منصة إنجاز سكور تقدم لك الأدوات الاحترافية لتقليل الجهد وزيادة الإنتاجية في مختلف أقسام منشأتك.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: "إدارة التأشيرات", desc: "تتبع حالة التأشيرات من لحظة الإصدار وحتى الانتهاء، مع تنبيهات ذكية.", icon: "🛂" },
                                { title: "متابعة المندوبين", desc: "وزع المهام على مندوبيك وراقب إنجازهم بشكل فوري من لوحة واحدة.", icon: "🤝" },
                                { title: "مؤشرات وتقارير", desc: "تقارير مالية وإدارية دقيقة لتبقى مطلعاً على أداء وكالتك باستمرار.", icon: "📊" },
                                { title: "محاسبة وفواتير", desc: "أنظمة محاسبية مبسطة تناسب الشركات وتسهل تتبع التدفقات المالية.", icon: "💰" }
                            ].map((feature, idx) => (
                                <div key={idx} className="bg-white dark:bg-zinc-800 p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-700 hover:shadow-xl transition-shadow">
                                    <div className="text-4xl mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3">{feature.title}</h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ======================================================
                    تذييل الصفحة - Footer
                ====================================================== */}
                <footer className="bg-white dark:bg-zinc-900 py-12 border-t border-zinc-100 dark:border-zinc-800 text-center">
                    <div className="container mx-auto px-6">
                        <img
                            src="/logo.png"
                            alt="إنجاز سكور للبرمجة"
                            className="h-10 w-auto mx-auto mb-6 dark:invert dark:brightness-0 opacity-80"
                        />
                        <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500">
                            © {new Date().getFullYear()} إنجاز سكور للبرمجة — جميع الحقوق محفوظة
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
