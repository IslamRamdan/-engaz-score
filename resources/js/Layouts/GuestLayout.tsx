import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
    return (
        // تفعيل اتجاه اليمين لليسار، مع خلفية رمادية ناعمة وتأثير إضاءة علوي خفيف
        <div
            className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 pt-6 sm:pt-0 relative overflow-hidden"
            dir="rtl"
        >
            {/* لمسة جمالية خلفية: تدرج ضوئي خافت بالأخضر السعودي ليعطي طابع المنصات الرسمية الفخمة */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[350px] bg-gradient-to-b from-[#006C35]/5 to-transparent blur-3xl pointer-events-none z-0" />

            {/* صندوق المحتوى والشعار مرتفعان فوق الخلفية التجميلية */}
            <div className="relative z-10 w-full px-4 sm:max-w-md flex flex-col items-center">
                {/* منطقة الشعار */}
                <div className="mb-8 transition-transform duration-300 hover:scale-105">
                    <Link href="/">
                        {/* شعار التطبيق ملون بالأخضر الملكي المعتمد */}
                        <ApplicationLogo className="h-24 w-auto fill-current text-[#006C35]" />
                    </Link>
                </div>

                {/* كرت النماذج (تسجيل الدخول / إنشاء الحساب / استعادة كلمة المرور) */}
                <div className="w-full overflow-hidden bg-white px-8 py-8 border border-zinc-200/60 shadow-xl shadow-zinc-200/30 rounded-2xl relative">
                    {/* خط تجميلي علوي ناعم يحمل هوية المنشأة */}
                    <div className="absolute top-0 right-0 left-0 h-1 bg-[#006C35]" />

                    {/* المحتوى الداخلي للـ Forms */}
                    <div className="text-zinc-800">{children}</div>
                </div>

                {/* تذييل بسيط اختياري يعكس الطابع الرسمي للمملكة */}
                <p className="mt-6 text-center text-xs text-zinc-400 font-medium tracking-wide">
                    جميع الحقوق محفوظة للمنصة الرقمية 🇸🇦 ٢٠٢٦م
                </p>
            </div>
        </div>
    );
}
