import { Head, useForm, Link } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import ThemeToggle from "@/Components/ThemeToggle";

// =========================================================
// صفحة إنشاء حساب الشركة - Register (متعددة الخطوات)
// مستوحاة من التصميم المرفق (Multi-step form)
// الشركة: إنجاز سكور للبرمجة
// =========================================================

export default function Register() {
    // -------------------------------------------------------
    // إدارة حالة الخطوات (1, 2, 3)
    // -------------------------------------------------------
    const [step, setStep] = useState(1);
    // أقصى خطوة وصل إليها المستخدم (للتحكم بالنقر على الأرقام)
    const [maxReachedStep, setMaxReachedStep] = useState(1);

    // حالة إظهار/إخفاء كلمات المرور
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // -------------------------------------------------------
    // تهيئة نموذج Inertia
    // -------------------------------------------------------
    const { data, setData, post, processing, errors } = useForm({
        company_name: "",
        city: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
    });

    // الانتقال للخطوة التالية
    const nextStep = () => {
        if (step < 3) {
            const next = step + 1;
            setStep(next);
            if (next > maxReachedStep) setMaxReachedStep(next);
        }
    };

    // الانتقال لخطوة محددة — يُسمح فقط للخطوات التي سبق الوصول إليها
    const goToStep = (targetStep: number) => {
        if (targetStep <= maxReachedStep) {
            setStep(targetStep);
        }
    };

    // -------------------------------------------------------
    // دالة الإرسال النهائية
    // -------------------------------------------------------
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // إرسال البيانات فقط إذا كنا في الخطوة الأخيرة
        if (step === 3) {
            post(route("company.register"));
        } else {
            nextStep();
        }
    };

    // أيقونة العين المشتركة (لتجنب تكرار الكود)
    const EyeIcon = ({ show }: { show: boolean }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            {show ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            )}
            {!show && <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />}
        </svg>
    );

    return (
        <>
            <Head title="إنجاز سكور — إنشاء حساب" />

            <div
                className="min-h-screen flex flex-col items-center justify-center text-zinc-900 relative py-12 dark:bg-zinc-900"
                dir="rtl"
                style={{
                    fontFamily: "'Cairo', sans-serif",
                    background: "linear-gradient(135deg, #1f2923 0%, #111d17 100%)",
                }}
            >
                {/* زر الوضع الليلي في الزاوية العلوية اليسرى */}
                <div className="absolute top-6 left-6 z-50">
                    <ThemeToggle className="bg-white/10 text-white hover:bg-white/20 dark:bg-black/30 dark:hover:bg-black/50 backdrop-blur-md" />
                </div>

                <div className="mb-6 text-center animate-fade-in-up flex flex-col items-center">
                    <Link href="/">
                        <img
                            src="/logo.png"
                            alt="إنجاز سكور للبرمجة"
                            className="h-14 w-auto mx-auto mb-3"
                            style={{ filter: "brightness(0) invert(1)" }}
                        />
                    </Link>
                    <h1 className="text-white font-bold text-xl">إنجاز سكور</h1>
                </div>

                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 relative z-10 mx-4 dark:bg-zinc-800 dark:text-white">
                    
                    {/* Step Indicator */}
                    <div className="flex items-center justify-between mb-8 relative">
                        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-zinc-200 dark:bg-zinc-700 -z-10 transform -translate-y-1/2"></div>
                        <div 
                            className="absolute top-1/2 right-0 h-[2px] -z-10 transform -translate-y-1/2 transition-all duration-300"
                            style={{ 
                                width: step === 1 ? "0%" : step === 2 ? "50%" : "100%",
                                backgroundColor: "#2DAA7E"
                            }}
                        ></div>

                        {[1, 2, 3].map((num) => {
                            const isReached = num <= maxReachedStep;
                            const isActive = num <= step;
                            return (
                                <button 
                                    key={num}
                                    type="button"
                                    onClick={() => goToStep(num)}
                                    disabled={!isReached}
                                    title={!isReached ? "أكمل الخطوة السابقة أولاً" : undefined}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                        isActive
                                            ? "text-white"
                                            : isReached
                                                ? "bg-white border-2 border-[#2DAA7E] text-[#2DAA7E] dark:bg-zinc-800 dark:border-[#2DAA7E] cursor-pointer hover:scale-110"
                                                : "bg-white border-2 border-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:border-zinc-700 cursor-not-allowed opacity-50"
                                    }`}
                                    style={isActive ? { background: "linear-gradient(135deg, #2DAA7E 0%, #1D6B55 100%)" } : {}}
                                >
                                    {num}
                                </button>
                            );
                        })}
                    </div>

                    {/* Step Title */}
                    <div className="text-center mb-8">
                        <p className="text-xs text-zinc-400 font-bold mb-2">
                            الخطوة {step} من 3
                        </p>
                        <h2 className="text-2xl font-black text-zinc-800 dark:text-zinc-100 mb-2">
                            {step === 1 && "بيانات المنشأة"}
                            {step === 2 && "بيانات المسؤول"}
                            {step === 3 && "إعداد كلمة المرور"}
                        </h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {step === 1 && "أدخل اسم الشركة والمدينة"}
                            {step === 2 && "من سيدير حساب الوكالة؟"}
                            {step === 3 && "لتأمين حساب الوكالة الخاص بك"}
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        {step === 1 && (
                            <div className="space-y-4 animate-fade-in-up">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                        اسم الشركة / المؤسسة <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="شركة إنجاز سكور"
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#2DAA7E] focus:border-[#2DAA7E] dark:focus:ring-[#5CC98B] dark:focus:border-[#5CC98B] transition-all outline-none"
                                        value={data.company_name}
                                        onChange={(e) => setData("company_name", e.target.value)}
                                        required
                                    />
                                    {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                        المدينة
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="الرياض"
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#2DAA7E] focus:border-[#2DAA7E] dark:focus:ring-[#5CC98B] dark:focus:border-[#5CC98B] transition-all outline-none"
                                        value={data.city}
                                        onChange={(e) => setData("city", e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-fade-in-up">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                        اسم المسؤول <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="عبدالله محمد"
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#2DAA7E] focus:border-[#2DAA7E] dark:focus:ring-[#5CC98B] transition-all outline-none"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                        البريد الإلكتروني <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        dir="ltr"
                                        placeholder="info@company.com"
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#2DAA7E] focus:border-[#2DAA7E] dark:focus:ring-[#5CC98B] transition-all outline-none text-left"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        required
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                        رقم الجوال
                                    </label>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        dir="ltr"
                                        placeholder="05xxxxxxxx"
                                        maxLength={15}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#2DAA7E] focus:border-[#2DAA7E] dark:focus:ring-[#5CC98B] transition-all outline-none text-left"
                                        value={data.phone}
                                        onChange={(e) => setData("phone", e.target.value.replace(/\D/g, ""))}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 animate-fade-in-up">
                                <div className="relative">
                                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 text-right w-full">
                                        كلمة المرور
                                    </label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        dir="ltr"
                                        placeholder="••••••••"
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#2DAA7E] focus:border-[#2DAA7E] dark:focus:ring-[#5CC98B] transition-all outline-none text-left pr-12"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-[34px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                                    >
                                        <EyeIcon show={showPassword} />
                                    </button>
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>
                                <div className="relative">
                                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 text-right w-full">
                                        تأكيد كلمة المرور
                                    </label>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        dir="ltr"
                                        placeholder="••••••••"
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#2DAA7E] focus:border-[#2DAA7E] dark:focus:ring-[#5CC98B] transition-all outline-none text-left pr-12"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData("password_confirmation", e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-[34px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                                    >
                                        <EyeIcon show={showConfirmPassword} />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 text-sm shadow-lg"
                                style={{ background: "linear-gradient(135deg, #2DAA7E 0%, #1D6B55 100%)" }}
                            >
                                {step < 3 ? "التالي" : (processing ? "جاري الإنشاء..." : "إنشاء حساب")}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">لديك حساب بالفعل؟ </span>
                        <Link
                            href={route("login")}
                            className="font-bold hover:underline"
                            style={{ color: "#2DAA7E" }}
                        >
                            تسجيل الدخول
                        </Link>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6 text-xs text-white/70">
                    <div className="flex items-center gap-1.5">
                        <span className="text-green-400">✓</span>
                        14 يوم تجربة مجانية
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-green-400">✓</span>
                        بدون بطاقة ائتمان
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-green-400">✓</span>
                        إلغاء في أي وقت
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.3s ease-out forwards;
                }
            `}} />
        </>
    );
}
