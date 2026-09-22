import React, { useEffect, useState, useRef } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import HijriDatePicker from "@/Components/HijriDatePicker";

interface Sponsor {
    id: number;
    name: string;
}

interface Visa {
    id: number;
    name: string;
    type: string;
    issue_number: string;
    consulate: string;
    issue_date_hijri: string;
    sponsor_id: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    visa: Visa | null;
    sponsors: Sponsor[];
}

// قائمة القنصليات والبعثات
const CONSULATES = [
    "القاهرة",
    "الإسكندرية",
    "السويس",
    "جدة",
    "الرياض",
    "دبي",
    "أبوظبي",
    "الكويت",
    "المنامة",
    "مسقط",
    "الدوحة",
    "عمان",
    "بيروت",
    "بغداد",
    "أربيل",
    "دمشق",
    "الخرطوم",
    "بنغازي",
    "طرابلس",
    "تونس",
    "الجزائر",
    "الرباط",
    "صنعاء",
    "عدن",
];

export default function VisaForm({
    isOpen,
    onClose,
    visa,
    sponsors = [],
}: Props) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
            type: "",
            issue_number: "",
            consulate: "",
            sponsor_id: "",
            issue_date_hijri: "",
        });

    // حالة البحث والقائمة المنسدلة للقنصلية
    const [searchQuery, setSearchQuery] = useState("");
    const [isConsulateOpen, setIsConsulateOpen] = useState(false);
    const consulateRef = useRef<HTMLDivElement>(null);

    const filteredConsulates = CONSULATES.filter((item) =>
        item.toLowerCase().includes(searchQuery.trim().toLowerCase()),
    );

    // إغلاق قائمة القنصلية عند الضغط خارج المكون
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                consulateRef.current &&
                !consulateRef.current.contains(event.target as Node)
            ) {
                setIsConsulateOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (visa) {
            setData({
                name: visa.name,
                type: visa.type,
                issue_number: visa.issue_number,
                consulate: visa.consulate,
                sponsor_id: visa.sponsor_id.toString(),
                issue_date_hijri: visa.issue_date_hijri,
            });
        } else {
            reset();
        }
        clearErrors();
        setSearchQuery("");
        setIsConsulateOpen(false);
    }, [visa, isOpen]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (visa) {
            put(route("visas.update", visa.id), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route("visas.store"), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div
                className="flex flex-col max-h-[90vh] bg-white dark:bg-slate-900 overflow-visible"
                dir="rtl"
            >
                {/* هيدر المودال */}
                <div className="p-5 border-b border-zinc-200 dark:border-slate-800 flex items-center justify-between bg-zinc-50/50 dark:bg-slate-900 rounded-t-2xl">
                    <h3 className="text-base font-black text-zinc-800 dark:text-white">
                        {visa ? "تعديل بيانات التأشيرة" : "إضافة تأشيرة جديدة"}
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
                <form
                    onSubmit={handleFormSubmit}
                    className="p-6 overflow-y-auto space-y-4 flex-1 bg-white dark:bg-slate-900"
                >
                    {/* اسم التأشيرة */}
                    <div>
                        <label className="block text-xs font-medium text-zinc-600 dark:text-slate-400 mb-1.5 mr-1">
                            اسم التأشيرة / الوصف
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className={`w-full text-center px-4 py-2.5 bg-zinc-50 dark:bg-gray-950 border dark:border-gray-700 rounded-xl text-sm text-zinc-900 dark:text-gray-100 placeholder-zinc-400 dark:placeholder-gray-500 transition-all focus:outline-hidden focus:ring-2 ${
                                errors.name
                                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                    : "border-zinc-200 focus:ring-emerald-500 focus:border-emerald-500"
                            }`}
                            placeholder="مثال: تأشيرة موسم الحج 1447"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-[11px] mt-1 mr-1 font-semibold">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* نوع التأشيرة واختيار الكفيل */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-600 dark:text-slate-400 mb-1.5 mr-1">
                                نوع التأشيرة
                            </label>
                            <select
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                className={`w-full text-center pr-4 pl-10 py-2.5 bg-zinc-50 dark:bg-gray-950 border dark:border-gray-700 rounded-xl text-sm text-zinc-900 dark:text-gray-100 transition-all focus:outline-hidden focus:ring-2 ${
                                    errors.type
                                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                        : "border-zinc-200 focus:ring-emerald-500 focus:border-emerald-500"
                                }`}
                            >
                                <option value="">
                                    -- اختر نوع التأشيرة --
                                </option>
                                <option value="work_temp_hajj_umrah">
                                    تأشيرة العمل المؤقت للحج والعمرة
                                </option>
                                <option value="work">تأشيرة عمل</option>
                                <option value="temporary_work">
                                    تأشيرة عمل مؤقت
                                </option>
                            </select>
                            {errors.type && (
                                <p className="text-red-500 text-[11px] mt-1 mr-1 font-semibold">
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-600 dark:text-slate-400 mb-1.5 mr-1">
                                اختيار الكفيل المرتبط
                            </label>
                            <select
                                value={data.sponsor_id}
                                onChange={(e) =>
                                    setData("sponsor_id", e.target.value)
                                }
                                className={`w-full text-center pr-4 pl-10 py-2.5 bg-zinc-50 dark:bg-gray-950 border dark:border-gray-700 rounded-xl text-sm text-zinc-900 dark:text-gray-100 transition-all focus:outline-hidden focus:ring-2 ${
                                    errors.sponsor_id
                                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                        : "border-zinc-200 focus:ring-emerald-500 focus:border-emerald-500"
                                }`}
                            >
                                <option value="">
                                    -- اختر الكفيل المعتمد --
                                </option>
                                {sponsors.map((sponsor) => (
                                    <option key={sponsor.id} value={sponsor.id}>
                                        {sponsor.name}
                                    </option>
                                ))}
                            </select>
                            {errors.sponsor_id && (
                                <p className="text-red-500 text-[11px] mt-1 mr-1 font-semibold">
                                    {errors.sponsor_id}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* رقم الصادر والقنصلية (القابلة للبحث) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-600 dark:text-slate-400 mb-1.5 mr-1">
                                رقم الصادر / الإصدار
                            </label>
                            <input
                                type="text"
                                value={data.issue_number}
                                onChange={(e) =>
                                    setData("issue_number", e.target.value)
                                }
                                className={`w-full text-center px-4 py-2.5 bg-zinc-50 dark:bg-gray-950 border dark:border-gray-700 rounded-xl text-sm text-zinc-900 dark:text-gray-100 placeholder-zinc-400 dark:placeholder-gray-500 transition-all focus:outline-hidden focus:ring-2 ${
                                    errors.issue_number
                                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                        : "border-zinc-200 focus:ring-emerald-500 focus:border-emerald-500"
                                }`}
                                placeholder="أدخل رقم الصادر الإلكتروني"
                            />
                            {errors.issue_number && (
                                <p className="text-red-500 text-[11px] mt-1 mr-1 font-semibold">
                                    {errors.issue_number}
                                </p>
                            )}
                        </div>

                        {/* القنصلية القابلة للبحث */}
                        <div className="relative" ref={consulateRef}>
                            <label className="block text-xs font-medium text-zinc-600 dark:text-slate-400 mb-1.5 mr-1">
                                القنصلية / البعثة
                            </label>
                            <button
                                type="button"
                                onClick={() =>
                                    setIsConsulateOpen(!isConsulateOpen)
                                }
                                className={`w-full text-right px-4 py-2.5 bg-zinc-50 dark:bg-gray-950 border dark:border-gray-700 rounded-xl text-sm text-zinc-900 dark:text-gray-100 flex items-center justify-between transition-all focus:outline-none focus:ring-2 ${
                                    errors.consulate
                                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                        : "border-zinc-200 focus:ring-emerald-500 focus:border-emerald-500"
                                }`}
                            >
                                <span
                                    className={
                                        data.consulate
                                            ? "font-bold text-zinc-900 dark:text-gray-100"
                                            : "text-zinc-400 dark:text-gray-500"
                                    }
                                >
                                    {data.consulate || "-- اختر القنصلية --"}
                                </span>
                                <svg
                                    className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                                        isConsulateOpen ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {isConsulateOpen && (
                                <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-gray-900 border border-zinc-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
                                    <div className="p-2 border-b border-zinc-100 dark:border-gray-800">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            placeholder="ابحث عن القنصلية..."
                                            autoFocus
                                            className="w-full px-3 py-1.5 text-xs bg-zinc-50 dark:bg-gray-950 border border-zinc-200 dark:border-gray-700 rounded-lg text-zinc-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        />
                                    </div>

                                    <div className="max-h-48 overflow-y-auto py-1 text-sm">
                                        <div
                                            onClick={() => {
                                                setData("consulate", "");
                                                setIsConsulateOpen(false);
                                                setSearchQuery("");
                                            }}
                                            className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-gray-800 cursor-pointer text-zinc-400 dark:text-gray-500 text-xs"
                                        >
                                            -- بدون تحديد --
                                        </div>

                                        {filteredConsulates.length > 0 ? (
                                            filteredConsulates.map((item) => (
                                                <div
                                                    key={item}
                                                    onClick={() => {
                                                        setData(
                                                            "consulate",
                                                            item,
                                                        );
                                                        setIsConsulateOpen(
                                                            false,
                                                        );
                                                        setSearchQuery("");
                                                    }}
                                                    className={`px-4 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer transition-colors flex items-center justify-between ${
                                                        data.consulate === item
                                                            ? "bg-emerald-50 dark:bg-emerald-950/60 font-bold text-emerald-700 dark:text-emerald-400"
                                                            : "text-zinc-800 dark:text-gray-200"
                                                    }`}
                                                >
                                                    <span>{item}</span>
                                                    {data.consulate ===
                                                        item && (
                                                        <svg
                                                            className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-xs text-center text-zinc-400 dark:text-gray-500">
                                                لا توجد نتائج مطابقة
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {errors.consulate && (
                                <p className="text-red-500 text-[11px] mt-1 mr-1 font-semibold">
                                    {errors.consulate}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* التاريخ الهجري */}
                    <HijriDatePicker
                        value={data.issue_date_hijri}
                        onChange={(val) => setData("issue_date_hijri", val)}
                        error={errors.issue_date_hijri}
                        label="تاريخ الإصدار (هجري)"
                    />

                    {/* أزرار الإجراءات */}
                    <div className="pt-4 flex gap-3 border-t border-zinc-100 dark:border-slate-800 mt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm shadow-emerald-100 dark:shadow-none disabled:opacity-50 cursor-pointer text-center text-sm"
                        >
                            {processing
                                ? "جاري الحفظ والربط.."
                                : visa
                                  ? "تحديث التأشيرة"
                                  : "حفظ التأشيرة والربط"}
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
