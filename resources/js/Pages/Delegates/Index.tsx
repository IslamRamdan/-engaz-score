import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout"; // التأكد من مسار الـ Layout الخاص بك
import { Head, useForm, router } from "@inertiajs/react";
import DelegateForm from "./Partials/DelegateForm";

interface Delegate {
    id: number;
    name: string;
    phone: string;
}

interface Props {
    delegates: Delegate[];
}

export default function Index({ delegates }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDelegate, setSelectedDelegate] = useState<Delegate | null>(
        null,
    );
    const [searchTerm, setSearchTerm] = useState("");

    // تصفية المندوبين بناءً على البحث
    const filteredDelegates = delegates.filter(
        (d) => d.name.includes(searchTerm) || d.phone.includes(searchTerm),
    );

    const openCreateModal = () => {
        setSelectedDelegate(null);
        setIsModalOpen(true);
    };

    const openEditModal = (delegate: Delegate) => {
        setSelectedDelegate(delegate);
        setIsModalOpen(true);
    };

    const deleteDelegate = (id: number) => {
        if (confirm("هل أنت متأكد من حذف هذا المندوب؟")) {
            router.delete(route("delegates.destroy", id));
        }
    };

    return (
        <AppLayout>
            <Head title="إدارة المندوبين" />

            <div className="max-w-7xl mx-auto py-4 px-2 md:py-8" dir="rtl">
                {/* الرأس والإحصائيات السريعة */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                            إدارة المندوبين
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                            عرض وإدارة كافة المناديب المسجلين في وكالتك
                        </p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-emerald-200"
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
                        إضافة مندوب جديد
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
                            placeholder="بحث باسم المندوب أو رقم الهاتف..."
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
                                    الاسم
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                    رقم الهاتف
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-center">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredDelegates.length > 0 ? (
                                filteredDelegates.map((delegate) => (
                                    <tr
                                        key={delegate.id}
                                        className="hover:bg-zinc-50/30 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                                    {delegate.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">
                                                    {delegate.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300 font-medium tracking-wide">
                                            {delegate.phone}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(delegate)
                                                    }
                                                    className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
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
                                                        deleteDelegate(
                                                            delegate.id,
                                                        )
                                                    }
                                                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
                                        colSpan={3}
                                        className="px-6 py-12 text-center text-zinc-400 text-sm italic"
                                    >
                                        لا يوجد مناديب مسجلين حالياً..
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* نافذة الإضافة والتعديل المنبثقة */}
            <DelegateForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                delegate={selectedDelegate}
            />
        </AppLayout>
    );
}
