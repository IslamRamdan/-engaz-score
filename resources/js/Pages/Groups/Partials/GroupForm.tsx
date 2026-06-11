import React, { useEffect, useState, useRef, FormEvent } from "react";
import { useForm } from "@inertiajs/react";

interface Job {
    Value: string | number;
    Text: string;
}

interface Visa {
    id: number;
    name: string;
}

interface GroupFormProps {
    isOpen: boolean;
    onClose: () => void;
    group: any;
    visas: Visa[];
    jobs: Job[];
}

export default function GroupForm({
    isOpen,
    onClose,
    group,
    visas,
    jobs = [],
}: GroupFormProps) {
    const [jobSearch, setJobSearch] = useState<string>("");
    const [jobDropdownOpen, setJobDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // نستخدم القيم الافتراضية للفورم
    const { data, setData, post, put, processing, reset, clearErrors } =
        useForm({
            name: "",
            visa_id: "",
            notes: "",
        });

    // تحديث البيانات عند فتح المودال أو تغير الـ group
    useEffect(() => {
        if (isOpen) {
            if (group) {
                // تحديث بيانات الفورم بالقيم القادمة من الـ group
                setData({
                    name: group.name || "",
                    visa_id: group.visa_id ? String(group.visa_id) : "",
                    notes: group.notes || "",
                });

                // تحديث حقل البحث الخاص بالمهنة بناءً على الـ notes
                const found = jobs.find(
                    (j) => String(j.Value) === String(group.notes),
                );
                setJobSearch(found ? found.Text : "");
            } else {
                reset();
                setJobSearch("");
            }
        } else {
            clearErrors();
        }
    }, [isOpen, group, jobs]);

    // إغلاق القائمة عند النقر خارجها
    useEffect(() => {
        const handleClickOutside = (e: any) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setJobDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredJobs = (jobs || []).filter((job) =>
        job.Text.toLowerCase().includes(jobSearch.toLowerCase()),
    );

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (group) {
            put(route("groups.update", group.id), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route("groups.store"), { onSuccess: () => onClose() });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
                className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-6"
                dir="rtl"
            >
                <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 mb-6">
                    {group ? "تعديل بيانات المجموعة" : "إنشاء مجموعة جديدة"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* اسم المجموعة */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                            اسم المجموعة
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                        />
                    </div>

                    {/* التأشيرة */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                            التأشيرة المرتبطة
                        </label>
                        <select
                            value={data.visa_id}
                            onChange={(e) => setData("visa_id", e.target.value)}
                            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                        >
                            <option value="">اختر التأشيرة...</option>
                            {visas.map((visa) => (
                                <option key={visa.id} value={String(visa.id)}>
                                    {visa.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* المهنة */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                            المهنة
                        </label>
                        <div className="relative" ref={dropdownRef}>
                            <input
                                type="text"
                                value={jobSearch}
                                onChange={(e) => {
                                    setJobSearch(e.target.value);
                                    setJobDropdownOpen(true);
                                }}
                                onFocus={() => setJobDropdownOpen(true)}
                                placeholder="ابحث عن المهنة..."
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                            />

                            {jobDropdownOpen && (
                                <ul className="absolute z-50 w-full mt-1 max-h-52 overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg">
                                    {filteredJobs.length > 0 ? (
                                        filteredJobs.map((job) => (
                                            <li
                                                key={job.Value}
                                                onMouseDown={() => {
                                                    setData(
                                                        "notes",
                                                        String(job.Value),
                                                    );
                                                    setJobSearch(job.Text);
                                                    setJobDropdownOpen(false);
                                                }}
                                                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-zinc-100 ${data.notes === String(job.Value) ? "text-emerald-600 font-bold" : "text-zinc-700"}`}
                                            >
                                                {job.Text}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-4 py-3 text-sm text-zinc-400 text-center">
                                            لا توجد نتائج
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                        >
                            {processing ? "جاري الحفظ..." : "حفظ التغييرات"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
