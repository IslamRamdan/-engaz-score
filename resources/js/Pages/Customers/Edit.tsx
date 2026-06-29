import React, { useState, useRef, FormEvent } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    UploadCloud,
    X,
    User,
    FileImage,
    CreditCard,
    Briefcase,
    MapPin,
    UserCog,
    FileText,
    Plane,
    Stethoscope,
    FlaskConical,
    Wifi,
} from "lucide-react";

interface Delegate {
    id: number;
    name: string;
}

interface Customer {
    id: number;
    name_ar: string;
    name_en?: string | null;
    gender?: "male" | "female" | "" | null;
    birth_date?: string | null;
    nationality?: string | null;
    marital_status?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    governorate?: string | null;
    address?: string | null;
    passport_number?: string | null;
    passport_issue_date?: string | null;
    passport_expiry_date?: string | null;
    passport_issue_place?: string | null;
    mrz?: string | null;
    national_id?: string | null;
    visa_number?: string | null;
    // e_number?: string | null;
    // medical_status?: "booked" | "fit" | "unfit" | null;
    // medical_token?: string | null;
    // lab_status?: "booked" | "positive" | "negative" | null;
    // enet_status?: "booked" | "not_booked" | null;
    notes?: string | null;
    passport_image?: string | null;
    personal_image?: string | null;
    national_id_image?: string | null;
    job_proof_image?: string | null;
}

interface EditProps {
    customer: Customer;
    current_delegate_id: number | null;
    delegates: Delegate[];
}

interface FormState {
    _method: string;
    name_ar: string;
    name_en: string;
    gender: "male" | "female" | "";
    birth_date: string;
    nationality: string;
    marital_status: string;
    phone: string;
    whatsapp: string;
    governorate: string;
    address: string;
    passport_number: string;
    passport_issue_date: string;
    passport_expiry_date: string;
    passport_issue_place: string;
    mrz: string;
    national_id: string;
    visa_number: string;
    // e_number: string;
    // medical_status: "booked" | "fit" | "unfit";
    // medical_token: string;
    // lab_status: "booked" | "positive" | "negative";
    // enet_status: "booked" | "not_booked";
    notes: string;
    delegate_id: string | number;
    passport_image: File | null;
    personal_image: File | null;
    national_id_image: File | null;
    job_proof_image: File | null;
}

// ─── تحويل yyyy-mm-dd → dd/mm/yyyy للعرض ─────────────────────────────────────
function toDisplay(iso: string) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
}

// ─── Badge الحالة ─────────────────────────────────────────────────────────────
// function StatusBadge({
//     value,
//     type,
// }: {
//     value: string;
//     type: "medical" | "lab" | "enet";
// }) {
//     const configs = {
//         medical: {
//             booked: {
//                 label: "محجوز",
//                 cls: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
//             },
//             fit: {
//                 label: "لائق",
//                 cls: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
//             },
//             unfit: {
//                 label: "غير لائق",
//                 cls: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300",
//             },
//         },
//         lab: {
//             booked: {
//                 label: "محجوز",
//                 cls: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
//             },
//             positive: {
//                 label: "إيجابي",
//                 cls: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300",
//             },
//             negative: {
//                 label: "سلبي",
//                 cls: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
//             },
//         },
//         enet: {
//             booked: {
//                 label: "محجوز",
//                 cls: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
//             },
//             not_booked: {
//                 label: "غير محجوز",
//                 cls: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400",
//             },
//         },
//     } as const;

//     const map = configs[type] as Record<string, { label: string; cls: string }>;
//     const cfg = map[value] ?? {
//         label: value,
//         cls: "bg-zinc-100 text-zinc-500",
//     };

//     return (
//         <span
//             className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${cfg.cls}`}
//         >
//             {cfg.label}
//         </span>
//     );
// }

