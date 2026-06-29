import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";

interface Bag {
    id: number;
    name: string;
    consulate_entry_date: string;
    company_id: number;
}

interface BagFormProps {
    isOpen: boolean;
    onClose: () => void;
    bag: Bag | null;
}

export default function BagForm({ isOpen, onClose, bag }: BagFormProps) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
            consulate_entry_date: "",
            make: "",
        });

    // مراقبة تغيير الـ bag (تعديل أو إضافة جديدة) لملء البيانات
    useEffect(() => {
        if (bag) {
            setData({
                name: bag.name,
                // تحويل صيغة التاريخ لـ YYYY-MM-DD لتناسب حقل الـ input date
                consulate_entry_date: bag.consulate_entry_date.split("T")[0],
            });
        } else {
            reset();
        }
        clearErrors();
    }, [bag, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (bag) {
            // في حالة التعديل
            put(route("bags.update", bag.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            // في حالة إضافة جديدة
            post(route("bags.store"), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm"
            dir="rtl"
        >
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* الرأس */}
                <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                        {bag ? "تعديل بيانات الحقيبة" : "إضافة حقيبة جديدة"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
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
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* الفورم */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* حقل الاسم */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                            اسم الحقيبة
                        </label>
                        <input
                            type="text"
                            required
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            placeholder="مثال: حقيبة تأشيرات رقم 12"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500 mt-1 font-medium">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* حقل تاريخ الدخول */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                            تاريخ دخول القنصلية
                        </label>
                        <input
                            type="date"
                            required
                            value={data.consulate_entry_date}
                            onChange={(e) => setData("make", e.target.value)} // في سياق لارافيل بنمررها باسمها الصحيح:
                            onChangeCapture={(e: any) =>
                                setData("consulate_entry_date", e.target.value)
                            }
                            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        />
                        {errors.consulate_entry_date && (
                            <p className="text-xs text-red-500 mt-1 font-medium">
                                {errors.consulate_entry_date}
                            </p>
                        )}
                    </div>

                    {/* أزرار التحكم */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-bold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                        >
                            {processing
                                ? "جاري الحفظ..."
                                : bag
                                  ? "تحديث التغييرات"
                                  : "حفظ الحقيبة"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
