import React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    User,
    Phone,
    Calendar,
    ShieldCheck,
    UserCheck,
    History,
    Clock,
} from "lucide-react";

type HistoryItem = {
    delegate_name: string;
    phone: string;
    changed_by_name: string | null;
    assigned_at: string;
    ended_at: string | null;
};

type Props = {
    customer_id: number | string;
    customer_name: string;
    history: HistoryItem[];
};

export default function DelegateHistory({
    customer_id,
    customer_name,
    history,
}: Props) {
    // حساب المندوب الحالي النشط (إن وجد)
    const activeDelegate = history.find((item) => !item.ended_at);

    return (
        <>
            <Head title={`سجل المناديب - ${customer_name}`} />

            <div className="p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
                {/* الجزء العلوي: العنوان وبطاقات الحالة */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* بطاقة العميل الرئيسية */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center gap-4 md:col-span-1">
                        <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                سجل المندوبين
                            </h1>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                                العميل:{" "}
                                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                    {customer_name}
                                </span>
                                <span className="text-zinc-400 mr-1">
                                    #{customer_id}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* بطاقة المندوب الحالي */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center gap-4">
                        <div
                            className={`p-3 rounded-lg ${activeDelegate ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"}`}
                        >
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 block">
                                المندوب النشط حالياً
                            </span>
                            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                {activeDelegate
                                    ? activeDelegate.delegate_name
                                    : "لا يوجد مندوب نشط"}
                            </span>
                        </div>
                    </div>

                    {/* بطاقة إحصائية */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                            <History className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 block">
                                إجمالي عمليات التغيير
                            </span>
                            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                {history.length}{" "}
                                {history.length > 10 ? "تغيير" : "تغييرات"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* كارد الجدول والبيانات */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right border-collapse">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                                <tr>
                                    <th className="p-4 font-semibold">
                                        المندوب
                                    </th>
                                    <th className="p-4 font-semibold">
                                        الهاتف
                                    </th>
                                    <th className="p-4 font-semibold">
                                        بواسطة
                                    </th>
                                    <th className="p-4 font-semibold">
                                        من تاريخ
                                    </th>
                                    <th className="p-4 font-semibold">
                                        إلى تاريخ
                                    </th>
                                    <th className="p-4 font-semibold text-center">
                                        الحالة
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                                {history.length ? (
                                    history.map((item, i) => (
                                        <tr
                                            key={i}
                                            className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors duration-150"
                                        >
                                            {/* اسم المندوب */}
                                            <td className="p-4 font-medium text-zinc-900 dark:text-zinc-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                                                    {item.delegate_name}
                                                </div>
                                            </td>

                                            {/* رقم الهاتف */}
                                            <td
                                                className="p-4 text-zinc-600 dark:text-zinc-400 font-mono text-left"
                                                dir="ltr"
                                            >
                                                <span className="inline-flex items-center gap-1">
                                                    {item.phone}
                                                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                                                </span>
                                            </td>

                                            {/* تم التغيير بواسطة */}
                                            <td className="p-4">
                                                {item.changed_by_name ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-medium">
                                                        <ShieldCheck className="w-3 h-3 text-zinc-400" />
                                                        {item.changed_by_name}
                                                    </span>
                                                ) : (
                                                    <span className="text-zinc-400 dark:text-zinc-600 italic text-xs">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            {/* تاريخ البدء */}
                                            <td className="p-4 text-zinc-500 dark:text-zinc-400">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                                                    {new Date(
                                                        item.assigned_at,
                                                    ).toLocaleDateString(
                                                        "ar-EG",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        },
                                                    )}
                                                </span>
                                            </td>

                                            {/* تاريخ النهاية */}
                                            <td className="p-4 text-zinc-500 dark:text-zinc-400">
                                                {item.ended_at ? (
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                                                        {new Date(
                                                            item.ended_at,
                                                        ).toLocaleDateString(
                                                            "ar-EG",
                                                            {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            },
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="text-zinc-400 dark:text-zinc-600 font-medium">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            {/* الحالة البصرية */}
                                            <td className="p-4 text-center">
                                                {item.ended_at ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200/40 dark:border-red-900/40">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                        منتهي
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-900/40">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                        نشط حالياً
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="p-12 text-center text-zinc-400 dark:text-zinc-600"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <History className="w-8 h-8 opacity-40 stroke-[1.5]" />
                                                <p className="text-sm font-medium">
                                                    لا يوجد سجل تعيينات للمناديب
                                                    لهذا العميل.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

DelegateHistory.layout = (page: React.ReactNode) => (
    <AppLayout>{page}</AppLayout>
);
