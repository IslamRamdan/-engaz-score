import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import {
    UserPlus,
    ChevronLeft,
    LayoutDashboard,
    AlertCircle,
    CheckCircle2,
    MapPin,
    CreditCard,
    Stethoscope,
    UploadCloud,
    User,
    FileImage,
    X,
} from "lucide-react";

interface Delegate {
    id: number;
    name: string;
}

interface Props {
    delegates: Delegate[];
}

// ─── مكوّن حقل الرفع مع معاينة الصورة ───────────────────────────────────────
function ImageUploadField({
    label,
    field,
    value,
    onChange,
    error,
    icon: Icon,
}: {
    label: string;
    field: string;
    value: File | null;
    onChange: (file: File | null) => void;
    error?: string;
    icon: React.ElementType;
}) {
    const previewUrl = value ? URL.createObjectURL(value) : null;

    return (
        <div className="group relative">
            <label className="block text-[10px] font-black tracking-widest uppercase text-zinc-500 dark:text-zinc-400 mb-2">
                {label}
            </label>
            <div className="relative border border-dashed border-zinc-300 dark:border-zinc-600 rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-800/40 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300">
                {previewUrl ? (
                    <>
                        <img
                            src={previewUrl}
                            alt={label}
                            className="w-full h-32 object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="absolute top-2 left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                        >
                            <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <p className="text-white text-[10px] font-bold truncate">
                                {value?.name}
                            </p>
                        </div>
                    </>
                ) : (
                    <label className="flex flex-col items-center justify-center h-32 cursor-pointer gap-2 p-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Icon className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 text-center leading-relaxed">
                            اضغط لرفع الصورة
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                                onChange(
                                    e.target.files ? e.target.files[0] : null,
                                )
                            }
                        />
                    </label>
                )}
            </div>
            {error && (
                <p className="text-red-500 text-[10px] mt-1 font-bold">
                    {error}
                </p>
            )}
        </div>
    );
}

// ─── مكوّن قسم بالعنوان ───────────────────────────────────────────────────────
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
            <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-[11px] font-black tracking-widest uppercase text-emerald-700 dark:text-emerald-400">
                    {title}
                </h3>
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700/60" />
            </div>
            {children}
        </div>
    );
}

