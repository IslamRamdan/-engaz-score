import React, { useMemo } from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { ReceiptButton } from "@/Components/ReceiptUpload";
import {
    ArrowRight,
    Wallet,
    Phone,
    MapPin,
    Receipt,
    Printer,
    Scale,
    CheckCircle2,
    Inbox,
} from "lucide-react";

interface Treasury {
    id: number;
    name: string;
}

interface PaymentMethod {
    id: number;
    name: string;
}

interface Entry {
    id: number;
    treasury?: Treasury;
    payment_method?: PaymentMethod;
    debit: number | string;
    credit: number | string;
    description?: string;
    receipt?: string | null;
    receipt_url?: string | null;
    created_at: string;
}

interface Due {
    id: number;
    amount: number | string;
    name?: string;
    created_at: string;
}

interface Customer {
    id: number;
    name_ar?: string;
    name_en?: string;
    phone?: string;
    address?: string;
    personal_image?: string;
    entries?: Entry[];
    dues?: Due[];
}

interface StatementProps {
    customer: Customer;
}

const card =
    "rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900";

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

const fmt = (n: number | string) =>
    Number(n).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

const byDateAsc = <T extends { created_at: string; id: number }>(a: T, b: T) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime() ||
    a.id - b.id;

// يبني رابط الإيصال: receipt_url لو راجع من الباك إند، وإلا من مسار الملف المحفوظ
const receiptSrc = (entry: Entry): string | null =>
    entry.receipt_url ||
    (entry.receipt ? `/storage/${entry.receipt.replace(/^\/+/, "")}` : null);

