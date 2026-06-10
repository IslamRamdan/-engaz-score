import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import SponsorForm from "./Partials/SponsorForm";
interface Sponsor {
    id: number;
    name: string;
    id_number: string;
    country: string;
    address: string;
}

interface Props {
    sponsors: Sponsor[];
}

export default function Index({ sponsors = [] }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(
        null,
    );
    const [searchTerm, setSearchTerm] = useState("");

    // تصفية الكفلاء بناءً على حقل البحث (الاسم أو رقم الهوية)
    const filteredSponsors = sponsors.filter(
        (sponsor) =>
            sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sponsor.id_number.includes(searchTerm),
    );

    const openCreateModal = () => {
        setSelectedSponsor(null);
        setIsModalOpen(true);
    };

    const openEditModal = (sponsor: Sponsor) => {
        setSelectedSponsor(sponsor);
        setIsModalOpen(true);
    };

    const deleteSponsor = (id: number) => {
        if (confirm("هل أنت متأكد من حذف هذا الكفيل نهائياً؟")) {
            router.delete(route("sponsors.destroy", id));
        }
    };

    return (
        <AppLayout>
            <Head title="إدارة الكفلاء" />

            <div className="max-w-7xl mx-auto py-4 px-2 md:py-8" dir="rtl">
                {/* الهيدر العلوي */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                            إدارة الكفلاء
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                            إضافة، تعديل، ومتابعة سجلات الكفلاء والجهات الداعمة
                            للتأشيرات
                        </p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-xs hover:shadow-md shadow-emerald-100/50 dark:shadow-none cursor-pointer"
                    >
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
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        إضافة كفيل جديد
                    </button>
                </div>

                {/* شريط البحث وتصفية البيانات */}
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-xs mb-6">
                    <div className="relative max-w-md">
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-400">
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
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="بحث باسم الكفيل أو رقم الهوية/السجل..."
                            className="w-full pr-10 pl-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950/50 focus:border-emerald-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* جدول البيانات */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="bg-zinc-50/70 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                        اسم الكفيل
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                        رقم الهوية / السجل
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                        الدولة
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                        العنوان
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-center">
                                        الإجراءات
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {filteredSponsors.length > 0 ? (
                                    filteredSponsors.map((sponsor) => (
                                        <tr
                                            key={sponsor.id}
                                            className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/40 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {/* أفاتار الحرف الأول - تم تعديله للأخضر الزمردي */}
                                                    <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                                                        {sponsor.name.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">
                                                        {sponsor.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300 font-medium tracking-wide">
                                                {sponsor.id_number}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300 font-medium">
                                                {/* بادج الدولة - تم تعديله للأخضر الزمردي */}
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300">
                                                    {sponsor.country}
                                                </span>
                                            </td>
                                            <td
                                                className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs truncate"
                                                title={sponsor.address}
                                            >
                                                {sponsor.address}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {/* زر التعديل - تم تعديل الـ Hover للأخضر الزمردي */}
                                                    <button
                                                        onClick={() =>
                                                            openEditModal(
                                                                sponsor,
                                                            )
                                                        }
                                                        className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 rounded-xl transition-all cursor-pointer"
                                                        title="تعديل"
                                                    >
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
                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            deleteSponsor(
                                                                sponsor.id,
                                                            )
                                                        }
                                                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all cursor-pointer"
                                                        title="حذف"
                                                    >
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
                                            colSpan={5}
                                            className="px-6 py-12 text-center text-zinc-400 text-sm"
                                        >
                                            لا يوجد كفلاء مسجلين يطابقون بحثك
                                            حالياً..
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* المكون المنبثق للإضافة والتعديل */}
            <SponsorForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                sponsor={selectedSponsor}
            />
        </AppLayout>
    );
}
