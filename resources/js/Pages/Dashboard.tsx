import AppLayout from "@/Layouts/AppLayout";
import {
    Users,
    FileCheck,
    UserCheck,
    TrendingUp,
    Calendar,
    Clock,
    Activity,
    Layers,
    Briefcase, // استيراد أيكون الحقيبة
} from "lucide-react";
import { Link } from "@inertiajs/react";

type Group = {
    id: number;
    name: string;
    customers_count?: number;
};

type Visa = {
    id: number;
    name: string;
    consulate?: string;
    created_at: string;
};

type Bag = {
    id: number;
    name: string;
    customers_count?: number; // عدد العملاء في الحقيبة
};

type Props = {
    groups: Group[];
    visas: Visa[];
    bags: Bag[]; // استقبال الحقائب هنا
};

export default function Dashboard({ groups, visas, bags = [] }: Props) {
    // ===== STATS =====
    const stats = [
        {
            label: "إجمالي التأشيرات",
            value: visas.length.toString(),
            icon: FileCheck,
            color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400",
            desc: "تأشيرة مسجلة بالنظام",
        },
        {
            label: "المجموعات",
            value: groups.length.toString(),
            icon: Layers,
            color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400",
            desc: "مجموعة نشطة حالياً",
        },
        {
            label: "إجمالي الحقائب",
            value: bags.length.toString(),
            icon: Briefcase,
            color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400",
            desc: "حقيبة مضافة بالنظام",
        },
        {
            label: "معدل التشغيل",
            value: "100%",
            icon: Activity,
            color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400",
            desc: "جميع الخدمات مستقرة",
        },
    ];

    // ===== CHART =====
    const chartData = [
        { month: "محرم", value: 45 },
        { month: "صفر", value: 65 },
        { month: "ربيع ١", value: 80 },
        { month: "ربيع ٢", value: 95 },
        { month: "جمادى ١", value: 70 },
        { month: "جمادى ٢", value: 110 },
    ];

    // ===== RECENT =====
    const recentActivities = visas.slice(0, 5).map((v) => ({
        id: v.id,
        name: v.name,
        sponsor: v.consulate ?? "—",
        time: new Date(v.created_at).toLocaleDateString("ar-EG", {
            hour: "2-digit",
            minute: "2-digit",
        }),
    }));

    return (
        <AppLayout>
            <div
                className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto antialiased text-zinc-800 dark:text-zinc-200"
                dir="rtl"
            >
                {/* ===== HEADER ===== */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                            لوحة التحكم
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                            متابعة فورية ونظرة عامة على نظام التأشيرات
                            والمجموعات والحقائب
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-full border border-emerald-100 dark:border-emerald-900/50 shadow-sm animate-pulse">
                        <Calendar className="w-4 h-4" />
                        تحديث مباشر الآن
                    </div>
                </div>

                {/* ===== STATS CARDS ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {stats.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <div
                                key={i}
                                className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                        {s.label}
                                    </span>
                                    <div
                                        className={`p-2.5 rounded-xl ${s.color}`}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                                        {s.value}
                                    </h3>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5 flex items-center gap-1">
                                        <span className="inline-block w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-600 rounded-full"></span>
                                        {s.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ===== CHART + RECENT ACTIVITIES ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* CHART */}
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 lg:col-span-2 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-black text-lg flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                إحصائيات التأشيرات الشهرية
                            </h3>
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                                الشهور الهجرية
                            </span>
                        </div>

                        <div className="h-64 flex items-end gap-3 sm:gap-4 px-2 pt-4">
                            {chartData.map((d, i) => (
                                <div
                                    key={i}
                                    className="flex-1 flex flex-col items-center justify-end h-full group relative"
                                >
                                    <div className="absolute -top-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow font-bold pointer-events-none">
                                        {d.value}
                                    </div>

                                    <div
                                        className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 dark:from-emerald-500 dark:to-emerald-300 rounded-t-xl group-hover:from-emerald-500 group-hover:to-emerald-300 transition-all duration-300 shadow-sm"
                                        style={{
                                            height: `${(d.value / 120) * 100}%`,
                                        }}
                                    />
                                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-3 whitespace-nowrap">
                                        {d.month}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RECENT ACTIVITIES */}
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm flex flex-col">
                        <h3 className="font-black text-lg mb-5 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-500" />
                            آخر التأشيرات المضافة
                        </h3>

                        <div className="space-y-4 flex-1 overflow-y-auto max-h-[260px] pr-1">
                            {recentActivities.length === 0 ? (
                                <p className="text-sm text-zinc-400 text-center py-8">
                                    لا توجد تأشيرات مضافة حديثاً
                                </p>
                            ) : (
                                recentActivities.map((a) => (
                                    <div
                                        key={a.id}
                                        className="flex items-start justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/40 hover:bg-zinc-100/70 dark:hover:bg-zinc-900 transition-colors"
                                    >
                                        <div className="space-y-1 pl-2">
                                            <p className="text-sm font-bold text-zinc-900 dark:text-white truncate max-w-[180px]">
                                                {a.name}
                                            </p>
                                            <p className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                                                <span className="font-medium text-zinc-500 dark:text-zinc-400">
                                                    القنصلية:
                                                </span>{" "}
                                                {a.sponsor}
                                            </p>
                                        </div>
                                        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-800 px-2 py-1 rounded-md border border-zinc-200/60 dark:border-zinc-700/50 whitespace-nowrap shrink-0">
                                            {a.time}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* ===== ALL BAGS (قسم الحقائب المضاف حديثاً) ===== */}
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-black text-lg flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-emerald-500" />
                            نظرة عامة على الحقائب
                        </h3>
                        <span className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-bold">
                            {bags.length} حقيبة
                        </span>
                    </div>

                    {bags.length === 0 ? (
                        <p className="text-sm text-zinc-400 text-center py-6">
                            لا توجد حقائب حالية
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {bags.map((b) => (
                                <Link
                                    key={b.id}
                                    href={route("bags.show", b.id)}
                                    className="block bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 rounded-xl p-4 hover:border-emerald-300 dark:hover:border-emerald-900/80 transition-all duration-200 hover:shadow-md"
                                >
                                    <p className="font-bold text-zinc-900 dark:text-white truncate">
                                        {b.name}
                                    </p>

                                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-200/60 dark:border-zinc-800/60">
                                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                            عدد العملاء:
                                        </span>
                                        <span className="text-xs font-black bg-zinc-200/60 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300">
                                            {b.customers_count ?? 0}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* ===== ALL GROUPS ===== */}
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-black text-lg flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-500" />
                            نظرة عامة على المجموعات
                        </h3>
                        <span className="text-xs bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 px-2.5 py-1 rounded-full font-bold">
                            {groups.length} مجموعة
                        </span>
                    </div>

                    {groups.length === 0 ? (
                        <p className="text-sm text-zinc-400 text-center py-6">
                            لا توجد مجموعات حالية
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {groups.map((g) => (
                                <Link
                                    key={g.id}
                                    href={route("groups.show", g.id)}
                                    className="block bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 rounded-xl p-4 hover:border-purple-300 dark:hover:border-purple-900/80 transition-all duration-200 hover:shadow-md"
                                >
                                    <p className="font-bold text-zinc-900 dark:text-white truncate">
                                        {g.name}
                                    </p>

                                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-200/60 dark:border-zinc-800/60">
                                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                            عدد العملاء:
                                        </span>
                                        <span className="text-xs font-black bg-zinc-200/60 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300">
                                            {g.customers_count ?? 0}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* ===== ALL VISAS ===== */}
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-black text-lg flex items-center gap-2">
                            <FileCheck className="w-5 h-5 text-blue-500" />
                            سجل التأشيرات المتاحة
                        </h3>
                        <span className="text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full font-bold">
                            {visas.length} تأشيرة
                        </span>
                    </div>

                    {visas.length === 0 ? (
                        <p className="text-sm text-zinc-400 text-center py-6">
                            لا توجد تأشيرات مسجلة
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {visas.map((v) => (
                                <div
                                    key={v.id}
                                    className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 rounded-xl p-4 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-900/80 transition-all duration-200"
                                >
                                    <div>
                                        <p className="font-bold text-zinc-900 dark:text-white line-clamp-1">
                                            {v.name}
                                        </p>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 flex items-center justify-between">
                                            <span>القنصلية:</span>
                                            <span className="font-medium text-zinc-700 dark:text-zinc-300 max-w-[120px] truncate">
                                                {v.consulate ?? "—"}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between">
                                        <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                                            {new Date(
                                                v.created_at,
                                            ).toLocaleDateString("ar-EG")}
                                        </span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 rounded">
                                            نشطة
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
