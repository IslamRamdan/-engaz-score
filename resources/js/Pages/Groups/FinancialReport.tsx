import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    BarChart3,
    ArrowRight,
    Users,
    Receipt,
    Wallet,
    Scale,
    CheckCircle2,
    Search,
    Inbox,
} from "lucide-react";

interface Customer {
    id: number;
    name_ar?: string;
    name_en?: string;
    total_dues?: number | string;
    total_debit?: number | string;
    total_credit?: number | string;
}

interface Treasury {
    id: number;
    name: string;
}

interface PaymentMethod {
    id: number;
    name: string;
}

interface Group {
    id: number;
    name: string;
    customers?: Customer[];
}

interface FinancialReportProps {
    group: Group;
    treasuries: Treasury[];
    paymentMethods: PaymentMethod[];
}

const card =
    "rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900";

const field =
    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500";

const label =
    "mb-1 block text-xs font-medium text-gray-600 dark:text-neutral-400";

const errorText = "mt-1 block text-xs text-red-500";

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

const fmt = (n: number | string) =>
    Number(n).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

/* ---------- الحالات ---------- */
type StatusKey = "paid" | "partial" | "unpaid" | "over" | "none";

const STATUS: Record<
    StatusKey,
    { label: string; badge: string; text: string; bar: string }
> = {
    paid: {
        label: "خالص",
        badge: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
        text: "text-emerald-600 dark:text-emerald-400",
        bar: "bg-emerald-500",
    },
    partial: {
        label: "مدفوع جزئي",
        badge: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
        text: "text-red-600 dark:text-red-400",
        bar: "bg-amber-500",
    },
    unpaid: {
        label: "لم يسدد",
        badge: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
        text: "text-red-600 dark:text-red-400",
        bar: "bg-red-500",
    },
    over: {
        label: "زيادة دفع",
        badge: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
        text: "text-blue-600 dark:text-blue-400",
        bar: "bg-blue-500",
    },
    none: {
        label: "لا استحقاقات",
        badge: "bg-gray-500/10 text-gray-500 dark:bg-neutral-500/20 dark:text-neutral-400",
        text: "text-gray-500 dark:text-neutral-400",
        bar: "bg-gray-400",
    },
};

function getStatus(totalDues: number, netPaid: number, remaining: number) {
    if (totalDues === 0 && netPaid === 0) return "none" as StatusKey;
    if (remaining < 0) return "over" as StatusKey;
    if (remaining === 0 && totalDues > 0) return "paid" as StatusKey;
    if (netPaid > 0) return "partial" as StatusKey;
    return "unpaid" as StatusKey;
}

