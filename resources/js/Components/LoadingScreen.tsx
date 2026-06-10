import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

// =========================================================
// مكوّن شاشة التحميل - Loading Screen
// يستخدم شعار الموقع مع حركة نبض وحلقة دوارة
// يظهر تلقائياً عند الانتقال بين الصفحات عبر Inertia
// يدعم الوضع الفاتح والداكن بشكل تلقائي
// =========================================================

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // ─── اكتشاف الوضع الحالي (فاتح / داكن) ───────────────────────
        const checkDark = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };

        // اقرأ الوضع فور تحميل المكوّن
        checkDark();

        // راقب التغييرات الحية على الـ class لعنصر <html>
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        // ─── أحداث Inertia للانتقال بين الصفحات ───────────────────────
        const startHandler = () => {
            checkDark(); // حدّث الوضع عند كل انتقال
            setIsLoading(true);
        };
        const finishHandler = () => setIsLoading(false);

        const removeStart = router.on("start", startHandler);
        const removeFinish = router.on("finish", finishHandler);

        return () => {
            observer.disconnect();
            removeStart();
            removeFinish();
        };
    }, []);

    if (!isLoading) return null;

    // ألوان الخلفية والنصوص والحلقة حسب الوضع
    const bgColor = isDark
        ? "linear-gradient(135deg, #0d1117 0%, #111827 100%)"
        : "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)";

    const spinnerColor = isDark ? "#10b981" : "#059669";       // emerald-500 / emerald-600
    const spinnerDimColor = isDark
        ? "rgba(16,185,129,0.25)"
        : "rgba(5,150,105,0.2)";
    const innerColor = isDark
        ? "rgba(255,255,255,0.15)"
        : "rgba(0,0,0,0.08)";
    const textColor = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.45)";

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ background: bgColor, transition: "background 0.3s" }}
        >
            {/* الحاوية المركزية */}
            <div className="flex flex-col items-center gap-6">
                {/* الحلقة الدوارة بداخلها الشعار */}
                <div className="relative flex items-center justify-center">
                    {/* الحلقة الخارجية الدوارة - تم التكبير لـ w-44 h-44 */}
                    <div
                        className="w-44 h-44 rounded-full border-[5px] border-transparent"
                        style={{
                            borderTopColor: spinnerColor,
                            borderRightColor: spinnerDimColor,
                            borderBottomColor: "transparent",
                            borderLeftColor: spinnerDimColor,
                            animation: "ls-spin 1s linear infinite",
                        }}
                    />

                    {/* الحلقة الداخلية تدور عكسياً - تم التكبير لـ w-36 h-36 */}
                    <div
                        className="absolute w-36 h-36 rounded-full border-[5px] border-transparent"
                        style={{
                            borderTopColor: innerColor,
                            borderBottomColor: innerColor,
                            borderRightColor: "transparent",
                            borderLeftColor: "transparent",
                            animation: "ls-spin 1.5s linear infinite reverse",
                        }}
                    />

                    {/* شعار الشركة في المنتصف ينبض - تم التكبير لـ w-28 h-28 */}
                    <div
                        className="absolute w-28 h-28 flex items-center justify-center"
                        style={{ animation: "ls-pulse 1.8s ease-in-out infinite" }}
                    >
                        <img
                            src="/logo.png"
                            alt="واثق"
                            className="w-full h-full object-contain"
                            style={{
                                filter: isDark
                                    ? "brightness(0) invert(1)"
                                    : "none",
                            }}
                        />
                    </div>
                </div>

                {/* نص "جاري التحميل..." */}
                <p
                    className="text-sm font-bold tracking-widest"
                    style={{
                        color: textColor,
                        fontFamily: "'Cairo', sans-serif",
                        animation: "ls-fade 1.8s ease-in-out infinite",
                    }}
                >
                    جاري التحميل...
                </p>
            </div>

            {/* أنيميشن CSS مضمّنة */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes ls-spin {
                    0%   { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes ls-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: 0.6; transform: scale(0.88); }
                }
                @keyframes ls-fade {
                    0%, 100% { opacity: 0.5; }
                    50%       { opacity: 1; }
                }
            `}} />
        </div>
    );
}