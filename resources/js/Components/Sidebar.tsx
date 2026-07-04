import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";

interface SidebarProps {
    isCollapsed?: boolean;
}

export default function Sidebar({
    isCollapsed: initialCollapsed = false,
}: SidebarProps) {
    const { url, props } = usePage();

    // 💾 جلب الحالة المخزنة مسبقاً من الـ LocalStorage أو اعتماد القيمة الافتراضية
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window !== "undefined") {
            const savedState = localStorage.getItem("sidebar_collapsed");
            return savedState ? JSON.parse(savedState) : initialCollapsed;
        }
        return initialCollapsed;
    });

    // 🔄 حفظ التغييرات في الـ LocalStorage فور تغير الـ State
    useEffect(() => {
        localStorage.setItem("sidebar_collapsed", JSON.stringify(collapsed));
    }, [collapsed]);

    const user = props.auth?.user || {
        name: "مستخدم",
        email: "user@example.com",
    };
    const company = (props.auth?.user as any).company || {
        name: "منصة واثق",
        email: "erfa20045@gmail.com",
    };

    const isActive = (href: string) => {
        return url.startsWith(href);
    };

    const menuItems = [
        { href: "/dashboard", label: "لوحة التحكم", icon: "🏠", hasDot: false }, // أيقونة رئيسية أو لوحة تحكم
        { href: "/delegates", label: "المناديب", icon: "💼", hasDot: true }, // حقيبة عمل تمثل المندوب أو الوكيل
        { href: "/sponsors", label: "الكفلاء", icon: "🏢", hasDot: false }, // مبنى أو شركة تمثل جهة الكفالة
        { href: "/visas", label: "التأشيرات", icon: "📄", hasDot: true }, // مستند يمثل الفيزا/التأشيرة
        { href: "/customers", label: "العملاء", icon: "👤", hasDot: true }, // مستخدم مفرد يمثل العميل
        { href: "/groups", label: "المجموعات", icon: "👥", hasDot: true }, // مستخدمين متعددين يمثلون المجموعة
        { href: "/bags", label: "الحقائب", icon: "🧳", hasDot: true }, // حقيبة سفر تمثل الحقائب أو الأمتعة
        { href: "/employees", label: "الموظفين", icon: "👨‍💼", hasDot: true }, // موظف يمثل الموظف
    ];

    return (
        <aside
            className={`min-h-screen bg-white dark:bg-zinc-900 border-l border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between p-sticky top-0 transition-all duration-300 relative group/sidebar ${
                collapsed ? "w-[80px]" : "w-[280px]"
            }`}
            dir="rtl"
        >
            {/* 🔘 زر التبديل العائم المستقر */}
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    setCollapsed(!collapsed);
                }}
                className={`absolute top-6 -left-3.5 z-50 w-7 h-7 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-xs cursor-pointer transition-transform duration-300 ${
                    collapsed ? "rotate-180" : ""
                }`}
                title={collapsed ? "توسيع القائمة" : "طوي القائمة"}
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>

            {/* القسم العلوي */}
            <div>
                {/* لوجو المنصة */}
                <div className="p-4 flex justify-center border-b border-zinc-50 dark:border-zinc-800 h-[85px] items-center">
                    {collapsed ? (
                        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-wider animate-fade-in">
                            W
                        </span>
                    ) : (
                        <img
                            src="/logo.png"
                            alt="Wathiq"
                            className="h-14 w-auto object-contain animate-fade-in"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    )}
                </div>

                {/* معلومات الوكالة والتنبيهات */}
                <div
                    className={`px-4 py-4 flex items-center justify-between ${collapsed ? "flex-col gap-4" : ""}`}
                >
                    {/* زر التنبيهات (تم تحويل النقطة للأخضر) */}
                    <button className="relative p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all cursor-pointer">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.02 6.02 0 00-4.902-5.903m0 0V4a1 1 0 10-2 0v1.097A6.02 6.02 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v1m6 0H9"
                            />
                        </svg>
                        <span className="absolute top-1.5 left-1.5 w-2 h-2 bg-emerald-600 rounded-full" />
                    </button>

                    {!collapsed && (
                        <div className="text-left animate-fade-in">
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold tracking-wide">
                                الشركة
                            </p>
                            <p className="text-sm font-black text-zinc-800 dark:text-zinc-100 truncate max-w-[150px]">
                                {company.name}
                            </p>
                        </div>
                    )}
                </div>

                {/* قائمة روابط التنقل الأنيقة باللون الأخضر الخفيف */}
                <div className="px-3 overflow-y-auto max-h-[calc(100vh-270px)] custom-scrollbar">
                    <ul className="space-y-1">
                        {menuItems.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        preserveState // يضمن الحفاظ على حالة المكون الـ State الداخلي أثناء التنقل
                                        className={`group flex items-center rounded-xl font-bold text-sm transition-all duration-200 relative ${
                                            collapsed
                                                ? "justify-center p-3"
                                                : "justify-between px-4 py-3"
                                        } ${
                                            active
                                                ? "bg-emerald-50 border border-emerald-200 shadow-sm shadow-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:border-transparent dark:shadow-none dark:text-emerald-400"
                                                : "border border-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50/80 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                                        }`}
                                        title={collapsed ? item.label : ""}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="text-lg filter drop-shadow-xs group-hover:scale-105 transition-transform shrink-0">
                                                {item.icon}
                                            </span>

                                            {!collapsed && (
                                                <span className="font-bold text-[13.5px] tracking-wide truncate animate-fade-in">
                                                    {item.label}
                                                </span>
                                            )}
                                        </div>

                                        {/* نقطة الإشعار النشطة (أخضر زمردي مائل للنبض) */}
                                        {item.hasDot && active && (
                                            <span
                                                className={`rounded-full bg-emerald-600 animate-pulse shrink-0 ${
                                                    collapsed
                                                        ? "absolute top-2 right-2 w-1.5 h-1.5"
                                                        : "w-1.5 h-1.5"
                                                }`}
                                            />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            {/* القسم السفلي */}
            <div
                className={`p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/60 space-y-3 ${collapsed ? "items-center" : ""}`}
            >
                {/* الحساب المصغر */}
                <div
                    className={`flex items-center justify-between ${collapsed ? "justify-center px-0" : "px-2"}`}
                >
                    {!collapsed && (
                        <div className="flex flex-col text-right min-w-0 overflow-hidden animate-fade-in mr-1">
                            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate">
                                {user.name}
                            </span>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                                {user.email}
                            </span>
                        </div>
                    )}

                    <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-black text-sm uppercase shadow-xs shrink-0">
                        {user.email.charAt(0)}
                    </div>
                </div>

                {/* زر تسجيل الخروج */}
                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className={`w-full flex items-center justify-center bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50/40 dark:hover:bg-red-950/30 text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 rounded-xl font-bold shadow-xs transition-all cursor-pointer ${
                        collapsed ? "p-2.5" : "gap-2 px-4 py-2.5 text-xs"
                    }`}
                    title={collapsed ? "تسجيل الخروج" : ""}
                >
                    <svg
                        className="w-4 h-4 transform rotate-180 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                    {!collapsed && (
                        <span className="animate-fade-in">تسجيل الخروج</span>
                    )}
                </Link>
            </div>
        </aside>
    );
}
