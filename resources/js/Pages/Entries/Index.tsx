import React, { useEffect, useRef, useState } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

interface Customer {
    id: number;
    name_ar: string;
}

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
    customer: Customer;
    treasury: Treasury;
    payment_method: PaymentMethod;
    debit: number;
    credit: number;
    description: string;
}

interface Props {
    entries: Entry[];
    treasuries: Treasury[];
    paymentMethods: PaymentMethod[];
    [key: string]: any;
}

const card =
    "rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900";

const field =
    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500";

const label =
    "mb-1 block text-xs font-medium text-gray-600 dark:text-neutral-400";

const errorText = "mt-1 block text-xs text-red-500";

const fmt = (n: number | string) =>
    Number(n).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

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

    // لما الفورم يتعمله reset نمسح العميل المختار
    useEffect(() => {
        if (!value) setSelected(null);
    }, [value]);

    // جلب النتائج من السيرفر مع debounce وإلغاء الطلب القديم
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

    // قفل القايمة لما تضغط بره
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

    // خلي العنصر النشط ظاهر وانت بتنزل بالأسهم
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
                    value={open ? query : (selected?.name_ar ?? "")}
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
                                <span>{c.name_ar}</span>
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

export default function Index({ entries, treasuries, paymentMethods }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        customer_id: "",
        treasury_id: "",
        payment_method_id: "",
        debit: "0",
        credit: "0",
        description: "",
    });

    const { flash } = usePage<any>().props;

    const totalDebit = entries.reduce((s, e) => s + Number(e.debit || 0), 0);
    const totalCredit = entries.reduce((s, e) => s + Number(e.credit || 0), 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/entries", {
            preserveScroll: true,
            onSuccess: () =>
                reset(
                    "customer_id",
                    "treasury_id",
                    "payment_method_id",
                    "debit",
                    "credit",
                    "description",
                ),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm("هل أنت متأكد من حذف هذا القيد؟")) {
            router.delete(`/entries/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout title="إدارة القيود المحاسبية">
            <div className="px-4 py-6" dir="rtl">
                <div className="mx-auto max-w-6xl space-y-5">
                    {/* ===== الجزء العلوي: العنوان + الفورم في كارد واحد صغير ===== */}
                    <div className={`${card} p-4 sm:p-5`}>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.8}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-base font-bold text-gray-900 dark:text-white">
                                    القيود المحاسبية
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-neutral-400">
                                    سجّل قيد جديد وتابع القيود المرتبطة بالعملاء
                                    والخزائن
                                </p>
                            </div>
                        </div>

                        {flash?.success && (
                            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-300">
                                <svg
                                    className="h-4 w-4 shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.5 12.75l6 6 9-13.5"
                                    />
                                </svg>
                                {flash.success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
                                    <label className={label}>مدين</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.debit}
                                        onChange={(e) =>
                                            setData("debit", e.target.value)
                                        }
                                        className={`${field} tabular-nums`}
                                    />
                                    {errors.debit && (
                                        <span className={errorText}>
                                            {errors.debit}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className={label}>دائن</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.credit}
                                        onChange={(e) =>
                                            setData("credit", e.target.value)
                                        }
                                        className={`${field} tabular-nums`}
                                    />
                                    {errors.credit && (
                                        <span className={errorText}>
                                            {errors.credit}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                <div className="flex-1">
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

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-emerald-600 px-8 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? "جاري الحفظ..." : "حفظ القيد"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ===== سجل القيود ===== */}
                    <div className={`${card} overflow-hidden`}>
                        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-neutral-800">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                سجل القيود
                            </h3>
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                {entries.length} قيد
                            </span>
                        </div>

                        {entries.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-14 text-gray-400 dark:text-neutral-500">
                                <svg
                                    className="mb-3 h-10 w-10 opacity-60"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                    />
                                </svg>
                                <p className="text-sm">
                                    مفيش قيود متسجلة لحد دلوقتي.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-right text-sm">
                                    <thead className="bg-gray-50 text-xs text-gray-500 dark:bg-black/30 dark:text-neutral-400">
                                        <tr>
                                            <th className="px-5 py-3 font-medium">
                                                العميل
                                            </th>
                                            <th className="px-3 py-3 font-medium">
                                                الخزنة
                                            </th>
                                            <th className="px-3 py-3 font-medium">
                                                طريقة الاستلام
                                            </th>
                                            <th className="px-3 py-3 font-medium">
                                                مدين
                                            </th>
                                            <th className="px-3 py-3 font-medium">
                                                دائن
                                            </th>
                                            <th className="px-3 py-3 font-medium">
                                                الوصف
                                            </th>
                                            <th className="w-16 px-3 py-3" />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                                        {entries.map((entry) => (
                                            <tr
                                                key={entry.id}
                                                className="transition hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                                            >
                                                <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-gray-100">
                                                    {entry.customer?.name_ar}
                                                </td>
                                                <td className="px-3 py-3.5 text-gray-700 dark:text-neutral-300">
                                                    {entry.treasury?.name}
                                                </td>
                                                <td className="px-3 py-3.5">
                                                    <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700 dark:bg-neutral-800 dark:text-neutral-300">
                                                        {
                                                            entry.payment_method
                                                                ?.name
                                                        }
                                                    </span>
                                                </td>
                                                <td
                                                    className={`px-3 py-3.5 font-semibold tabular-nums ${
                                                        Number(entry.debit) > 0
                                                            ? "text-emerald-600 dark:text-emerald-400"
                                                            : "text-gray-300 dark:text-neutral-600"
                                                    }`}
                                                >
                                                    {Number(entry.debit) > 0
                                                        ? fmt(entry.debit)
                                                        : "—"}
                                                </td>
                                                <td
                                                    className={`px-3 py-3.5 font-semibold tabular-nums ${
                                                        Number(entry.credit) > 0
                                                            ? "text-blue-600 dark:text-blue-400"
                                                            : "text-gray-300 dark:text-neutral-600"
                                                    }`}
                                                >
                                                    {Number(entry.credit) > 0
                                                        ? fmt(entry.credit)
                                                        : "—"}
                                                </td>
                                                <td className="max-w-[220px] truncate px-3 py-3.5 text-xs text-gray-500 dark:text-neutral-400">
                                                    {entry.description || "—"}
                                                </td>
                                                <td className="px-3 py-3.5 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                entry.id,
                                                            )
                                                        }
                                                        aria-label="حذف القيد"
                                                        title="حذف"
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:text-neutral-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                                    >
                                                        <svg
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={1.8}
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                            />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="border-t border-gray-200 bg-gray-50 text-sm font-bold dark:border-neutral-800 dark:bg-black/30">
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-5 py-3.5 text-gray-700 dark:text-neutral-300"
                                            >
                                                الإجمالي
                                            </td>
                                            <td className="px-3 py-3.5 tabular-nums text-emerald-600 dark:text-emerald-400">
                                                {fmt(totalDebit)}
                                            </td>
                                            <td className="px-3 py-3.5 tabular-nums text-blue-600 dark:text-blue-400">
                                                {fmt(totalCredit)}
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
