import React from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

interface Due {
    id: number;
    name: string;
    amount: number;
}

interface Props {
    dues: Due[];
    [key: string]: any;
}

const card =
    "rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900";

export default function Index({ dues }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        amount: "",
    });

    const { flash } = usePage<any>().props;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/dues", {
            preserveScroll: true,
            onSuccess: () => reset("name", "amount"),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm("هل أنت متأكد من حذف هذا الاستحقاق؟")) {
            router.delete(`/dues/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout title="إدارة الاستحقاقات">
            <div className="py-6 px-4" dir="rtl">
                <div className="mx-auto max-w-3xl space-y-6">
                    {/* الهيدر */}
                    <div className={`${card} flex items-center gap-4 p-5`}>
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.8}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                جدول الاستحقاقات
                            </h1>
                            <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                                تعريف وإدارة بنود الاستحقاقات ومبالغها (موجب أو
                                سالب)
                            </p>
                        </div>
                    </div>

                    {/* كارد الإضافة */}
                    <div className={`${card} p-6`}>
                        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
                            إضافة استحقاق جديد
                        </h2>

                        {flash?.success && (
                            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-300">
                                <svg
                                    className="h-4 w-4 shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.5 12.75l6 6 9-13.5"
                                    />
                                </svg>
                                {flash.success}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4 sm:flex-row"
                        >
                            <div className="flex-1">
                                <label className="block mb-1.5 text-xs font-medium text-gray-700 dark:text-neutral-300">
                                    اسم الاستحقاق
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="مثال: حجز النت، اشتراك شهري..."
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-400"
                                />
                                {errors.name && (
                                    <span className="mt-1.5 block text-xs text-red-500">
                                        {errors.name}
                                    </span>
                                )}
                            </div>

                            <div className="w-full sm:w-48">
                                <label className="block mb-1.5 text-xs font-medium text-gray-700 dark:text-neutral-300">
                                    المبلغ (موجب أو سالب)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={(e) =>
                                        setData("amount", e.target.value)
                                    }
                                    placeholder="مثال: 4500 أو -200"
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-400"
                                />
                                {errors.amount && (
                                    <span className="mt-1.5 block text-xs text-red-500">
                                        {errors.amount}
                                    </span>
                                )}
                            </div>

                            <div className="self-end sm:mt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing
                                        ? "جاري الحفظ..."
                                        : "حفظ الاستحقاق"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* جدول العرض */}
                    <div className={`${card} p-6 overflow-x-auto`}>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                قائمة الاستحقاقات المسجلة
                            </h3>
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                {dues.length} استحقاق
                            </span>
                        </div>

                        {dues.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-neutral-500">
                                <p className="text-sm">
                                    لا توجد استحقاقات مسجلة حتى الآن.
                                </p>
                            </div>
                        ) : (
                            <table className="w-full text-right text-sm">
                                <thead className="border-b border-gray-200 text-xs text-gray-500 dark:border-neutral-800 dark:text-neutral-400">
                                    <tr>
                                        <th className="py-3 px-3">
                                            اسم الاستحقاق
                                        </th>
                                        <th className="py-3 px-3">المبلغ</th>
                                        <th className="py-3 px-3 text-center">
                                            إجراءات
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                                    {dues.map((due) => (
                                        <tr
                                            key={due.id}
                                            className="hover:bg-gray-50 dark:hover:bg-neutral-800/40 transition"
                                        >
                                            <td className="py-3 px-3 font-medium text-gray-900 dark:text-gray-100">
                                                {due.name}
                                            </td>
                                            <td
                                                className={`py-3 px-3 font-semibold ${Number(due.amount) < 0 ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`}
                                            >
                                                {due.amount}
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(due.id)
                                                    }
                                                    className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                                >
                                                    حذف
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
