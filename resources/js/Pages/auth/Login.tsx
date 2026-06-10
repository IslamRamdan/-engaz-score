import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import ThemeToggle from "@/Components/ThemeToggle";

// =========================================================
// صفحة تسجيل الدخول - Login
// مطابقة لتصميم الكرت الممركز على خلفية خضراء داكنة
// الشركة: إنجاز سكور للبرمجة
// =========================================================

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="إنجاز سكور — تسجيل الدخول" />

            {/* الغلاف الرئيسي بتدرج لوني أخضر داكن يشبه الصورة */}
            <div
                className="min-h-screen flex flex-col items-center justify-center text-zinc-900 relative py-12 dark:bg-zinc-900"
                dir="rtl"
                style={{
                    fontFamily: "'Cairo', sans-serif",
                    // خلفية خضراء داكنة متدرجة
                    background: "linear-gradient(135deg, #1f2923 0%, #111d17 100%)",
                }}
            >
                {/* زر الوضع الليلي في الزاوية العلوية اليسرى */}
                <div className="absolute top-6 left-6 z-50">
                    <ThemeToggle className="bg-white/10 text-white hover:bg-white/20 dark:bg-black/30 dark:hover:bg-black/50 backdrop-blur-md" />
                </div>

                {/* ======================================================
                    شعار واسم الشركة
                ====================================================== */}
                <div className="mb-8 flex items-center justify-center gap-3 animate-fade-in-up">
                    <h1 className="text-white text-3xl font-black tracking-wide">إنجاز سكور</h1>
                    <div className="bg-[#1f2923] p-2 rounded-xl shadow-lg border border-white/10">
                        <Link href="/">
                            <img
                                src="/logo.png"
                                alt="إنجاز سكور للبرمجة"
                                className="h-8 w-auto"
                                style={{ filter: "brightness(0) invert(1)" }}
                            />
                        </Link>
                    </div>
                </div>

                {/* كرت الفورم الأبيض في المنتصف */}
                <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl p-8 sm:p-10 relative z-10 mx-4">
                    
                    {/* ======================================================
                        العنوان
                    ====================================================== */}
                    <div className="text-center mb-10">
                        <h2 className="text-[28px] font-black text-[#111827] dark:text-white mb-2">
                            تسجيل الدخول
                        </h2>
                        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 font-medium">
                            مرحباً بك مجدداً في نظام إدارة وكالتك
                        </p>
                    </div>

                    {status && (
                        <div className="mb-4 font-medium text-sm text-green-600">
                            {status}
                        </div>
                    )}

                    {/* ======================================================
                        نموذج إدخال البيانات
                    ====================================================== */}
                    <form onSubmit={submit} className="space-y-6">
                        {/* حقل البريد الإلكتروني */}
                        <div className="animate-fade-in-up">
                            <label className="block text-[13px] font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                البريد الإلكتروني
                            </label>
                            <input
                                type="email"
                                dir="ltr"
                                placeholder="example@agency.com"
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#2DAA7E] focus:border-[#2DAA7E] dark:focus:ring-[#5CC98B] dark:focus:border-[#5CC98B] transition-all outline-none text-left dark:text-white"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* حقل كلمة المرور */}
                        <div className="animate-fade-in-up animation-delay-100">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-[13px] font-bold text-zinc-700 dark:text-zinc-300">
                                    كلمة المرور
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="text-[12px] font-bold transition-colors"
                                        style={{ color: "#2DAA7E" }}
                                    >
                                        نسيت كلمة المرور؟
                                    </Link>
                                )}
                            </div>
                            <input
                                type="password"
                                dir="ltr"
                                placeholder="••••••••"
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#2DAA7E] focus:border-[#2DAA7E] dark:focus:ring-[#5CC98B] dark:focus:border-[#5CC98B] transition-all outline-none text-left dark:text-white"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                required
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* ======================================================
                            زر الدخول
                        ====================================================== */}
                        <div className="pt-2 animate-fade-in-up animation-delay-200">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 text-[15px] shadow-lg text-white"
                                style={{ background: "linear-gradient(135deg, #2DAA7E 0%, #1D6B55 100%)" }}
                            >
                                {processing ? "جاري الدخول..." : "دخول النظام"}
                            </button>
                        </div>
                    </form>

                    {/* ======================================================
                        رابط حساب جديد
                    ====================================================== */}
                    <div className="mt-8 text-center text-[13px] animate-fade-in-up animation-delay-300">
                        <span className="text-zinc-500 dark:text-zinc-400">ليس لديك حساب بعد؟ </span>
                        <Link
                            href={route("register")}
                            className="font-bold hover:underline"
                            style={{ color: "#2DAA7E" }}
                        >
                            ابدأ تجربتك المجانية
                        </Link>
                    </div>
                </div>
            </div>

            {/* ستايل إضافي للحركات */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.4s ease-out forwards;
                    opacity: 0;
                }
                .animation-delay-100 { animation-delay: 0.1s; }
                .animation-delay-200 { animation-delay: 0.2s; }
                .animation-delay-300 { animation-delay: 0.3s; }
            `}} />
        </>
    );
}
