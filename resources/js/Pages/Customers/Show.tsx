import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    User,
    FileImage,
    CreditCard,
    Briefcase,
    MapPin,
    UserCog,
    Plane,
    FileText,
    Pencil,
    Phone,
    MessageCircle,
    Copy,
    Check,
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
    notes?: string | null;
    passport_image?: string | null;
    personal_image?: string | null;
    national_id_image?: string | null;
    job_proof_image?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}

interface ShowProps {
    customer: Customer;
    current_delegate_id: number | null;
    delegates: Delegate[];
}

// ─── تحويل yyyy-mm-dd → dd/mm/yyyy للعرض ─────────────────────────────────────
function toDisplay(iso?: string | null) {
    if (!iso) return null;
    const datePart = iso.split("T")[0];
    const [y, m, d] = datePart.split("-");
    if (!y || !m || !d) return null;
    return `${d}/${m}/${y}`;
}

const GENDER_LABEL: Record<string, string> = {
    male: "ذكر",
    female: "أنثى",
};

const MARITAL_LABEL: Record<string, string> = {
    single: "أعزب / عزباء",
    married: "متزوج / متزوجة",
    divorced: "مطلق / مطلقة",
    widowed: "أرمل / أرملة",
};

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

// ─── مكوّن عرض قيمة حقل مع خاصية النسخ السريع ────────────────────────────────────────
function InfoField({
    label,
    value,
    mono,
    className = "",
}: {
    label: string;
    value?: string | null;
    mono?: boolean;
    className?: string;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!value) return;
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("فشل النسخ", err);
        }
    };

    return (
        <div className={`group/field relative ${className}`}>
            <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-1.5">
                {label}
            </p>
            <div className="flex items-center gap-2 min-w-0">
                <p
                    className={
                        "text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate " +
                        (mono ? "font-mono tracking-widest " : "") +
                        (value
                            ? ""
                            : "text-zinc-300 dark:text-zinc-600 font-normal")
                    }
                    dir={mono ? "ltr" : undefined}
                >
                    {value || "غير مُسجّل"}
                </p>
                {value && (
                    <button
                        onClick={handleCopy}
                        className="opacity-0 group-hover/field:opacity-100 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all duration-200 shrink-0"
                        title="نسخ هذا الحقل"
                    >
                        {copied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                            <Copy className="w-3.5 h-3.5" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── مكوّن صف صورة للعرض فقط ──────────────────────────────────────────────────
function ImageDisplay({
    label,
    path,
    icon: Icon,
}: {
    label: string;
    path?: string | null;
    icon: React.ElementType;
}) {
    const isPdf = path ? path.toLowerCase().endsWith(".pdf") : false;

    return (
        <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/60 flex items-center">
            <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/60 border-l border-zinc-100 dark:border-zinc-800">
                {path && !isPdf ? (
                    <img
                        src={`/storage/${path}`}
                        alt={label}
                        className="w-16 h-16 object-cover"
                    />
                ) : isPdf ? (
                    <FileText className="w-6 h-6 text-red-400" />
                ) : (
                    <Icon className="w-5 h-5 text-zinc-300 dark:text-zinc-600" />
                )}
            </div>
            <div className="flex-1 px-3 min-w-0 py-3">
                <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">
                    {label}
                </p>
                {path ? (
                    <a
                        href={`/storage/${path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                        عرض الملف ↗
                    </a>
                ) : (
                    <p className="text-xs font-bold text-zinc-300 dark:text-zinc-600">
                        لا يوجد ملف
                    </p>
                )}
            </div>
        </div>
    );
}

// ─── مكوّن قيمة سريعة في الشريط الجانبي (هاتف/واتساب) ─────────────────────────
function QuickContact({
    icon: Icon,
    label,
    value,
    href,
}: {
    icon: React.ElementType;
    label: string;
    value?: string | null;
    href?: string;
}) {
    if (!value) return null;
    return (
        <a
            href={href}
            target={href ? "_blank" : undefined}
            rel={href ? "noreferrer" : undefined}
            className="flex items-center gap-3 rounded-xl border border-zinc-100 dark:border-zinc-800 px-3.5 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
        >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    {label}
                </p>
                <p
                    className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate"
                    dir="ltr"
                >
                    {value}
                </p>
            </div>
        </a>
    );
}

// ─── الصفحة الرئيسية ──────────────────────────────────────────────────────────
export default function Show({
    customer,
    current_delegate_id,
    delegates,
}: ShowProps) {
    const [bulkCopied, setBulkCopied] = useState(false);

    const delegateName =
        delegates.find((d) => d.id === current_delegate_id)?.name || null;

    const genderLabel = customer.gender ? GENDER_LABEL[customer.gender] : null;
    const maritalLabel = customer.marital_status
        ? MARITAL_LABEL[customer.marital_status]
        : null;

    // دالة نسخ كل البيانات النصية للعميل دفعة واحدة بشكل منسق
    const handleBulkCopy = async () => {
        const textSummary = [
            `الاسم بالعربية: ${customer.name_ar}`,
            customer.name_en ? `الاسم بالإنجليزية: ${customer.name_en}` : null,
            genderLabel ? `الجنس: ${genderLabel}` : null,
            customer.birth_date
                ? `تاريخ الميلاد: ${toDisplay(customer.birth_date)}`
                : null,
            customer.nationality ? `الجنسية: ${customer.nationality}` : null,
            maritalLabel ? `الحالة الاجتماعية: ${maritalLabel}` : null,
            customer.phone ? `رقم الهاتف: ${customer.phone}` : null,
            customer.whatsapp ? `رقم الواتساب: ${customer.whatsapp}` : null,
            customer.governorate ? `المحافظة: ${customer.governorate}` : null,
            customer.address ? `العنوان: ${customer.address}` : null,
            delegateName ? `المندوب المسؤول: ${delegateName}` : null,
            customer.passport_number
                ? `رقم جواز السفر: ${customer.passport_number}`
                : null,
            customer.passport_issue_date
                ? `تاريخ إصدار الجواز: ${toDisplay(customer.passport_issue_date)}`
                : null,
            customer.passport_expiry_date
                ? `تاريخ انتهاء الجواز: ${toDisplay(customer.passport_expiry_date)}`
                : null,
            customer.passport_issue_place
                ? `مكان إصدار الجواز: ${customer.passport_issue_place}`
                : null,
            customer.national_id
                ? `الرقم القومي: ${customer.national_id}`
                : null,
            customer.mrz ? `MRZ: ${customer.mrz}` : null,
            customer.visa_number
                ? `رقم التأشيرة: ${customer.visa_number}`
                : null,
            customer.notes ? `ملاحظات: ${customer.notes}` : null,
        ]
            .filter(Boolean)
            .join("\n");

        try {
            await navigator.clipboard.writeText(textSummary);
            setBulkCopied(true);
            setTimeout(() => setBulkCopied(false), 2000);
        } catch (err) {
            console.error("فشل نسخ البيانات بالكامل", err);
        }
    };

    return (
        <>
            <Head title={`بيانات - ${customer.name_ar}`} />

            <div className="max-w-7xl mx-auto pb-16 px-4" dir="rtl">
                {/* ── الهيدر ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pt-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-[10px] font-black tracking-widest uppercase mb-2">
                            <span>لوحة التحكم</span>
                            <span>›</span>
                            <span className="text-emerald-600 dark:text-emerald-400">
                                ملف العميل
                            </span>
                        </div>
                        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                            {customer.name_ar}
                        </h1>
                        {customer.name_en && (
                            <p
                                className="text-xs text-zinc-400 dark:text-zinc-500 font-medium"
                                dir="ltr"
                            >
                                {customer.name_en}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center flex-wrap gap-2.5">
                        {/* زر نسخ كل البيانات المضاف حديثاً */}
                        <button
                            onClick={handleBulkCopy}
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all border ${
                                bulkCopied
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900"
                                    : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                            }`}
                        >
                            {bulkCopied ? (
                                <>
                                    <Check className="w-3.5 h-3.5" />
                                    تم النسخ بنجاح!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                    نسخ البيانات بالكامل
                                </>
                            )}
                        </button>
                        <Link
                            // @ts-ignore
                            href={route("customers.edit", customer.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors px-4 py-2.5 rounded-xl shadow-sm shadow-emerald-600/20"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                            تعديل البيانات
                        </Link>
                        <Link
                            // @ts-ignore
                            href={route("customers.index")}
                            className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-500 bg-white dark:bg-zinc-800/50"
                        >
                            العودة للقائمة
                        </Link>
                    </div>
                </div>

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
                                    <InfoField
                                        label="الاسم بالعربية"
                                        value={customer.name_ar}
                                    />
                                    <InfoField
                                        label="الاسم بالإنجليزية"
                                        value={customer.name_en}
                                        className="md:col-span-2"
                                    />
                                    <InfoField
                                        label="الجنس"
                                        value={genderLabel}
                                    />
                                    <InfoField
                                        label="تاريخ الميلاد"
                                        value={toDisplay(customer.birth_date)}
                                    />
                                    <InfoField
                                        label="الجنسية"
                                        value={customer.nationality}
                                    />
                                    <InfoField
                                        label="الحالة الاجتماعية"
                                        value={maritalLabel}
                                    />
                                </div>
                            </Section>
                        </div>

                        {/* الاتصال والعنوان */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-7 space-y-6">
                            <Section icon={MapPin} title="الاتصال ومقر السكن">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                    <InfoField
                                        label="رقم الهاتف"
                                        value={customer.phone}
                                        mono
                                    />
                                    <InfoField
                                        label="رقم الواتساب"
                                        value={customer.whatsapp}
                                        mono
                                    />
                                    <InfoField
                                        label="المحافظة"
                                        value={customer.governorate}
                                    />
                                    <InfoField
                                        label="المندوب المسؤول"
                                        value={delegateName}
                                    />
                                    <InfoField
                                        label="العنوان بالتفصيل"
                                        value={customer.address}
                                        className="md:col-span-2"
                                    />
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
                                    <InfoField
                                        label="رقم جواز السفر"
                                        value={customer.passport_number}
                                        mono
                                    />
                                    <InfoField
                                        label="تاريخ إصدار الجواز"
                                        value={toDisplay(
                                            customer.passport_issue_date,
                                        )}
                                    />
                                    <InfoField
                                        label="تاريخ انتهاء الجواز"
                                        value={toDisplay(
                                            customer.passport_expiry_date,
                                        )}
                                    />
                                    <InfoField
                                        label="مكان إصدار الجواز"
                                        value={customer.passport_issue_place}
                                    />
                                    <InfoField
                                        label="الرقم القومي / الهوية"
                                        value={customer.national_id}
                                        mono
                                    />
                                    <InfoField
                                        label="المنطقة المقروءة آلياً (MRZ)"
                                        value={customer.mrz}
                                        mono
                                        className="md:col-span-3"
                                    />
                                </div>
                            </Section>
                        </div>

                        {/* التأشيرة */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-7 space-y-6">
                            <Section icon={Plane} title="بيانات التأشيرة">
                                <div className="grid grid-cols-2 gap-5">
                                    <InfoField
                                        label="رقم التأشيرة (Visa Number)"
                                        value={customer.visa_number}
                                        mono
                                    />
                                </div>
                            </Section>
                        </div>

                        {/* ملاحظات */}
                        {customer.notes && (
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-7">
                                <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-2">
                                    ملاحظات إضافية بخصوص العميل
                                </p>
                                <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                    {customer.notes}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ◀ العمود الأيسر */}
                    <div className="w-80 shrink-0 space-y-6 sticky top-6">
                        {/* بطاقة تواصل سريع */}
                        {(customer.phone || customer.whatsapp) && (
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-6 space-y-2.5">
                                <h3 className="text-[10px] font-black tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-1">
                                    تواصل سريع
                                </h3>
                                <QuickContact
                                    icon={Phone}
                                    label="اتصال"
                                    value={customer.phone}
                                    href={
                                        customer.phone
                                            ? `tel:${customer.phone}`
                                            : undefined
                                    }
                                />
                                <QuickContact
                                    icon={MessageCircle}
                                    label="واتساب"
                                    value={customer.whatsapp}
                                    href={
                                        customer.whatsapp
                                            ? `https://wa.me/${customer.whatsapp.replace(/\D/g, "")}`
                                            : undefined
                                    }
                                />
                            </div>
                        )}

                        {/* بطاقة الصور */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                    <FileImage className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-xs font-black tracking-widest uppercase text-emerald-700 dark:text-emerald-400">
                                    الوثائق والمرفقات
                                </h3>
                            </div>
                            <div className="space-y-3">
                                <ImageDisplay
                                    label="الصورة الشخصية"
                                    path={customer.personal_image}
                                    icon={User}
                                />
                                <ImageDisplay
                                    label="صورة جواز السفر"
                                    path={customer.passport_image}
                                    icon={FileImage}
                                />
                                <ImageDisplay
                                    label="بطاقة الهوية الوطنية"
                                    path={customer.national_id_image}
                                    icon={CreditCard}
                                />
                                <ImageDisplay
                                    label="إثبات المهنة / العمل"
                                    path={customer.job_proof_image}
                                    icon={Briefcase}
                                />
                            </div>
                        </div>

                        {/* بطاقة الإجراءات */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-6 space-y-3.5">
                            <Link
                                // @ts-ignore
                                href={route("customers.edit", customer.id)}
                                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl font-black text-sm transition-all shadow-sm shadow-emerald-600/20"
                            >
                                <Pencil className="w-4 h-4" />
                                تعديل بيانات العميل
                            </Link>
                            <Link
                                // @ts-ignore
                                href={route("customers.index")}
                                className="w-full block text-center px-6 py-3.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-bold rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all text-sm"
                            >
                                العودة للقائمة
                            </Link>
                            {(customer.created_at || customer.updated_at) && (
                                <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 leading-relaxed pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
                                    {customer.created_at && (
                                        <span className="block">
                                            تاريخ الإضافة:{" "}
                                            {toDisplay(customer.created_at)}
                                        </span>
                                    )}
                                    {customer.updated_at && (
                                        <span className="block">
                                            آخر تحديث:{" "}
                                            {toDisplay(customer.updated_at)}
                                        </span>
                                    )}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = (page: React.ReactNode) => <AppLayout children={page} />;
