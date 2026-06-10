import { useState, useEffect } from "react";
import Sidebar from "@/Components/Sidebar";
import ThemeToggle from "@/Components/ThemeToggle";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    // إدارة حالة الانكماش من الكومبوننت الأب لتحديث مساحة الشاشة بالكامل
    const [isCollapsed, setIsCollapsed] = useState(false);

    // تطبيق كلاس الدارك مود بناء على localStorage للوحة التحكم أيضاً
    useEffect(() => {
        const isDark =
            localStorage.getItem("theme") === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches);
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    return (
        <div
            className="flex bg-zinc-50 dark:bg-zinc-900 min-h-screen text-zinc-900 dark:text-zinc-100 overflow-x-hidden transition-colors duration-300"
            dir="rtl"
        >
            {/* زر الوضع الليلي عائم أعلى اليسار لجميع صفحات لوحة التحكم */}
            <div className="absolute top-4 left-6 z-50">
                <ThemeToggle className="bg-white shadow-sm dark:bg-zinc-800" />
            </div>

            {/* تمرير الحالات للسايد بار */}
            {/* الـ Sidebar يستقبل isCollapsed فقط - setIsCollapsed تُدار داخلياً */}
            <Sidebar isCollapsed={isCollapsed} />

            {/* المحتوى الرئيسي يتمدد وينكمش بسلاسة بفضل الترانزيشن */}
            <main className="flex-1 py-6 transition-all duration-350 ease-in-out overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