function StatCard({
    label,
    value,
    icon: Icon,
    tone,
    hint,
}: {
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    tone: "purple" | "emerald" | "blue";
    hint?: string;
}) {
    const tones = {
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
        emerald:
            "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    };
    const valueTone = {
        purple: "text-purple-600 dark:text-purple-400",
        emerald: "text-emerald-600 dark:text-emerald-400",
        blue: "text-blue-600 dark:text-blue-400",
    };
    return (
        <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">
                    {label}
                </span>
                <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${tones[tone]}`}
                >
                    <Icon className="h-4 w-4" />
                </span>
            </div>
            <div
                className={`text-xl font-bold tabular-nums ${valueTone[tone]}`}
            >
                {value}
            </div>
            {hint && (
                <div className="mt-1 text-[11px] text-gray-400 dark:text-neutral-500">
                    {hint}
                </div>
            )}
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-gray-400 dark:text-neutral-500">
            <Inbox className="h-8 w-8" />
            <p className="text-sm">{text}</p>
        </div>
    );
}

export default function CustomerStatement({ customer }: StatementProps) {
    const stats = useMemo(() => {
        const dues = [...(customer.dues || [])].sort(byDateAsc);
        const entries = [...(customer.entries || [])].sort(byDateAsc);

        // إجمالي الاستحقاقات على العميل
        const totalDues = round2(
            dues.reduce((s, d) => s + Number(d.amount || 0), 0),
        );

        // المدين = اللي العميل دفعه لينا | الدائن = اللي العميل سحبه
        const totalDebit = round2(
            entries.reduce((s, e) => s + Number(e.debit || 0), 0),
        );
        const totalCredit = round2(
            entries.reduce((s, e) => s + Number(e.credit || 0), 0),
        );

        // صافي المدفوع = المدين - الدائن
        const netPaid = round2(totalDebit - totalCredit);

        // المتبقي = الاستحقاقات - صافي المدفوع
        const remaining = round2(totalDues - netPaid);

        // نسبة السداد
        const paidPercent =
            totalDues > 0
                ? Math.max(0, Math.min(100, (netPaid / totalDues) * 100))
                : 0;

        // الرصيد المتبقي بعد كل حركة (بيبدأ من إجمالي الاستحقاقات)
        let running = totalDues;
        const entriesWithBalance = entries.map((e) => {
            running = round2(
                running - Number(e.debit || 0) + Number(e.credit || 0),
            );
            return { ...e, balance: running };
        });

        return {
            dues,
            entries: entriesWithBalance,
            totalDues,
            totalDebit,
            totalCredit,
            netPaid,
            remaining,
            paidPercent,
        };
    }, [customer.dues, customer.entries]);

    const { remaining } = stats;
    const status =
        remaining > 0
            ? {
                  label: "متبقي على العميل",
                  box: "border-red-100 bg-red-50/60 dark:border-red-900/30 dark:bg-red-950/20",
                  text: "text-red-600 dark:text-red-400",
                  Icon: Scale,
              }
            : remaining < 0
              ? {
                    label: "زيادة دفع (رصيد للعميل)",
                    box: "border-blue-100 bg-blue-50/60 dark:border-blue-900/30 dark:bg-blue-950/20",
                    text: "text-blue-600 dark:text-blue-400",
                    Icon: Scale,
                }
              : {
                    label: "مسدد بالكامل",
                    box: "border-emerald-100 bg-emerald-50/60 dark:border-emerald-900/30 dark:bg-emerald-950/20",
                    text: "text-emerald-600 dark:text-emerald-400",
                    Icon: CheckCircle2,
                };

    const customerName =
        customer.name_ar || customer.name_en || "عميل بدون اسم";

    return (
        <AppLayout title={`كشف حساب: ${customerName}`}>
            <div className="px-4 py-6" dir="rtl">
                <div className="mx-auto max-w-6xl space-y-5">
                    {/* ===== معلومات العميل + الإجماليات ===== */}
                    <div className={`${card} p-5`}>
                        <div className="mb-5 flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 dark:border-neutral-800 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-4">
                                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-inner dark:border-neutral-700 dark:bg-neutral-800">
                                    {customer.personal_image ? (
                                        <img
                                            src={`/storage/${customer.personal_image}`}
                                            alt={customerName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-400 dark:text-neutral-500">
                                            صورة
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className="mb-0.5 text-[11px] font-medium text-gray-400 dark:text-neutral-500">
                                        كشف حساب عميل
                                    </p>
                                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {customerName}
                                    </h1>
                                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-neutral-400">
                                        {customer.phone && (
                                            <span
                                                className="flex items-center gap-1"
                                                dir="ltr"
                                            >
                                                <Phone className="h-3.5 w-3.5" />
                                                {customer.phone}
                                            </span>
                                        )}
                                        {customer.address && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {customer.address}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-start print:hidden sm:self-auto">
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                                >
                                    <Printer className="h-4 w-4" />
                                    طباعة
                                </button>
                                <Link
                                    href={route("groups.index")}
                                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                                >
                                    <ArrowRight className="h-4 w-4" />
                                    رجوع
                                </Link>
                            </div>
                        </div>

                        {/* مربعات الإجماليات */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <StatCard
                                label="إجمالي الاستحقاقات"
                                value={fmt(stats.totalDues)}
                                icon={Receipt}
                                tone="purple"
                                hint={`${stats.dues.length} استحقاق`}
                            />
                            <StatCard
                                label="الرصيد المدفوع"
                                value={fmt(stats.netPaid)}
                                icon={Wallet}
                                tone="emerald"
                                hint="صافي اللي دفعه العميل"
                            />
                            <div
                                className={`rounded-xl border p-4 ${status.box}`}
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <span
                                        className={`text-xs font-bold ${status.text}`}
                                    >
                                        {status.label}
                                    </span>
                                    <status.Icon
                                        className={`h-4 w-4 ${status.text}`}
                                    />
                                </div>
                                <div
                                    className={`text-xl font-black tabular-nums ${status.text}`}
                                >
                                    {fmt(Math.abs(remaining))}
                                </div>
                            </div>
                        </div>

                        {/* شريط نسبة السداد */}
                        {stats.totalDues > 0 && (
                            <div className="mt-5">
                                <div className="mb-1.5 flex items-center justify-between text-xs">
                                    <span className="font-medium text-gray-500 dark:text-neutral-400">
                                        نسبة السداد
                                    </span>
                                    <span className="font-bold tabular-nums text-gray-700 dark:text-neutral-200">
                                        {stats.paidPercent.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800">
                                    <div
                                        className="h-full rounded-full bg-emerald-500 transition-all"
                                        style={{
                                            width: `${stats.paidPercent}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ===== جدول الاستحقاقات ===== */}
                    <div className={`${card} overflow-hidden`}>
                        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-neutral-800">
                            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                                <Receipt className="h-5 w-5 text-purple-500" />
                                الاستحقاقات المالية للعميل
                            </h3>
                            <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                                {stats.dues.length} استحقاق
                            </span>
                        </div>

                        {stats.dues.length === 0 ? (
                            <EmptyState text="لا توجد استحقاقات مسجلة لهذا العميل." />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-right text-sm">
                                    <thead className="bg-gray-50 text-xs text-gray-500 dark:bg-black/30 dark:text-neutral-400">
                                        <tr>
                                            <th className="px-5 py-3 font-medium">
                                                التاريخ
                                            </th>
                                            <th className="px-3 py-3 font-medium">
                                                المبلغ المستحق
                                            </th>
                                            <th className="px-5 py-3 font-medium">
                                                البيان / الوصف
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                                        {stats.dues.map((due) => {
                                            const amount = Number(
                                                due.amount || 0,
                                            );
                                            const isNegative = amount < 0;

                                            return (
                                                <tr
                                                    key={due.id}
                                                    className="transition hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                                                >
                                                    <td className="whitespace-nowrap px-5 py-3.5 text-xs text-gray-500 dark:text-neutral-400">
                                                        {fmtDate(
                                                            due.created_at,
                                                        )}
                                                    </td>
                                                    <td
                                                        className={`px-3 py-3.5 font-bold tabular-nums ${
                                                            isNegative
                                                                ? "text-red-600 dark:text-red-400"
                                                                : "text-purple-600 dark:text-purple-400"
                                                        }`}
                                                    >
                                                        {fmt(due.amount)}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-xs text-gray-600 dark:text-neutral-300">
                                                        {due.name || "—"}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot className="border-t-2 border-gray-200 bg-gray-50 dark:border-neutral-700 dark:bg-black/30">
                                        <tr>
                                            <td className="px-5 py-3 text-xs font-bold text-gray-700 dark:text-neutral-200">
                                                الإجمالي
                                            </td>
                                            <td
                                                className={`px-3 py-3 font-black tabular-nums ${
                                                    Number(stats.totalDues) < 0
                                                        ? "text-red-600 dark:text-red-400"
                                                        : "text-purple-700 dark:text-purple-300"
                                                }`}
                                            >
                                                {fmt(stats.totalDues)}
                                            </td>
                                            <td />
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* ===== جدول الحركات المالية ===== */}
                    <div className={`${card} overflow-hidden`}>
                        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-neutral-800">
                            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                                <Wallet className="h-5 w-5 text-emerald-500" />
                                سجل القيود والحركات المالية (دفع / سحب)
                            </h3>
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                {stats.entries.length} حركة
                            </span>
                        </div>

                        {stats.entries.length === 0 ? (
                            <EmptyState text="لا توجد حركات مالية مسجلة لهذا العميل حتى الآن." />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-right text-sm">
                                    <thead className="bg-gray-50 text-xs text-gray-500 dark:bg-black/30 dark:text-neutral-400">
                                        <tr>
                                            <th className="px-5 py-3 font-medium">
                                                التاريخ
                                            </th>
                                            <th className="px-3 py-3 font-medium">
                                                الخزنة
                                            </th>
                                            <th className="px-3 py-3 font-medium">
                                                طريقة الدفع
                                            </th>
                                            <th className="px-3 py-3 font-medium">
                                                مدين (دفع العميل)
                                            </th>
                                            <th className="px-3 py-3 font-medium">
                                                دائن (سحب العميل)
                                            </th>
                                            <th className="px-3 py-3 font-medium">
                                                الرصيد المتبقي
                                            </th>
                                            <th className="px-5 py-3 font-medium">
                                                الوصف / البيان
                                            </th>
                                            <th className="px-3 py-3 font-medium print:hidden">
                                                الإيصال
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                                        {stats.entries.map((entry) => (
                                            <tr
                                                key={entry.id}
                                                className="transition hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                                            >
                                                <td className="whitespace-nowrap px-5 py-3.5 text-xs text-gray-500 dark:text-neutral-400">
                                                    {fmtDate(entry.created_at)}
                                                </td>
                                                <td className="px-3 py-3.5 font-medium text-gray-900 dark:text-gray-100">
                                                    {entry.treasury?.name ||
                                                        "—"}
                                                </td>
                                                <td className="px-3 py-3.5">
                                                    <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700 dark:bg-neutral-800 dark:text-neutral-300">
                                                        {entry.payment_method
                                                            ?.name || "—"}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3.5 font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                                                    {Number(entry.debit) > 0
                                                        ? fmt(entry.debit)
                                                        : "—"}
                                                </td>
                                                <td className="px-3 py-3.5 font-semibold tabular-nums text-blue-600 dark:text-blue-400">
                                                    {Number(entry.credit) > 0
                                                        ? fmt(entry.credit)
                                                        : "—"}
                                                </td>
                                                <td
                                                    className={`px-3 py-3.5 font-bold tabular-nums ${
                                                        entry.balance > 0
                                                            ? "text-red-600 dark:text-red-400"
                                                            : entry.balance < 0
                                                              ? "text-blue-600 dark:text-blue-400"
                                                              : "text-emerald-600 dark:text-emerald-400"
                                                    }`}
                                                >
                                                    {fmt(entry.balance)}
                                                </td>
                                                <td className="px-5 py-3.5 text-xs text-gray-600 dark:text-neutral-300">
                                                    {entry.description || "—"}
                                                </td>
                                                <td className="px-3 py-3.5 print:hidden">
                                                    <ReceiptButton
                                                        src={receiptSrc(entry)}
                                                        title={`إيصال ${customerName}`}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="border-t-2 border-gray-200 bg-gray-50 dark:border-neutral-700 dark:bg-black/30">
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-5 py-3 text-xs font-bold text-gray-700 dark:text-neutral-200"
                                            >
                                                الإجمالي
                                            </td>
                                            <td className="px-3 py-3 font-black tabular-nums text-emerald-700 dark:text-emerald-300">
                                                {fmt(stats.totalDebit)}
                                            </td>
                                            <td className="px-3 py-3 font-black tabular-nums text-blue-700 dark:text-blue-300">
                                                {fmt(stats.totalCredit)}
                                            </td>
                                            <td
                                                className={`px-3 py-3 font-black tabular-nums ${status.text}`}
                                            >
                                                {fmt(remaining)}
                                            </td>
                                            <td />
                                            <td className="print:hidden" />
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
