import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import BagForm from "./Partials/BagForm";

interface Bag {
    id: number;
    name: string;
    consulate_entry_date: string;
    company_id: number;
    customers_count?: number; // إضافة عداد العملاء هنا كحقل اختياري
}

interface Props {
    bags: Bag[];
}

export default function Index({ bags }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBag, setSelectedBag] = useState<Bag | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // تصفية الحقائب بناءً على اسم الحقيبة أو التاريخ
    const filteredBags = bags.filter(
        (b) =>
            b.name.includes(searchTerm) ||
            b.consulate_entry_date.includes(searchTerm),
    );

    const openCreateModal = () => {
        setSelectedBag(null);
        setIsModalOpen(true);
    };

    const openEditModal = (bag: Bag) => {
        setSelectedBag(bag);
        setIsModalOpen(true);
    };

    const deleteBag = (id: number) => {
        if (confirm("هل أنت متأكد من حذف هذه الحقيبة؟")) {
            router.delete(route("bags.destroy", id));
        }
    };

    return (
        <AppLayout>
            <Head title="إدارة الحقائب" />

            <div className="max-w-7xl mx-auto py-4 px-2 md:py-8" dir="rtl">
                {/* الرأس والإجراءات */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                            إدارة الحقائب
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                            عرض ومتابعة كافة الحقائب وتواريخ دخولها القنصلية
                            والعملاء المسجلين بها
                        </p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        إضافة حقيبة جديدة
                    </button>
                </div>

                {/* شريط البحث */}
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm mb-6">
                    <div className="relative max-w-md">
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-zinc-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="بحث باسم الحقيبة أو التاريخ..."
                            className="w-full pr-10 pl-4 py-2 bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* جدول البيانات */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                    اسم الحقيبة
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-center">
                                    عدد العملاء
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                    تاريخ دخول القنصلية
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-center">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {filteredBags.length > 0 ? (
                                filteredBags.map((bag) => (
                                    <tr
                                        key={bag.id}
                                        className="hover:bg-zinc-50/30 dark:hover:bg-zinc-800/30 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                                                    💼
                                                </div>
                                                <span className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">
                                                    {bag.name}
                                                </span>
                                            </div>
                                        </td>

                                        {/* عمود عدد العملاء الجديد بالشكل النظيف المتناسق */}
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50">
                                                {bag.customers_count ?? 0} عملاء
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300 font-medium tracking-wide">
                                            {new Date(
                                                bag.consulate_entry_date,
                                            ).toLocaleDateString("ar-EG", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(bag)
                                                    }
                                                    className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition-all"
                                                    title="تعديل"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                        />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteBag(bag.id)
                                                    }
                                                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-all"
                                                    title="حذف"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4} // تم تعديلها لتصبح 4 لتناسب العمود الإضافي
                                        className="px-6 py-12 text-center text-zinc-400 text-sm italic"
                                    >
                                        لا يوجد حقائب مسجلة حالياً..
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* الفُورم المنبثق */}
            <BagForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                bag={selectedBag}
            />
        </AppLayout>
    );
}
