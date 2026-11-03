import React from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

interface Treasury {
    id: number;
    name: string;
}

interface Props {
    treasuries: Treasury[];
    [key: string]: any;
}

const card =
    "rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900";

export default function Index({ treasuries }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
    });

    const { flash } = usePage<any>().props;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/treasuries", {
            preserveScroll: true,
            onSuccess: () => reset("name"),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm("هل أنت متأكد من حذف هذه الخزنة؟")) {
            router.delete(`/treasuries/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout title="إدارة الخزائن">
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
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                إدارة الخزائن
                            </h1>
                            <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                                إضافة وإدارة الخزائن المالية المتاحة في النظام
                            </p>
                        </div>
                    </div>

                    {/* كارد الإضافة */}
                    <div className={`${card} p-6`}>
                        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
                            إضافة خزنة جديدة
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
                            className="flex flex-col gap-3 sm:flex-row"
                        >
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="مثال: خزنة الفرع الرئيسي، خزنة البنك..."
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-400"
                                />
                                {errors.name && (
                                    <span className="mt-1.5 block text-xs text-red-500">
                                        {errors.name}
                                    </span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing || !data.name.trim()}
                                className="self-start rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
                            >
                                {processing
                                    ? "جاري الإضافة..."
                                    : "إضافة الخزنة"}
                            </button>
                        </form>
                    </div>

                    {/* قائمة الخزائن */}
                    <div className={`${card} p-6`}>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                الخزائن المسجلة
                            </h3>
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                {treasuries.length} خزنة
                            </span>
                        </div>

                        {treasuries.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-neutral-500">
                                <svg
                                    className="mb-3 h-10 w-10 opacity-60"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                                    />
                                </svg>
                                <p className="text-sm">
                                    لا توجد خزائن مضافة حتى الآن.
                                </p>
                            </div>
                        ) : (
                            <ul className="space-y-2.5">
                                {treasuries.map((treasury) => (
                                    <li
                                        key={treasury.id}
                                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-3.5 transition hover:border-emerald-300 hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-emerald-500/40 dark:hover:bg-neutral-700/80"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-sm font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                                                {treasury.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {treasury.name}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(treasury.id)
                                            }
                                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                        >
                                            حذف
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