// ─── مكوّن صف الصورة ──────────────────────────────────────────────────────────
function ImageRow({
    label,
    current,
    value,
    onChange,
    error,
    icon: Icon,
}: {
    label: string;
    current?: string | null;
    value: File | null;
    onChange: (file: File | null) => void;
    error?: string;
    icon: React.ElementType;
}) {
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            if (preview) URL.revokeObjectURL(preview);
            setPreview(
                file.type.startsWith("image/")
                    ? URL.createObjectURL(file)
                    : null,
            );
        }
        onChange(file);
    };

    const handleRemove = () => {
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        onChange(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    const thumbUrl = preview ?? (current ? `/storage/${current}` : null);
    const isPdf = value && !value.type.startsWith("image/");

    return (
        <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/60">
            <div className="flex items-center">
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/60 border-l border-zinc-100 dark:border-zinc-800">
                    {thumbUrl && !isPdf ? (
                        <img
                            src={thumbUrl}
                            alt={label}
                            className="w-16 h-16 object-cover"
                        />
                    ) : isPdf ? (
                        <FileText className="w-6 h-6 text-red-400" />
                    ) : (
                        <Icon className="w-5 h-5 text-zinc-300 dark:text-zinc-600" />
                    )}
                </div>
                <div className="flex-1 px-3 min-w-0">
                    <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">
                        {label}
                    </p>
                    <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate">
                        {value?.name ??
                            (current ? (
                                <a
                                    href={`/storage/${current}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-emerald-600 dark:text-emerald-400 hover:underline"
                                >
                                    عرض الملف الحالي ↗
                                </a>
                            ) : (
                                <span className="text-zinc-300 dark:text-zinc-600">
                                    لا يوجد ملف
                                </span>
                            ))}
                    </p>
                    {value && (
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                            {(value.size / 1024).toFixed(0)} KB
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-1.5 px-3 flex-shrink-0">
                    <label className="flex items-center gap-1.5 text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors whitespace-nowrap">
                        <UploadCloud className="w-3 h-3" />
                        {value || current ? "تغيير" : "رفع ملف"}
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={handleChange}
                        />
                    </label>
                    {(value || current) && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="flex items-center justify-center gap-1 text-[10px] font-bold text-zinc-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg px-2.5 py-1 transition-colors"
                        >
                            <X className="w-3 h-3" /> حذف
                        </button>
                    )}
                </div>
            </div>
            {error && (
                <p className="text-[10px] text-red-500 font-bold px-3 pb-2 mt-1">
                    {error}
                </p>
            )}
        </div>
    );
}

// ─── مكوّن قسم بعنوان ─────────────────────────────────────────────────────────
function Section({
    icon: Icon,
    title,
    children,
}: {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-[11px] font-black tracking-widest uppercase text-emerald-700 dark:text-emerald-400">
                    {title}
                </h3>
            </div>
            {children}
        </div>
    );
}

// ─── مكوّن حقل إدخال ─────────────────────────────────────────────────────────
function Field({
    label,
    required,
    error,
    children,
    className = "",
}: {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={className}>
            <label className="block text-[10px] font-black tracking-widest uppercase text-zinc-500 dark:text-zinc-400 mb-2">
                {label}
                {required && (
                    <span className="text-red-500 normal-case tracking-normal">
                        {" "}
                        *
                    </span>
                )}
            </label>
            {children}
            {error && (
                <p className="text-red-500 text-[10px] mt-1.5 font-bold">
                    {error}
                </p>
            )}
        </div>
    );
}

// ─── مكوّن حقل التاريخ مع عرض dd/mm/yyyy ─────────────────────────────────────
function DateField({
    label,
    value,
    onChange,
    error,
    className = "",
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    className?: string;
}) {
    return (
        <Field label={label} error={error} className={className}>
            <div className="relative">
                <input
                    type="date"
                    value={value || ""} // لضمان عدم حدوث مشاكل إذا كانت القيمة undefined
                    onChange={(e) => onChange(e.target.value)}
                    className={
                        inputCls +
                        " text-transparent dark:text-transparent caret-transparent cursor-pointer [&::-webkit-datetime-edit]:text-transparent [&::-webkit-calendar-picker-indicator]:opacity-100"
                    }
                    dir="ltr"
                />
                <span className="absolute inset-y-0 left-4 flex items-center text-sm font-bold text-zinc-900 dark:text-zinc-100 pointer-events-none select-none">
                    {value ? (
                        toDisplay(value)
                    ) : (
                        <span className="text-zinc-300 dark:text-zinc-600 font-normal text-xs">
                            DD / MM / YYYY
                        </span>
                    )}
                </span>
            </div>
        </Field>
    );
}

const inputCls =
    "w-full px-4 py-2.5 bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-xl text-sm font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none transition-colors placeholder:text-zinc-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500/10 dark:focus:ring-emerald-400/10";
// ─── الصفحة الرئيسية ──────────────────────────────────────────────────────────
export default function Edit({
    customer,
    current_delegate_id,
    delegates,
}: EditProps) {
    const { data, setData, post, processing, errors } = useForm<FormState>({
        _method: "put",
        name_ar: customer.name_ar || "",
        name_en: customer.name_en || "",
        gender: customer.gender || "",
        birth_date: customer.birth_date
            ? customer.birth_date.split("T")[0]
            : "",
        nationality: customer.nationality || "",
        marital_status: customer.marital_status || "",
        phone: customer.phone || "",
        whatsapp: customer.whatsapp || "",
        governorate: customer.governorate || "",
        address: customer.address || "",
        passport_number: customer.passport_number || "",
        passport_issue_date: customer.passport_issue_date
            ? customer.passport_issue_date.split("T")[0]
            : "",
        passport_expiry_date: customer.passport_expiry_date
            ? customer.passport_expiry_date.split("T")[0]
            : "",
        passport_issue_place: customer.passport_issue_place || "",
        mrz: customer.mrz || "",
        national_id: customer.national_id || "",
        visa_number: customer.visa_number || "",
        // e_number: customer.e_number || "",
        // medical_status: customer.medical_status || "booked",
        // medical_token: customer.medical_token || "",
        // lab_status: customer.lab_status || "booked",
        // enet_status: customer.enet_status || "not_booked",
        notes: customer.notes || "",
        delegate_id: current_delegate_id || "",
        passport_image: null,
        personal_image: null,
        national_id_image: null,
        job_proof_image: null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // @ts-ignore
        post(route("customers.update", customer.id));
    };

    return (
        <>
            <Head title={`تعديل بيانات - ${customer.name_ar}`} />

            <div className="max-w-7xl mx-auto pb-16 px-4" dir="rtl">
                {/* ── الهيدر ── */}
                <div className="flex items-center justify-between mb-8 pt-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-[10px] font-black tracking-widest uppercase mb-2">
                            <span>لوحة التحكم</span>
                            <span>›</span>
                            <span className="text-emerald-600 dark:text-emerald-400">
                                تعديل ملف العميل
                            </span>
                        </div>
                        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                            تعديل ملف:{" "}
                            <span className="font-medium text-zinc-400 dark:text-zinc-500">
                                {customer.name_ar}
                            </span>
                        </h1>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                            عدّل البيانات واضغط حفظ — التغييرات تُطبّق فوراً
                        </p>
                    </div>
                    <Link
                        // @ts-ignore
                        href={route("customers.index")}
                        className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors border border-zinc-200 dark:border-zinc-700 px-4 py-2 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-500 bg-white dark:bg-zinc-800/50"
                    >
                        إلغاء والعودة
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex gap-6 items-start">
                        {/* ▶ العمود الأيمن */}
                        <div className="flex-1 min-w-0 space-y-6">
                            {/* البيانات الشخصية */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-7 space-y-6">
                                <Section
                                    icon={UserCog}
                                    title="البيانات الشخصية الأساسية"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <Field
                                            label="الاسم الكامل بالعربية"
                                            required
                                            error={errors.name_ar}
                                            className="md:col-span-2"
                                        >
                                            <input
                                                type="text"
                                                value={data.name_ar}
                                                onChange={(e) =>
                                                    setData(
                                                        "name_ar",
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputCls}
                                                placeholder="الاسم الرباعي كما في المستندات..."
                                            />
                                        </Field>

                                        <Field label="الاسم بالإنجليزية">
                                            <input
                                                type="text"
                                                value={data.name_en}
                                                onChange={(e) =>
                                                    setData(
                                                        "name_en",
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    inputCls + " text-left"
                                                }
                                                dir="ltr"
                                                placeholder="Full name as in passport..."
                                            />
                                        </Field>

                                        <Field label="الجنس">
                                            <select
                                                value={data.gender}
                                                onChange={(e) =>
                                                    setData(
                                                        "gender",
                                                        e.target.value as
                                                            | "male"
                                                            | "female"
                                                            | "",
                                                    )
                                                }
                                                className={
                                                    inputCls + " text-center"
                                                }
                                            >
                                                <option value="">
                                                    اختر الجنس
                                                </option>
                                                <option value="male">
                                                    ذكر
                                                </option>
                                                <option value="female">
                                                    أنثى
                                                </option>
                                            </select>
                                        </Field>

                                        <DateField
                                            label="تاريخ الميلاد"
                                            value={data.birth_date}
                                            onChange={(v) =>
                                                setData("birth_date", v)
                                            }
                                        />

                                        <Field label="الجنسية">
                                            <input
                                                type="text"
                                                value={data.nationality}
                                                onChange={(e) =>
                                                    setData(
                                                        "nationality",
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputCls}
                                                placeholder="مثال: مصري، يمني..."
                                            />
                                        </Field>

                                        <Field label="الحالة الاجتماعية">
                                            <select
                                                value={data.marital_status}
                                                onChange={(e) =>
                                                    setData(
                                                        "marital_status",
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    inputCls + " text-center"
                                                }
                                            >
                                                <option value="">
                                                    اختر الحالة
                                                </option>
                                                <option value="single">
                                                    أعزب / عزباء
                                                </option>
                                                <option value="married">
                                                    متزوج / متزوجة
                                                </option>
                                                <option value="divorced">
                                                    مطلق / مطلقة
                                                </option>
                                                <option value="widowed">
                                                    أرمل / أرملة
                                                </option>
                                            </select>
                                        </Field>
                                    </div>
                                </Section>
                            </div>

                            {/* الاتصال والعنوان */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-7 space-y-6">
                                <Section
                                    icon={MapPin}
                                    title="الاتصال ومقر السكن"
                                >
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                        <Field label="رقم الهاتف">
                                            <input
                                                type="text"
                                                value={data.phone}
                                                onChange={(e) =>
                                                    setData(
                                                        "phone",
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    inputCls + " text-left"
                                                }
                                                dir="ltr"
                                                placeholder="05xxxxxxxx"
                                            />
                                        </Field>

                                        <Field label="رقم الواتساب">
                                            <input
                                                type="text"
                                                value={data.whatsapp}
                                                onChange={(e) =>
                                                    setData(
                                                        "whatsapp",
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    inputCls + " text-left"
                                                }
                                                dir="ltr"
                                                placeholder="05xxxxxxxx"
                                            />
                                        </Field>

                                        <Field label="المحافظة">
                                            <input
                                                type="text"
                                                value={data.governorate}
                                                onChange={(e) =>
                                                    setData(
                                                        "governorate",
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputCls}
                                                placeholder="المحافظة الحالية..."
                                            />
                                        </Field>

                                        <Field label="العنوان بالتفصيل">
                                            <input
                                                type="text"
                                                value={data.address}
                                                onChange={(e) =>
                                                    setData(
                                                        "address",
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputCls}
                                                placeholder="المدينة، الشارع..."
                                            />
                                        </Field>

                                        <Field
                                            label="المندوب المسؤول"
                                            error={errors.delegate_id}
                                        >
                                            <select
                                                value={data.delegate_id}
                                                onChange={(e) =>
                                                    setData(
                                                        "delegate_id",
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    inputCls + " text-center"
                                                }
                                            >
                                                <option value="">
                                                    -- بدون مندوب --
                                                </option>
                                                {delegates.map((d) => (
                                                    <option
                                                        key={d.id}
                                                        value={d.id}
                                                    >
                                                        {d.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>
                                    </div>
                                </Section>
                            </div>

                            {/* الجواز والوثائق */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-7 space-y-6">
                                <Section
                                    icon={CreditCard}
                                    title="وثائق السفر والهوية الوطنية"
                                >
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                                        <Field label="رقم جواز السفر">
                                            <input
                                                type="text"
                                                value={data.passport_number}
                                                onChange={(e) =>
                                                    setData(
                                                        "passport_number",
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    inputCls +
                                                    " text-left uppercase tracking-widest font-mono"
                                                }
                                                dir="ltr"
                                                placeholder="N00000000"
                                            />
                                        </Field>

                                        <DateField
                                            label="تاريخ إصدار الجواز"
                                            value={data.passport_issue_date}
                                            onChange={(v) =>
                                                setData(
                                                    "passport_issue_date",
                                                    v,
                                                )
                                            }
                                        />

                                        <DateField
                                            label="تاريخ انتهاء الجواز"
                                            value={data.passport_expiry_date}
                                            onChange={(v) =>
                                                setData(
                                                    "passport_expiry_date",
                                                    v,
                                                )
                                            }
                                            error={errors.passport_expiry_date}
                                        />

                                        <Field label="مكان إصدار الجواز">
                                            <input
                                                type="text"
                                                value={
                                                    data.passport_issue_place
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "passport_issue_place",
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputCls}
                                                placeholder="القاهرة..."
                                            />
                                        </Field>

                                        <Field label="الرقم القومي / الهوية">
                                            <input
                                                type="text"
                                                value={data.national_id}
                                                onChange={(e) =>
                                                    setData(
                                                        "national_id",
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    inputCls +
                                                    " text-left tracking-widest font-mono"
                                                }
                                                dir="ltr"
                                            />
                                        </Field>

                                        <Field
                                            label="المنطقة المقروءة آلياً (MRZ)"
                                            className="md:col-span-3"
                                        >
                                            <textarea
                                                rows={2}
                                                value={data.mrz}
                                                onChange={(e) =>
                                                    setData(
                                                        "mrz",
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    inputCls +
                                                    " font-mono tracking-widest text-left resize-none"
                                                }
                                                dir="ltr"
                                                placeholder="P<YEM<<..."
                                            />
                                        </Field>
                                    </div>
                                </Section>
                            </div>

                            {/* التأشيرة */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-7 space-y-6">
                                <Section icon={Plane} title="بيانات التأشيرة">
                                    <div className="grid grid-cols-2 gap-5">
                                        <Field label="رقم التأشيرة (Visa Number)">
                                            <input
                                                type="text"
                                                value={data.visa_number}
                                                onChange={(e) =>
                                                    setData(
                                                        "visa_number",
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    inputCls +
                                                    " text-left font-mono"
                                                }
                                                dir="ltr"
                                            />
                                        </Field>
                                        {/* 
                                        <Field label="الرقم الإلكتروني (E-Number)">
                                            <input
                                                type="text"
                                                value={data.e_number}
                                                onChange={(e) =>
                                                    setData(
                                                        "e_number",
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    inputCls +
                                                    " text-left font-mono"
                                                }
                                                dir="ltr"
                                            />
                                        </Field> */}
                                    </div>
                                </Section>
                            </div>

                            {/* الكشف الطبي والمعامل والنت */}
                            {/* <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-7 space-y-6">
                                <Section
                                    icon={Stethoscope}
                                    title="الكشف الطبي والمعامل والنت"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <div className="space-y-3 p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-black tracking-widest uppercase text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                                                    <Stethoscope className="w-3 h-3" />{" "}
                                                    الكشف الطبي
                                                </p>
                                                <StatusBadge
                                                    value={data.medical_status}
                                                    type="medical"
                                                />
                                            </div>
                                            <select
                                                value={data.medical_status}
                                                onChange={(e) =>
                                                    setData(
                                                        "medical_status",
                                                        e.target
                                                            .value as FormState["medical_status"],
                                                    )
                                                }
                                                className={inputCls}
                                            >
                                                <option value="booked">
                                                    محجوز
                                                </option>
                                                <option value="fit">
                                                    لائق
                                                </option>
                                                <option value="unfit">
                                                    غير لائق
                                                </option>
                                            </select>
                                            <div>
                                                <label className="block text-[10px] font-black tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-1.5">
                                                    رقم التوكن الطبي
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.medical_token}
                                                    onChange={(e) =>
                                                        setData(
                                                            "medical_token",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={
                                                        inputCls +
                                                        " text-left font-mono"
                                                    }
                                                    dir="ltr"
                                                    placeholder="MED-TOKEN..."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3 p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-black tracking-widest uppercase text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                                                    <FlaskConical className="w-3 h-3" />{" "}
                                                    نتيجة المعامل
                                                </p>
                                                <StatusBadge
                                                    value={data.lab_status}
                                                    type="lab"
                                                />
                                            </div>
                                            <select
                                                value={data.lab_status}
                                                onChange={(e) =>
                                                    setData(
                                                        "lab_status",
                                                        e.target
                                                            .value as FormState["lab_status"],
                                                    )
                                                }
                                                className={inputCls}
                                            >
                                                <option value="booked">
                                                    محجوز
                                                </option>
                                                <option value="positive">
                                                    إيجابي
                                                </option>
                                                <option value="negative">
                                                    سلبي
                                                </option>
                                            </select>
                                        </div>

                                        <div className="space-y-3 p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-black tracking-widest uppercase text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                                                    <Wifi className="w-3 h-3" />{" "}
                                                    حالة النت (ENET)
                                                </p>
                                                <StatusBadge
                                                    value={data.enet_status}
                                                    type="enet"
                                                />
                                            </div>
                                            <select
                                                value={data.enet_status}
                                                onChange={(e) =>
                                                    setData(
                                                        "enet_status",
                                                        e.target
                                                            .value as FormState["enet_status"],
                                                    )
                                                }
                                                className={inputCls}
                                            >
                                                <option value="not_booked">
                                                    غير محجوز
                                                </option>
                                                <option value="booked">
                                                    محجوز
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </Section>
                            </div> */}

                            {/* ملاحظات */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-7">
                                <Field label="ملاحظات إضافية بخصوص العميل">
                                    <textarea
                                        rows={4}
                                        value={data.notes || ""}
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                        className={inputCls + " resize-none"}
                                        placeholder="اكتب أي ملاحظات أو شروط خاصة بالعميل هنا..."
                                    />
                                </Field>
                            </div>
                        </div>

                        {/* ◀ العمود الأيسر */}
                        <div className="w-72 shrink-0 space-y-5 sticky top-6">
                            {/* بطاقة الصور */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-5">
                                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                        <FileImage className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h3 className="text-[11px] font-black tracking-widest uppercase text-emerald-700 dark:text-emerald-400">
                                        الوثائق والمرفقات
                                    </h3>
                                </div>
                                <div className="space-y-2">
                                    <ImageRow
                                        label="الصورة الشخصية"
                                        current={customer.personal_image}
                                        value={data.personal_image}
                                        onChange={(f) =>
                                            setData("personal_image", f)
                                        }
                                        error={errors.personal_image}
                                        icon={User}
                                    />
                                    <ImageRow
                                        label="صورة جواز السفر"
                                        current={customer.passport_image}
                                        value={data.passport_image}
                                        onChange={(f) =>
                                            setData("passport_image", f)
                                        }
                                        error={errors.passport_image}
                                        icon={FileImage}
                                    />
                                    <ImageRow
                                        label="بطاقة الهوية الوطنية"
                                        current={customer.national_id_image}
                                        value={data.national_id_image}
                                        onChange={(f) =>
                                            setData("national_id_image", f)
                                        }
                                        error={errors.national_id_image}
                                        icon={CreditCard}
                                    />
                                    <ImageRow
                                        label="إثبات المهنة / العمل"
                                        current={customer.job_proof_image}
                                        value={data.job_proof_image}
                                        onChange={(f) =>
                                            setData("job_proof_image", f)
                                        }
                                        error={errors.job_proof_image}
                                        icon={Briefcase}
                                    />
                                </div>
                            </div>

                            {/* بطاقة الحفظ */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-5 space-y-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl font-black text-sm transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                                >
                                    {processing ? (
                                        <>
                                            <svg
                                                className="animate-spin h-4 w-4 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            جاري الحفظ...
                                        </>
                                    ) : (
                                        "حفظ التعديلات"
                                    )}
                                </button>

                                <Link
                                    // @ts-ignore
                                    href={route("customers.index")}
                                    className="w-full block text-center px-6 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-bold rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all text-sm"
                                >
                                    تراجع والإلغاء
                                </Link>

                                <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 leading-relaxed pt-1 border-t border-zinc-100 dark:border-zinc-800">
                                    ✓ سيتم تخزين الملفات المرفقة في الخادم مع
                                    توثيق تاريخ ربط المندوب فوراً.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = (page: React.ReactNode) => <AppLayout children={page} />;