// ─── مكوّن حقل الإدخال ────────────────────────────────────────────────────────
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
                {label}{" "}
                {required && (
                    <span className="text-red-500 normal-case tracking-normal">
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

// ─── تحويل yyyy-mm-dd ↔ dd/mm/yyyy ──────────────────────────────────────────
// المتصفح يُرجع القيمة دائماً بـ yyyy-mm-dd، نحوّلها للعرض فقط
function toDisplay(iso: string) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
}

const inputCls =
    "w-full px-4 py-2.5 bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-xl text-sm font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none transition-colors placeholder:text-zinc-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500/10 dark:focus:ring-emerald-400/10";

// ─── الصفحة الرئيسية ─────────────────────────────────────────────────────────
export default function Create({ delegates = [] }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name_ar: "",
        name_en: "",
        gender: "",
        birth_date: "",
        nationality: "",
        marital_status: "",
        phone: "",
        whatsapp: "",
        governorate: "",
        address: "",
        passport_number: "",
        passport_issue_date: "",
        passport_expiry_date: "",
        passport_issue_place: "",
        mrz: "",
        national_id: "",
        visa_number: "",
        e_number: "",
        medical_status: "booked",
        medical_token: "",
        lab_status: "booked",
        enet_status: "not_booked",
        notes: "",
        passport_image: null as File | null,
        personal_image: null as File | null,
        national_id_image: null as File | null,
        job_proof_image: null as File | null,
        delegate_id: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("customers.store"), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="إضافة عميل جديد" />

            <div className="max-w-7xl mx-auto pb-16 px-4" dir="rtl">
                {/* ── الهيدر ─────────────────────────────────────────────── */}
                <div className="flex items-center justify-between mb-8 pt-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-[10px] font-black tracking-widest uppercase mb-2">
                            <LayoutDashboard className="w-3 h-3" />
                            <span>لوحة التحكم</span>
                            <ChevronLeft className="w-3 h-3" />
                            <span className="text-emerald-600 dark:text-emerald-400">
                                تسجيل عميل جديد
                            </span>
                        </div>
                        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                            تسجيل ملف عميل متكامل
                        </h1>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                            أدخل البيانات الكاملة للعميل وارفع المستندات
                            المطلوبة
                        </p>
                    </div>
                    <Link
                        href={route("customers.index")}
                        className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors border border-zinc-200 dark:border-zinc-700 px-4 py-2 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-500 bg-white dark:bg-zinc-800/50"
                    >
                        إلغاء والعودة
                    </Link>
                </div>

                {/* ── خطأ عام ─────────────────────────────────────────────── */}
                {(errors as any).error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold">
                        <AlertCircle className="w-5 h-5 shrink-0 animate-pulse" />
                        <span>{(errors as any).error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* ══ التخطيط الرئيسي: يمين (حقول) + يسار (صور) ════════ */}
                    <div className="flex gap-6 items-start">
                        {/* ▶ العمود الأيمن: الحقول ─────────────────────────── */}
                        <div className="flex-1 min-w-0 space-y-6">
                            {/* بطاقة: البيانات الشخصية */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-7 space-y-6">
                                <Section
                                    icon={UserPlus}
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
                                                required
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
                                        <Field label="الاسم بالإنكليزية">
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
                                                placeholder="Full name..."
                                            />
                                        </Field>
                                        <Field label="الجنس">
                                            <select
                                                value={data.gender}
                                                onChange={(e) =>
                                                    setData(
                                                        "gender",
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputCls}
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
                                        <Field label="تاريخ الميلاد">
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={data.birth_date}
                                                    onChange={(e) =>
                                                        setData(
                                                            "birth_date",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={
                                                        inputCls +
                                                        " text-transparent dark:text-transparent caret-transparent cursor-pointer"
                                                    }
                                                    dir="ltr"
                                                />
                                                {/* عرض التنسيق dd/mm/yyyy فوق الحقل */}
                                                <span className="absolute inset-y-0 left-4 flex items-center text-sm font-bold text-zinc-900 dark:text-zinc-100 pointer-events-none select-none">
                                                    {data.birth_date ? (
                                                        toDisplay(
                                                            data.birth_date,
                                                        )
                                                    ) : (
                                                        <span className="text-zinc-300 dark:text-zinc-600">
                                                            DD/MM/YYYY
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </Field>
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
                                                placeholder="مثال: يمني، مصري..."
                                            />
                                        </Field>
                                    </div>
                                </Section>
                            </div>

                            {/* بطاقة: الاتصال والعنوان */}
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
                                            required
                                            error={errors.delegate_id}
                                        >
                                            <select
                                                required
                                                value={data.delegate_id}
                                                onChange={(e) =>
                                                    setData(
                                                        "delegate_id",
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputCls}
                                            >
                                                <option value="">
                                                    -- اختر المندوب --
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

                            {/* بطاقة: الجواز والوثائق */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-7 space-y-6">
                                <Section
                                    icon={CreditCard}
                                    title="بيانات الجواز والوثائق الثبوتية"
                                >
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
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
                                                    inputCls + " text-left"
                                                }
                                                dir="ltr"
                                                placeholder="N00000000"
                                            />
                                        </Field>
                                        <Field label="تاريخ الإصدار">
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={
                                                        data.passport_issue_date
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "passport_issue_date",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={
                                                        inputCls +
                                                        " text-transparent dark:text-transparent caret-transparent cursor-pointer"
                                                    }
                                                    dir="ltr"
                                                />
                                                <span className="absolute inset-y-0 left-4 flex items-center text-sm font-bold text-zinc-900 dark:text-zinc-100 pointer-events-none select-none">
                                                    {data.passport_issue_date ? (
                                                        toDisplay(
                                                            data.passport_issue_date,
                                                        )
                                                    ) : (
                                                        <span className="text-zinc-300 dark:text-zinc-600">
                                                            DD/MM/YYYY
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </Field>
                                        <Field label="تاريخ الانتهاء">
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={
                                                        data.passport_expiry_date
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "passport_expiry_date",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={
                                                        inputCls +
                                                        " text-transparent dark:text-transparent caret-transparent cursor-pointer"
                                                    }
                                                    dir="ltr"
                                                />
                                                <span className="absolute inset-y-0 left-4 flex items-center text-sm font-bold text-zinc-900 dark:text-zinc-100 pointer-events-none select-none">
                                                    {data.passport_expiry_date ? (
                                                        toDisplay(
                                                            data.passport_expiry_date,
                                                        )
                                                    ) : (
                                                        <span className="text-zinc-300 dark:text-zinc-600">
                                                            DD/MM/YYYY
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </Field>
                                        <Field label="الرقم الوطني">
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
                                                    inputCls + " text-left"
                                                }
                                                dir="ltr"
                                                placeholder="الهوية الوطنية..."
                                            />
                                        </Field>
                                        <Field
                                            label="منطقة MRZ"
                                            className="col-span-2 md:col-span-4"
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
                        </div>

                        {/* ◀ العمود الأيسر: صور المستندات ─────────────────── */}
                        <div className="w-72 shrink-0 space-y-6 sticky top-6">
                            {/* بطاقة الصور */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-6 space-y-5">
                                <div className="flex items-center gap-2.5 mb-1">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                        <UploadCloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h3 className="text-[11px] font-black tracking-widest uppercase text-emerald-700 dark:text-emerald-400">
                                        الوثائق والصور
                                    </h3>
                                </div>

                                <ImageUploadField
                                    label="الصورة الشخصية"
                                    field="personal_image"
                                    value={data.personal_image}
                                    onChange={(file) =>
                                        setData("personal_image", file)
                                    }
                                    error={errors.personal_image}
                                    icon={User}
                                />

                                <ImageUploadField
                                    label="صورة جواز السفر"
                                    field="passport_image"
                                    value={data.passport_image}
                                    onChange={(file) =>
                                        setData("passport_image", file)
                                    }
                                    error={errors.passport_image}
                                    icon={FileImage}
                                />

                                <ImageUploadField
                                    label="صورة الهوية الوطنية"
                                    field="national_id_image"
                                    value={data.national_id_image}
                                    onChange={(file) =>
                                        setData("national_id_image", file)
                                    }
                                    error={errors.national_id_image}
                                    icon={CreditCard}
                                />

                                <ImageUploadField
                                    label="إثبات المهنة / العمل"
                                    field="job_proof_image"
                                    value={data.job_proof_image}
                                    onChange={(file) =>
                                        setData("job_proof_image", file)
                                    }
                                    error={errors.job_proof_image}
                                    icon={FileImage}
                                />
                            </div>

                            {/* بطاقة الإرسال */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-6 space-y-4">
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
                                            جاري الرفع والحفظ...
                                        </>
                                    ) : (
                                        "إتمام عملية الحفظ المتكاملة"
                                    )}
                                </button>

                                <Link
                                    href={route("customers.index")}
                                    className="w-full block text-center px-6 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all text-sm"
                                >
                                    تراجع والإلغاء
                                </Link>

                                <div className="flex items-start gap-2 pt-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 leading-relaxed">
                                        سيتم تخزين الملفات المرفقة في الخادم مع
                                        توثيق تاريخ ربط المندوب فوراً.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = (page: React.ReactNode) => <AppLayout children={page} />;
