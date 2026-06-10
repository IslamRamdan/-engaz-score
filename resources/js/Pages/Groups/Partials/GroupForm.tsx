import React, { useEffect, useState, useRef } from "react";
import { useForm } from "@inertiajs/react";

export default function GroupForm({ isOpen, onClose, group, visas }) {
    const [jobs, setJobs] = useState([]);
    const [jobSearch, setJobSearch] = useState("");
    const [jobDropdownOpen, setJobDropdownOpen] = useState(false);
    const [selectedJobText, setSelectedJobText] = useState("");
    const dropdownRef = useRef(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: group?.name || "",
            visa_id: group?.visa_id || "",
            notes: group?.notes || "",
        });

    // تحميل المهن
    useEffect(() => {
        fetch("/jops.json")
            .then((res) => res.json())
            .then((data) => setJobs(data))
            .catch((err) => console.error("Error loading jobs:", err));
    }, []);

    // عند تحميل jobs، اظهر نص المهنة المحفوظة
    useEffect(() => {
        if (group?.notes && jobs.length > 0) {
            const found = jobs.find((j) => j.Value === group.notes);
            if (found) {
                setSelectedJobText(found.Text);
                setJobSearch(found.Text);
            }
        }
    }, [jobs, group]);

    // تحديث البيانات عند فتح المودال
    useEffect(() => {
        if (group) {
            setData({
                name: group.name,
                visa_id: group.visa_id,
                notes: group.notes || "",
            });
            if (jobs.length > 0 && group.notes) {
                const found = jobs.find((j) => j.Value === group.notes);
                if (found) {
                    setSelectedJobText(found.Text);
                    setJobSearch(found.Text);
                }
            }
        } else {
            reset();
            setJobSearch("");
            setSelectedJobText("");
        }
        clearErrors();
        setJobDropdownOpen(false);
    }, [group, isOpen]);

    // اغلق الـ dropdown عند الضغط خارجه
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setJobDropdownOpen(false);
                if (selectedJobText) setJobSearch(selectedJobText);
                else setJobSearch("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedJobText]);

    // فلترة المهن
    const filteredJobs = jobs.filter((job) =>
        job.Text.toLowerCase().includes(jobSearch.toLowerCase()),
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        if (group) {
            put(route("groups.update", group.id), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route("groups.store"), {
                onSuccess: () => {
                    reset();
                    setJobSearch("");
                    setSelectedJobText("");
                    onClose();
                },
            });
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
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name}
                            </p>
                        )}
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
                                <option key={visa.id} value={visa.id}>
                                    {visa.name}
                                </option>
                            ))}
                        </select>
                        {errors.visa_id && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.visa_id}
                            </p>
                        )}
                    </div>

                    {/* المهنة مع بحث */}
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
                                placeholder="ابحث عن المهنة أو اختر..."
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                            />

                            {jobDropdownOpen && filteredJobs.length > 0 && (
                                <ul className="absolute z-50 w-full mt-1 max-h-52 overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg">
                                    {filteredJobs.map((job, index) => (
                                        <li
                                            key={index}
                                            onMouseDown={() => {
                                                setData("notes", job.Value);
                                                setSelectedJobText(job.Text);
                                                setJobSearch(job.Text);
                                                setJobDropdownOpen(false);
                                            }}
                                            className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-800 last:border-0
                                                ${data.notes === job.Value ? "text-emerald-600 font-bold" : "text-zinc-700 dark:text-zinc-300"}`}
                                        >
                                            {job.Text}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {jobDropdownOpen && filteredJobs.length === 0 && (
                                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-400 text-center">
                                    لا توجد نتائج
                                </div>
                            )}
                        </div>
                        {errors.notes && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.notes}
                            </p>
                        )}
                    </div>

                    {/* الأزرار */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-all"
                        >
                            إلغاء
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg transition-all"
                        >
                            {processing ? "جاري الحفظ..." : "حفظ التغييرات"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