/* ---------- كارت إحصائية ---------- */
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
    tone: "purple" | "emerald" | "red" | "blue";
    hint?: string;
}) {
    const iconTone = {
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
        emerald:
            "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
        red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    };
    const valueTone = {
        purple: "text-purple-600 dark:text-purple-400",
        emerald: "text-emerald-600 dark:text-emerald-400",
        red: "text-red-600 dark:text-red-400",
        blue: "text-blue-600 dark:text-blue-400",
    };
    return (
        <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">
                    {label}
                </span>
                <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconTone[tone]}`}
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

/* ---------- سليكت العملاء (بحث AJAX) ---------- */
function CustomerCombobox({
    value,
    onChange,
    hasError,
}: {
    value: string;
    onChange: (id: string) => void;
    hasError?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Customer[]>([]);
    const [selected, setSelected] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const [active, setActive] = useState(0);
    const wrapRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (!value) setSelected(null);
    }, [value]);

    useEffect(() => {
        if (!open) return;

        const controller = new AbortController();
        setLoading(true);
        setFailed(false);

        const timer = setTimeout(
            async () => {
                try {
                    const res = await fetch(
                        `/customers/search?q=${encodeURIComponent(query.trim())}`,
                        {
                            signal: controller.signal,
                            headers: {
                                Accept: "application/json",
                                "X-Requested-With": "XMLHttpRequest",
                            },
                        },
                    );
                    if (!res.ok) throw new Error("request failed");
                    const json = await res.json();
                    setResults(Array.isArray(json) ? json : (json.data ?? []));
                    setActive(0);
                } catch (err: any) {
                    if (err?.name === "AbortError") return;
                    setFailed(true);
                    setResults([]);
                } finally {
                    if (!controller.signal.aborted) setLoading(false);
                }
            },
            query ? 250 : 0,
        );

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query, open]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                wrapRef.current &&
                !wrapRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (!open) return;
        listRef.current
            ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
            ?.scrollIntoView({ block: "nearest" });
    }, [active, open]);

    const choose = (c: Customer) => {
        setSelected(c);
        onChange(String(c.id));
        setQuery("");
        setOpen(false);
    };

    const clear = () => {
        setSelected(null);
        onChange("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActive((i) => Math.min(i + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            if (open && results[active]) {
                e.preventDefault();
                choose(results[active]);
            }
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    };

    return (
        <div ref={wrapRef} className="relative">
            <div className="relative">
                <svg
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                    />
                </svg>
                <input
                    type="text"
                    role="combobox"
                    aria-expanded={open}
                    autoComplete="off"
                    value={
                        open
                            ? query
                            : selected?.name_ar || selected?.name_en || ""
                    }
                    placeholder="ابحث عن عميل..."
                    onFocus={() => {
                        setOpen(true);
                        setQuery("");
                    }}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    className={`${field} pr-9 ${selected && !open ? "pl-9" : ""} ${
                        hasError ? "border-red-500 focus:ring-red-500/60" : ""
                    }`}
                />
                {open && loading && (
                    <span className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                )}
                {selected && !open && (
                    <button
                        type="button"
                        onClick={clear}
                        aria-label="مسح العميل"
                        className="absolute left-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
                    >
                        <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>

            {open && (
                <ul
                    ref={listRef}
                    role="listbox"
                    className={`absolute z-30 mt-1.5 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 bg-white p-1 shadow-lg transition-opacity dark:border-neutral-700 dark:bg-neutral-800 ${
                        loading && results.length > 0 ? "opacity-60" : ""
                    }`}
                >
                    {results.length === 0 ? (
                        <li className="px-3 py-3 text-center text-xs text-gray-400 dark:text-neutral-500">
                            {loading
                                ? "جاري البحث..."
                                : failed
                                  ? "حصلت مشكلة في تحميل العملاء، جرّب تاني"
                                  : "مفيش عميل بالاسم ده"}
                        </li>
                    ) : (
                        results.map((c, i) => (
                            <li
                                key={c.id}
                                data-index={i}
                                role="option"
                                aria-selected={String(c.id) === value}
                                onMouseEnter={() => setActive(i)}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    choose(c);
                                }}
                                className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                                    i === active
                                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                        : "text-gray-800 dark:text-neutral-200"
                                }`}
                            >
                                <span>{c.name_ar || c.name_en}</span>
                                {String(c.id) === value && (
                                    <svg
                                        className="h-4 w-4 text-emerald-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.5 12.75l6 6 9-13.5"
                                        />
                                    </svg>
                                )}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}

