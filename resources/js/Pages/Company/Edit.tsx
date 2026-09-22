import React, { useState } from "react";
import { useForm, usePage, Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
// import { useForm, usePage, Head } from "@inertiajs/react";
// import AppLayout from "@/Layouts/AppLayout";
import { PageProps as InertiaPageProps } from "@/types";
interface Company {
    id: number;
    name: string;
    city?: string;
    address?: string;
    phone?: string;
    email?: string;
    country?: string;
    gemini_api_key?: string;
    users_count?: number;
    sponsors_count?: number;
    visas_count?: number;
    delegates_count?: number;
    bags_count?: number;
}

// interface PageProps {
//     company: Company;
//     flash: {
//         success?: string;
//         error?: string;
//     };
//     [key: string]: any;
// }
interface PageProps extends InertiaPageProps {
    company: Company;
    flash: {
        success?: string;
        error?: string;
    };
}

type FieldKey = "name" | "email" | "phone" | "country" | "city" | "address";

interface FieldConfig {
    key: FieldKey;
    label: string;
    type?: string;
    required?: boolean;
    ltr?: boolean;
    wide?: boolean;
    placeholder?: string;
    options?: string[];
}

const COUNTRIES = [
    "السعودية",
    "مصر",
    "الإمارات",
    "الكويت",
    "قطر",
    "عُمان",
    "البحرين",
    "الأردن",
    "العراق",
    "المغرب",
    "الجزائر",
    "تونس",
    "ليبيا",
    "السودان",
    "لبنان",
    "فلسطين",
    "اليمن",
    "سوريا",
    "موريتانيا",
    "الصومال",
    "تركيا",
    "الولايات المتحدة",
    "المملكة المتحدة",
    "ألمانيا",
    "فرنسا",
    "كندا",
    "أستراليا",
    "إسبانيا",
    "إيطاليا",
    "الصين",
    "الهند",
    "دولة أخرى",
];

// If the saved value isn't in the list (old data), keep it selectable
// instead of letting the select silently show an empty choice.
const withCurrentValue = (options: string[], current: string) =>
    current && !options.includes(current) ? [current, ...options] : options;

const FIELDS: FieldConfig[] = [
    {
        key: "name",
        label: "اسم الشركة",
        required: true,
        wide: true,
        placeholder: "أدخل اسم الشركة",
    },
    {
        key: "email",
        label: "البريد الإلكتروني",
        type: "email",
        ltr: true,
        placeholder: "info@company.com",
    },
    {
        key: "phone",
        label: "رقم الهاتف",
        type: "tel",
        ltr: true,
        placeholder: "+20 100 000 0000",
    },
    {
        key: "country",
        label: "الدولة",
        placeholder: "اختر الدولة",
        options: COUNTRIES,
    },
    {
        key: "city",
        label: "المدينة",
        placeholder: "مثال: القاهرة",
    },
    {
        key: "address",
        label: "العنوان التفصيلي",
        wide: true,
        placeholder: "أدخل العنوان التفصيلي",
    },
];

/* =========================================================
   DESIGN TOKENS
   (dark mode uses Tailwind's built-in zinc palette so the
   classes are always generated, no arbitrary hex values)
========================================================= */

const cardCls =
    "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm transition-all duration-200";

const inputCls =
    "w-full px-3.5 py-3 rounded-xl " +
    "border border-gray-300 dark:border-zinc-700 " +
    "bg-white dark:bg-zinc-950 " +
    "text-gray-900 dark:text-zinc-100 " +
    "placeholder:text-gray-400 dark:placeholder:text-zinc-500 " +
    "focus:outline-none focus:ring-2 focus:ring-emerald-500/30 " +
    "focus:border-emerald-500 " +
    "transition-all text-sm";

const viewCls =
    "px-3.5 py-3 min-h-[46px] flex items-center rounded-xl " +
    "bg-gray-50 dark:bg-zinc-950 " +
    "border border-gray-200 dark:border-zinc-800 " +
    "text-gray-900 dark:text-zinc-100 " +
    "text-sm font-medium";

const labelCls =
    "block text-sm font-semibold mb-2 text-gray-700 dark:text-zinc-300";

/* =========================================================
   ICONS
========================================================= */

const ICONS = {
    pencil: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",

    close: "M6 18L18 6M6 6l12 12",

    chevron: "M19 9l-7 7-7-7",

    mail: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",

    phone: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",

    pin: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",

    building:
        "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",

    sparkles:
        "M5 3v4M3 5h4M6 17v4m-2-2h2m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",

    eye: "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",

    eyeOff: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21",

    check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",

    alert: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",

    users: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",

    star: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",

    document:
        "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",

    userGroup:
        "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",

    bag: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
} as const;

type IconName = keyof typeof ICONS;

function Icon({
    name,
    className = "w-4 h-4",
}: {
    name: IconName;
    className?: string;
}) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={ICONS[name]}
            />
        </svg>
    );
}

