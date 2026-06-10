import { useState, useEffect } from "react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const isDark = localStorage.getItem("theme") === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleDarkMode = () => {
        if (darkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setDarkMode(true);
        }
    };

    // تجنب مشاكل الـ Hydration بإخفاء الزر حتى يتم تحميل الـ Client
    if (!mounted) return <div className={`w-[72px] h-9 ${className}`} />;

    return (
        <button
            onClick={toggleDarkMode}
            type="button"
            aria-label="تبديل الوضع الليلي"
            // نستخدم LTR لضمان عمل الحركات من اليسار لليمين بنفس المنطق في جميع اللغات
            style={{ direction: 'ltr' }}
            className={`relative w-[72px] h-9 rounded-full overflow-hidden transition-colors duration-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#eab308] dark:focus:ring-offset-zinc-900 ${
                darkMode ? "bg-[#1f1f1f]" : "bg-[#e5e7eb]"
            } ${className}`}
        >
            {/* أيقونة الشمس (اليسار) - تظهر في الوضع المضيء */}
            <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 transition-opacity duration-500 ${darkMode ? 'opacity-0' : 'opacity-100'}`}>
                <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            </div>

            {/* أيقونة القمر والنجوم (اليمين) - تظهر في الوضع الليلي */}
            <div className={`absolute right-2 top-1/2 -translate-y-1/2 transition-opacity duration-500 ${darkMode ? 'opacity-100' : 'opacity-0'}`}>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    {/* نجمة 1 */}
                    <path d="M16 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
                    {/* نجمة 2 */}
                    <path d="M19 8l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5.5-1z" />
                </svg>
            </div>

            {/* الدائرة المتحركة (المقبض) */}
            <div 
                className={`absolute top-1 w-7 h-7 rounded-full shadow-md transition-all duration-500 flex items-center justify-center ${
                    darkMode 
                        ? "left-1 bg-gradient-to-br from-white to-gray-200" 
                        : "left-[39px] bg-gradient-to-br from-zinc-700 to-zinc-900"
                }`}
            >
                {/* لمعة خفيفة داخل المقبض ليعطي شكل 3D */}
                <div className="w-full h-full rounded-full opacity-30 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]" />
            </div>
        </button>
    );
}
