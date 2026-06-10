import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";

interface Delegate {
    id: number;
    name: string;
    phone: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    delegate: Delegate | null;
}

export default function DelegateForm({ isOpen, onClose, delegate }: Props) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
            phone: "",
        });

    // تحديث البيانات عند فتح النافذة للتعديل
    useEffect(() => {
        if (delegate) {
            setData({
                name: delegate.name,
                phone: delegate.phone,
            });
        } else {
            reset();
        }
        clearErrors();
    }, [delegate, isOpen]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (delegate) {
            put(route("delegates.update", delegate.id), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route("delegates.store"), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="md">
            <div className="flex flex-col max-h-[90vh] bg-white dark:bg-slate-900" dir="rtl">
                {/* هيدر المودال */}
                <div className="p-5 border-b border-zinc-200 dark:border-slate-800 flex items-center justify-between bg-zinc-50/50 dark:bg-slate-900 rounded-t-2xl">
                    <h3 className="text-base font-black text-zinc-800 dark:text-white">
                        {delegate ? "تعديل بيانات المندوب" : "إضافة مندوب جديد"}
                    </h3>
                    <button
                        onClick={onClose}
                        type="button"
                        className="text-zinc-400 hover:text-zinc-600 dark:text-gray-400 dark:hover:text-gray-200 p-1.5 hover:bg-zinc-100 dark:hover:bg-gray-800 rounded-lg transition-all cursor-pointer"
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
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* فورم الإدخال */}
                <form onSubmit={submit} className="p-6 overflow-y-auto space-y-4 flex-1 bg-white dark:bg-slate-900">
                    <div>
                        <label className="block text-xs font-medium text-zinc-600 dark:text-slate-400 mb-1.5 mr-1">
                            اسم المندوب
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className={`w-full text-center px-4 py-2.5 bg-zinc-50 dark:bg-gray-950 border dark:border-gray-700 rounded-xl text-sm text-zinc-900 dark:text-gray-100 placeholder-zinc-400 dark:placeholder-gray-500 transition-all focus:outline-hidden focus:ring-2 ${
                                errors.name 
                                    ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                                    : "border-zinc-200 focus:ring-blue-500 focus:border-blue-500"
                            }`}
                            placeholder="أدخل الاسم الرباعي.."
                        />
                        {errors.name && (
                            <p className="text-red-500 text-[11px] mt-1 mr-1 font-semibold">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-600 dark:text-slate-400 mb-1.5 mr-1">
                            رقم الهاتف
                        </label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            className={`w-full text-center px-4 py-2.5 bg-zinc-50 dark:bg-gray-950 border dark:border-gray-700 rounded-xl text-sm text-zinc-900 dark:text-gray-100 placeholder-zinc-400 dark:placeholder-gray-500 transition-all focus:outline-hidden focus:ring-2 ${
                                errors.phone 
                                    ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                                    : "border-zinc-200 focus:ring-blue-500 focus:border-blue-500"
                            }`}
                            placeholder="مثال: 05XXXXXXXX"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-[11px] mt-1 mr-1 font-semibold">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* أزرار التحكم والـ Actions */}
                    <div className="pt-4 flex gap-3 border-t border-zinc-200 dark:border-slate-800 mt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm shadow-emerald-100 dark:shadow-none disabled:opacity-50 cursor-pointer text-center text-sm"
                        >
                            {processing
                                ? "جاري الحفظ.."
                                : delegate
                                  ? "تحديث البيانات"
                                  : "حفظ المندوب"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 bg-zinc-100 dark:bg-gray-800 text-zinc-600 dark:text-gray-300 font-bold rounded-xl border border-transparent dark:border-gray-700 hover:bg-zinc-200 dark:hover:bg-gray-700 transition-all cursor-pointer text-sm"
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}