/* =========================================================
   SECTION HEADER
   (wraps the badge to a new line when the card is narrow)
========================================================= */

function SectionHeader({
    icon,
    title,
    description,
    badge,
}: {
    icon: IconName;
    title: string;
    description: string;
    badge?: React.ReactNode;
}) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-5">
            <div className="flex items-start gap-3 flex-1 min-w-[200px]">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Icon name={icon} className="w-5 h-5" />
                </div>

                <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">
                        {title}
                    </h2>

                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>

            {badge}
        </div>
    );
}

/* =========================================================
   STATISTICS
========================================================= */

const STATS: {
    key:
        | "users_count"
        | "sponsors_count"
        | "visas_count"
        | "delegates_count"
        | "bags_count";
    label: string;
    icon: IconName;
}[] = [
    {
        key: "users_count",
        label: "المستخدمون",
        icon: "users",
    },
    {
        key: "sponsors_count",
        label: "الكفلاء",
        icon: "star",
    },
    {
        key: "visas_count",
        label: "التأشيرات",
        icon: "document",
    },
    {
        key: "delegates_count",
        label: "المندوبون",
        icon: "userGroup",
    },
    {
        key: "bags_count",
        label: "الحقائب",
        icon: "bag",
    },
];

/* =========================================================
   MAIN PAGE
========================================================= */
export default function CompanyEdit({ company }: { company: Company }) {
    const { flash } = usePage<PageProps>().props;

    const [showApiKey, setShowApiKey] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const {
        data,
        setData,
        put,
        processing,
        errors,
        recentlySuccessful,
        reset,
        clearErrors,
    } = useForm({
        name: company?.name || "",
        city: company?.city || "",
        address: company?.address || "",
        phone: company?.phone || "",
        email: company?.email || "",
        country: company?.country || "",
        gemini_api_key: company?.gemini_api_key || "",
    });

    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route("company.update", company.id), {
            preserveScroll: true,

            onSuccess: () => {
                setIsEditing(false);
                setShowApiKey(false);
            },
        });
    };

    /* =====================================================
       CANCEL
    ===================================================== */

    const handleCancel = () => {
        reset();
        clearErrors();

        setShowApiKey(false);
        setIsEditing(false);
    };

    const location = [company?.city, company?.country]
        .filter(Boolean)
        .join("، ");

    const contactChips = [
        {
            icon: "mail" as const,
            value: company?.email,
            ltr: true,
        },
        {
            icon: "phone" as const,
            value: company?.phone,
            ltr: true,
        },
        {
            icon: "pin" as const,
            value: location,
            ltr: false,
        },
    ].filter((item) => item.value);

    const hasKey = Boolean(company?.gemini_api_key);

    return (
        <AppLayout title="الملف التعريفي للشركة">
            <Head title="الملف التعريفي للشركة" />

            <div
                dir="rtl"
                className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-gray-900 dark:text-zinc-100 transition-colors duration-200"
            >
                {/* =================================================
                    SUCCESS
                ================================================= */}

                {(flash?.success || recentlySuccessful) && (
                    <div
                        role="status"
                        className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-sm font-semibold"
                    >
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center shrink-0">
                            <Icon
                                name="check"
                                className="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                            />
                        </div>

                        <span>
                            {flash?.success || "تم تحديث بيانات الشركة بنجاح."}
                        </span>
                    </div>
                )}

                {/* =================================================
                    ERROR
                ================================================= */}

                {flash?.error && (
                    <div
                        role="alert"
                        className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300 text-sm font-semibold"
                    >
                        <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center shrink-0">
                            <Icon
                                name="alert"
                                className="w-5 h-5 text-rose-600 dark:text-rose-400"
                            />
                        </div>

                        <span>{flash.error}</span>
                    </div>
                )}

                {/* =================================================
                    HERO
                ================================================= */}

                <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm">
                    {/* Dot Background */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-50"
                        style={{
                            backgroundImage:
                                "radial-gradient(currentColor 1px, transparent 1px)",
                            backgroundSize: "18px 18px",
                            color: "rgba(16,185,129,0.25)",
                        }}
                    />

                    {/* Soft Glow */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

                    <div className="relative p-6 sm:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-6">
                            {/* COMPANY INFO */}

                            <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                                {/* Logo */}
                                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl bg-gray-100 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-extrabold text-3xl sm:text-4xl shadow-sm">
                                    {company?.name
                                        ? company.name.charAt(0)
                                        : "ش"}
                                </div>

                                <div className="min-w-0 space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight truncate">
                                            {company?.name || "اسم الشركة"}
                                        </h1>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">
                                            معرف الشركة: #{company?.id}
                                        </span>

                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            حساب نشط
                                        </span>
                                    </div>

                                    {/* CONTACT CHIPS */}

                                    {contactChips.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {contactChips.map((chip) => (
                                                <span
                                                    key={chip.icon}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-gray-600 dark:text-zinc-300"
                                                >
                                                    <Icon
                                                        name={chip.icon}
                                                        className="w-3.5 h-3.5 text-emerald-500"
                                                    />

                                                    <span
                                                        dir={
                                                            chip.ltr
                                                                ? "ltr"
                                                                : "rtl"
                                                        }
                                                    >
                                                        {chip.value}
                                                    </span>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* EDIT BUTTON */}

                            <button
                                type="button"
                                onClick={() =>
                                    isEditing
                                        ? handleCancel()
                                        : setIsEditing(true)
                                }
                                className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm ${
                                    isEditing
                                        ? "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-950/50"
                                        : "bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600"
                                }`}
                            >
                                <Icon
                                    name={isEditing ? "close" : "pencil"}
                                    className="w-4 h-4"
                                />

                                {isEditing ? "إلغاء التعديل" : "تعديل البيانات"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    STATISTICS
                ================================================= */}

                <section aria-label="إحصائيات الشركة">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h2 className="text-base font-bold text-gray-900 dark:text-white">
                                نظرة عامة
                            </h2>

                            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                                ملخص سريع لأهم البيانات المرتبطة بالشركة
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
                        {STATS.map((stat) => (
                            <div
                                key={stat.key}
                                className={`${cardCls} p-4 hover:border-emerald-300 dark:hover:border-emerald-800 last:col-span-2 xl:last:col-span-1`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 shrink-0 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <Icon
                                            name={stat.icon}
                                            className="w-5 h-5"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xl font-black text-gray-900 dark:text-white tabular-nums leading-none">
                                            {(
                                                company?.[stat.key] ?? 0
                                            ).toLocaleString("en-US")}
                                        </p>

                                        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mt-1.5 truncate">
                                            {stat.label}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start"
                >
                    {/* COMPANY DATA */}

                    <section
                        className={`${cardCls} p-5 sm:p-6 space-y-6 xl:col-span-2`}
                    >
                        <SectionHeader
                            icon="building"
                            title="بيانات الشركة الأساسية"
                            description="معلومات التواصل والموقع التجاري التابع للشركة."
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            {FIELDS.map((field) => (
                                <div
                                    key={field.key}
                                    className={
                                        field.wide ? "md:col-span-2" : ""
                                    }
                                >
                                    <label
                                        htmlFor={field.key}
                                        className={labelCls}
                                    >
                                        {field.label}

                                        {field.required && (
                                            <span className="text-rose-500 ms-1">
                                                *
                                            </span>
                                        )}
                                    </label>

                                    {isEditing && field.options ? (
                                        <div className="relative">
                                            <select
                                                id={field.key}
                                                required={field.required}
                                                value={data[field.key]}
                                                dir="rtl"
                                                onChange={(e) => {
                                                    setData(
                                                        field.key,
                                                        e.target.value,
                                                    );
                                                    clearErrors(field.key);
                                                }}
                                                className={`${inputCls} appearance-none pl-10 text-right cursor-pointer`}
                                            >
                                                <option
                                                    value=""
                                                    className="bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400"
                                                >
                                                    {field.placeholder}
                                                </option>

                                                {withCurrentValue(
                                                    field.options,
                                                    data[field.key],
                                                ).map((option) => (
                                                    <option
                                                        key={option}
                                                        value={option}
                                                        className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100"
                                                    >
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>

                                            <Icon
                                                name="chevron"
                                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500 pointer-events-none"
                                            />
                                        </div>
                                    ) : isEditing ? (
                                        <input
                                            id={field.key}
                                            type={field.type || "text"}
                                            required={field.required}
                                            value={data[field.key]}
                                            placeholder={field.placeholder}
                                            dir={field.ltr ? "ltr" : "rtl"}
                                            onChange={(e) => {
                                                setData(
                                                    field.key,
                                                    e.target.value,
                                                );
                                                clearErrors(field.key);
                                            }}
                                            className={`${inputCls} ${
                                                field.ltr
                                                    ? "text-left"
                                                    : "text-right"
                                            }`}
                                        />
                                    ) : (
                                        <div
                                            dir={field.ltr ? "ltr" : "rtl"}
                                            className={`${viewCls} ${
                                                field.ltr
                                                    ? "justify-start text-left"
                                                    : "text-right"
                                            } ${
                                                field.key === "name"
                                                    ? "font-bold"
                                                    : ""
                                            }`}
                                        >
                                            {company?.[field.key] ? (
                                                company[field.key]
                                            ) : (
                                                <span className="text-gray-400 dark:text-zinc-600 italic font-normal">
                                                    غير محدد
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {errors[field.key] && (
                                        <p className="text-rose-600 dark:text-rose-400 text-xs font-medium mt-1.5">
                                            {errors[field.key]}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* =================================================
                        GEMINI API
                    ================================================= */}

                    <aside className={`${cardCls} p-5 sm:p-6 space-y-5`}>
                        <SectionHeader
                            icon="sparkles"
                            title="ربط الذكاء الاصطناعي"
                            description="مفتاح الربط البرمجي لمعالجة البيانات بالذكاء الاصطناعي."
                            badge={
                                <span
                                    className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                                        hasKey
                                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                            : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700"
                                    }`}
                                >
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${
                                            hasKey
                                                ? "bg-emerald-500"
                                                : "bg-gray-500"
                                        }`}
                                    />

                                    {hasKey ? "متصل" : "غير مربوط"}
                                </span>
                            }
                        />

                        <div>
                            <label
                                htmlFor="gemini_api_key"
                                className={labelCls}
                            >
                                Gemini API Key
                            </label>

                            {isEditing ? (
                                <div className="relative">
                                    <input
                                        id="gemini_api_key"
                                        dir="ltr"
                                        autoComplete="off"
                                        spellCheck={false}
                                        type={showApiKey ? "text" : "password"}
                                        value={data.gemini_api_key}
                                        onChange={(e) => {
                                            setData(
                                                "gemini_api_key",
                                                e.target.value,
                                            );
                                            clearErrors("gemini_api_key");
                                        }}
                                        placeholder="AIzaSy..."
                                        className={`${inputCls} pr-24 font-mono text-left`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowApiKey(!showApiKey)
                                        }
                                        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700 transition"
                                    >
                                        <Icon
                                            name={showApiKey ? "eyeOff" : "eye"}
                                            className="w-3.5 h-3.5"
                                        />

                                        {showApiKey ? "إخفاء" : "إظهار"}
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className={`${viewCls} justify-between gap-3 font-mono`}
                                >
                                    <span
                                        dir="ltr"
                                        className="truncate min-w-0 text-left"
                                    >
                                        {hasKey ? (
                                            showApiKey ? (
                                                company.gemini_api_key
                                            ) : (
                                                "••••••••••••••••••••"
                                            )
                                        ) : (
                                            <span
                                                dir="rtl"
                                                className="font-sans text-gray-400 dark:text-zinc-600 italic font-normal"
                                            >
                                                لم يتم ربط مفتاح API حتى الآن
                                            </span>
                                        )}
                                    </span>

                                    {hasKey && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowApiKey(!showApiKey)
                                            }
                                            className="shrink-0 inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-sans font-bold transition"
                                        >
                                            <Icon
                                                name={
                                                    showApiKey
                                                        ? "eyeOff"
                                                        : "eye"
                                                }
                                                className="w-3.5 h-3.5"
                                            />

                                            {showApiKey ? "إخفاء" : "إظهار"}
                                        </button>
                                    )}
                                </div>
                            )}

                            {errors.gemini_api_key && (
                                <p className="text-rose-600 dark:text-rose-400 text-xs font-medium mt-1.5">
                                    {errors.gemini_api_key}
                                </p>
                            )}

                            <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800">
                                <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                                    احتفظ بالمفتاح سريًا ولا تشاركه مع أحد.
                                    يمكنك استبداله في أي وقت من وضع التعديل.
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* =================================================
                        SAVE BAR
                    ================================================= */}

                    {isEditing && (
                        <div className="col-span-full sticky bottom-4 z-20">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="hidden sm:flex w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <Icon
                                            name="pencil"
                                            className="w-4 h-4"
                                        />
                                    </div>

                                    <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium">
                                        أنت الآن في وضع التعديل. لن يتم حفظ
                                        التغييرات قبل الضغط على حفظ التغييرات.
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={processing}
                                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-sm font-semibold disabled:opacity-50"
                                    >
                                        إلغاء
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                                    >
                                        {processing && (
                                            <svg
                                                className="animate-spin h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
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
                                        )}

                                        {processing
                                            ? "جاري الحفظ..."
                                            : "حفظ التغييرات"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </AppLayout>
    );
}