export default function FinancialReport({
    group,
    treasuries = [],
    paymentMethods = [],
}: FinancialReportProps) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        setError,
        clearErrors,
        transform,
    } = useForm({
        customer_id: "",
        treasury_id: "",
        payment_method_id: "",
        type: "debit" as "debit" | "credit",
        amount: "",
        description: "",
    });

    // بيتحول للشكل اللي الـ backend مستنيه (debit / credit)
    transform((d) => ({
        customer_id: d.customer_id,
        treasury_id: d.treasury_id,
        payment_method_id: d.payment_method_id,
        description: d.description,
        debit: d.type === "debit" ? d.amount : "0",
        credit: d.type === "credit" ? d.amount : "0",
    }));

    const { flash } = usePage<any>().props;

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | StatusKey>("all");

    /* ---------- حسابات الجروب ---------- */
    const report = useMemo(() => {
        const rows = (group.customers || []).map((c) => {
            const totalDues = round2(Number(c.total_dues || 0));
            const totalDebit = round2(Number(c.total_debit || 0)); // اللي دفعه العميل
            const totalCredit = round2(Number(c.total_credit || 0)); // اللي سحبه العميل
            const netPaid = round2(totalDebit - totalCredit);
            const remaining = round2(totalDues - netPaid);
            const status = getStatus(totalDues, netPaid, remaining);
            const percent =
                totalDues > 0
                    ? Math.max(0, Math.min(100, (netPaid / totalDues) * 100))
                    : 0;
            return {
                customer: c,
                totalDues,
                netPaid,
                remaining,
                status,
                percent,
            };
        });

        // الأكتر مديونية الأول
        rows.sort((a, b) => b.remaining - a.remaining);

        const sum = (fn: (r: (typeof rows)[number]) => number) =>
            round2(rows.reduce((s, r) => s + fn(r), 0));

        const counts: Record<StatusKey, number> = {
            paid: 0,
            partial: 0,
            unpaid: 0,
            over: 0,
            none: 0,
        };
        rows.forEach((r) => counts[r.status]++);

        return {
            rows,
            counts,
            totalDues: sum((r) => r.totalDues),
            totalNetPaid: sum((r) => r.netPaid),
            // المتبقي الفعلي = مديونيات العملاء بس (من غير ما زيادة دفع عميل تخصم من عميل تاني)
            totalRemaining: sum((r) => Math.max(r.remaining, 0)),
            totalOverpaid: sum((r) => Math.max(-r.remaining, 0)),
        };
    }, [group.customers]);

    const visibleRows = useMemo(() => {
        const q = search.trim().toLowerCase();
        return report.rows.filter((r) => {
            if (filter !== "all" && r.status !== filter) return false;
            if (!q) return true;
            const name =
                `${r.customer.name_ar || ""} ${r.customer.name_en || ""}`.toLowerCase();
            return name.includes(q);
        });
    }, [report.rows, search, filter]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        if (!(Number(data.amount) > 0)) {
            setError("amount", "اكتب مبلغ أكبر من صفر");
            return;
        }

        post("/entries", {
            preserveScroll: true,
            // نوع القيد بيفضل زي ما هو عشان تسجّل كذا قيد ورا بعض
            onSuccess: () =>
                reset(
                    "customer_id",
                    "treasury_id",
                    "payment_method_id",
                    "amount",
                    "description",
                ),
        });
    };

    const amountError =
        errors.amount || (errors as any).debit || (errors as any).credit;
    const isDebit = data.type === "debit";

    const filters: { key: "all" | StatusKey; label: string; count: number }[] =
        [
            { key: "all", label: "الكل", count: report.rows.length },
            { key: "unpaid", label: "لم يسدد", count: report.counts.unpaid },
            { key: "partial", label: "جزئي", count: report.counts.partial },
            { key: "paid", label: "خالص", count: report.counts.paid },
            { key: "over", label: "زيادة دفع", count: report.counts.over },
        ];

    return (
        <AppLayout title={`التقرير المالي للجروب: ${group.name}`}>
            <div className="px-4 py-6" dir="rtl">
                <div className="mx-auto max-w-6xl space-y-5">
                    {/* ===== العنوان + فورم إضافة قيد ===== */}
                    <div className={`${card} p-4 sm:p-5`}>
                        <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                    <BarChart3 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h1 className="text-base font-bold text-gray-900 dark:text-white">
                                        التقرير المالي للجروب:{" "}
                                        <span className="text-emerald-600 dark:text-emerald-400">
                                            {group.name}
                                        </span>
                                    </h1>
                                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                                        سجّل قيد جديد وتابع الاستحقاقات والمبالغ
                                        المدفوعة لعملاء المجموعة
                                    </p>
                                </div>
                            </div>

                            <Link
                                href={route("groups.index")}
                                className="flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 sm:self-auto"
                            >
                                <ArrowRight className="h-4 w-4" />
                                الرجوع للمجموعات
                            </Link>
                        </div>

                        {flash?.success && (
                            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-300">
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                                {flash.success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* نوع القيد فوق */}
                            <div className="inline-grid w-full max-w-xs grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1 dark:bg-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setData("type", "debit")}
                                    aria-pressed={isDebit}
                                    className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                                        isDebit
                                            ? "bg-emerald-600 text-white shadow-sm"
                                            : "text-gray-600 hover:bg-white dark:text-neutral-300 dark:hover:bg-neutral-700"
                                    }`}
                                >
                                    مدين
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData("type", "credit")}
                                    aria-pressed={!isDebit}
                                    className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                                        !isDebit
                                            ? "bg-red-600 text-white shadow-sm"
                                            : "text-gray-600 hover:bg-white dark:text-neutral-300 dark:hover:bg-neutral-700"
                                    }`}
                                >
                                    دائن
                                </button>
                            </div>

                            {/* باقي الحقول في صف واحد */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.4fr_auto] lg:items-start">
                                <div>
                                    <label className={label}>العميل</label>
                                    <CustomerCombobox
                                        value={data.customer_id}
                                        onChange={(id) =>
                                            setData("customer_id", id)
                                        }
                                        hasError={!!errors.customer_id}
                                    />
                                    {errors.customer_id && (
                                        <span className={errorText}>
                                            {errors.customer_id}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className={label}>الخزنة</label>
                                    <select
                                        value={data.treasury_id}
                                        onChange={(e) =>
                                            setData(
                                                "treasury_id",
                                                e.target.value,
                                            )
                                        }
                                        className={field}
                                    >
                                        <option value="">اختر الخزنة</option>
                                        {treasuries.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.treasury_id && (
                                        <span className={errorText}>
                                            {errors.treasury_id}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className={label}>
                                        طريقة الاستلام
                                    </label>
                                    <select
                                        value={data.payment_method_id}
                                        onChange={(e) =>
                                            setData(
                                                "payment_method_id",
                                                e.target.value,
                                            )
                                        }
                                        className={field}
                                    >
                                        <option value="">اختر الطريقة</option>
                                        {paymentMethods.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.payment_method_id && (
                                        <span className={errorText}>
                                            {errors.payment_method_id}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className={label}>المبلغ</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        inputMode="decimal"
                                        value={data.amount}
                                        placeholder="0.00"
                                        onChange={(e) =>
                                            setData("amount", e.target.value)
                                        }
                                        className={`${field} tabular-nums ${
                                            amountError
                                                ? "border-red-500 focus:ring-red-500/60"
                                                : ""
                                        }`}
                                    />
                                    {amountError && (
                                        <span className={errorText}>
                                            {amountError}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className={label}>
                                        الوصف / البيان
                                    </label>
                                    <input
                                        type="text"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="وصف مختصر للقيد..."
                                        className={field}
                                    />
                                    {errors.description && (
                                        <span className={errorText}>
                                            {errors.description}
                                        </span>
                                    )}
                                </div>

                                <div className="sm:col-span-2 lg:col-span-1 lg:pt-[22px]">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`w-full whitespace-nowrap rounded-xl px-6 py-2 text-sm font-medium text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
                                            isDebit
                                                ? "bg-emerald-600 hover:bg-emerald-500"
                                                : "bg-red-600 hover:bg-red-500"
                                        }`}
                                    >
                                        {processing
                                            ? "جاري الحفظ..."
                                            : "حفظ القيد"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* ===== إحصائيات الجروب ===== */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            label="إجمالي الاستحقاقات"
                            value={fmt(report.totalDues)}
                            icon={Receipt}
                            tone="purple"
                            hint={`${report.rows.length} عميل`}
                        />
                        <StatCard
                            label="صافي المدفوع"
                            value={fmt(report.totalNetPaid)}
                            icon={Wallet}
                            tone="emerald"
                            hint="مدين - دائن"
                        />
                        <StatCard
                            label="إجمالي المتبقي"
                            value={fmt(report.totalRemaining)}
                            icon={Scale}
                            tone="red"
                            hint={
                                report.totalOverpaid > 0
                                    ? `+ ${fmt(report.totalOverpaid)} زيادة دفع لبعض العملاء`
                                    : "على العملاء"
                            }
                        />
                        <StatCard
                            label="عملاء خالصين"
                            value={`${report.counts.paid} / ${report.rows.length}`}
                            icon={CheckCircle2}
                            tone="blue"
                            hint={`${report.counts.unpaid + report.counts.partial} عميل عليهم مبالغ`}
                        />
                    </div>

                    {/* ===== جدول العملاء ===== */}
                    <div className={`${card} overflow-hidden`}>
                        <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 dark:border-neutral-800 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                    تفاصيل حسابات العملاء
                                </h3>
                                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                    {report.rows.length} عميل
                                </span>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="بحث بالاسم..."
                                        className={`${field} pr-9 sm:w-52`}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {filters.map((f) => (
                                        <button
                                            key={f.key}
                                            type="button"
                                            onClick={() => setFilter(f.key)}
                                            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                                                filter === f.key
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                            }`}
                                        >
                                            {f.label}
                                            <span className="mr-1 tabular-nums opacity-70">
                                                {f.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {report.rows.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-14 text-gray-400 dark:text-neutral-500">
                                <Users className="mb-3 h-10 w-10 opacity-60" />
                                <p className="text-sm">
                                    لا يوجد عملاء في هذه المجموعة حالياً.
                                </p>
                            </div>
                        ) : visibleRows.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-2 py-12 text-gray-400 dark:text-neutral-500">
                                <Inbox className="h-8 w-8" />
                                <p className="text-sm">
                                    مفيش عملاء مطابقين للبحث أو الفلتر.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-right text-sm">
                                    <thead className="bg-gray-50 text-xs text-gray-500 dark:bg-black/30 dark:text-neutral-400">
                                        <tr>
                                            <th className="px-5 py-3 font-medium">
                                                اسم العميل
                                            </th>
                                            <th className="px-3 py-3 font-medium">
                                                إجمالي الاستحقاق
                                            </th>
                                            <th className="px-3 py-3 font-medium">
                                                صافي المدفوع (مدين - دائن)
                                            </th>
                                            <th className="px-3 py-3 font-medium">
                                                المتبقي
                                            </th>
                                            <th className="px-3 py-3 font-medium">
                                                نسبة السداد
                                            </th>
                                            <th className="px-3 py-3 text-center font-medium">
                                                الحالة
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                                        {visibleRows.map((r) => {
                                            const s = STATUS[r.status];
                                            return (
                                                <tr
                                                    key={r.customer.id}
                                                    className="transition hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                                                >
                                                    <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-gray-100">
                                                        <Link
                                                            href={route(
                                                                "customers.statement",
                                                                r.customer.id,
                                                            )}
                                                            className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                                                        >
                                                            {r.customer
                                                                .name_ar ||
                                                                r.customer
                                                                    .name_en ||
                                                                "عميل بدون اسم"}
                                                        </Link>
                                                    </td>
                                                    <td className="px-3 py-3.5 font-semibold tabular-nums text-gray-700 dark:text-neutral-300">
                                                        {fmt(r.totalDues)}
                                                    </td>
                                                    <td className="px-3 py-3.5 font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                                                        {fmt(r.netPaid)}
                                                    </td>
                                                    <td
                                                        className={`px-3 py-3.5 font-semibold tabular-nums ${s.text}`}
                                                    >
                                                        {fmt(
                                                            Math.abs(
                                                                r.remaining,
                                                            ),
                                                        )}
                                                        {r.status ===
                                                            "over" && (
                                                            <span className="mr-1.5 text-[10px] font-medium">
                                                                رصيد للعميل
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="min-w-[130px] px-3 py-3.5">
                                                        {r.totalDues > 0 ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800">
                                                                    <div
                                                                        className={`h-full rounded-full transition-all ${s.bar}`}
                                                                        style={{
                                                                            width: `${r.percent}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span className="w-10 text-[11px] tabular-nums text-gray-500 dark:text-neutral-400">
                                                                    {r.percent.toFixed(
                                                                        0,
                                                                    )}
                                                                    %
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 dark:text-neutral-500">
                                                                —
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-3.5 text-center">
                                                        <span
                                                            className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${s.badge}`}
                                                        >
                                                            {s.label}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot className="border-t-2 border-gray-200 bg-gray-50 dark:border-neutral-700 dark:bg-black/30">
                                        <tr>
                                            <td className="px-5 py-3 text-xs font-bold text-gray-700 dark:text-neutral-200">
                                                الإجمالي
                                                {(search ||
                                                    filter !== "all") && (
                                                    <span className="mr-1 font-normal text-gray-400">
                                                        (كل عملاء الجروب)
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-3 font-black tabular-nums text-gray-800 dark:text-neutral-100">
                                                {fmt(report.totalDues)}
                                            </td>
                                            <td className="px-3 py-3 font-black tabular-nums text-emerald-700 dark:text-emerald-300">
                                                {fmt(report.totalNetPaid)}
                                            </td>
                                            <td className="px-3 py-3 font-black tabular-nums text-red-700 dark:text-red-300">
                                                {fmt(report.totalRemaining)}
                                            </td>
                                            <td colSpan={2} />
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
