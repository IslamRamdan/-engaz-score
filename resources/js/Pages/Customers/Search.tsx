// resources/js/Pages/Customers/Search.tsx

import { useState, useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import AppLayout from "@/Layouts/AppLayout";
import {
    Search as SearchIcon,
    X,
    Phone,
    MessageCircle,
    BookUser,
    IdCard,
    UserCircle2,
    Loader2,
} from "lucide-react";

interface Customer {
    id: number;
    name_ar: string;
    name_en: string | null;
    personal_image: string | null;
    passport_number: string | null;
    national_id: string | null;
    phone: string | null;
    whatsapp: string | null;
}

interface SearchApiResponse {
    data: Customer[];
    total: number;
}

export default function Search() {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<Customer[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const requestIdRef = useRef(0);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        const term = search.trim();

        if (term === "") {
            setResults([]);
            setTotal(0);
            setHasSearched(false);
            setLoading(false);
            setErrorMsg(null);
            return;
        }

        setLoading(true);
        setErrorMsg(null);

        debounceRef.current = setTimeout(() => {
            const currentRequestId = ++requestIdRef.current;
            const url = route("customers.search.results");

            // eslint-disable-next-line no-console
            console.log("[Search] calling:", url, "with search =", term);

            axios
                .get<SearchApiResponse>(url, { params: { search: term } })
                .then((res) => {
                    if (currentRequestId !== requestIdRef.current) return;

                    // eslint-disable-next-line no-console
                    console.log("[Search] response:", res.data);

                    setResults(res.data?.data ?? []);
                    setTotal(res.data?.total ?? 0);
                    setHasSearched(true);
                })
                .catch((err) => {
                    if (currentRequestId !== requestIdRef.current) return;

                    // eslم-disable-next-line no-console
                    console.error(
                        "[Search] error status:",
                        err.response?.status,
                    );
                    console.error("[Search] error data:", err.response?.data);

                    setErrorMsg(
                        `حصل خطأ (${err.response?.status ?? "network"}) - افتح الكونسول للتفاصيل`,
                    );
                    setResults([]);
                    setTotal(0);
                    setHasSearched(true);
                })
                .finally(() => {
                    if (currentRequestId !== requestIdRef.current) return;
                    setLoading(false);
                });
        }, 400);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [search]);

    const clearSearch = () => {
        setSearch("");
        setResults([]);
        setTotal(0);
        setHasSearched(false);
        setErrorMsg(null);
    };

    return (
        <AppLayout>
            <Head title="البحث عن العملاء" />

            <div className="py-6" dir="rtl">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                            البحث عن العملاء
                        </h1>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            ابحث بالاسم (عربي / إنجليزي)، رقم الجواز، أو الرقم
                            القومي
                        </p>
                    </div>

                    {/* Search Box */}
                    <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="relative">
                            {loading ? (
                                <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-emerald-500" />
                            ) : (
                                <SearchIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                            )}
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="اكتب الاسم أو رقم الجواز أو الرقم القومي..."
                                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2.5 pr-10 pl-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-emerald-500 dark:focus:bg-zinc-800"
                                autoFocus
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {hasSearched && !loading && !errorMsg && (
                            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                                عدد النتائج:{" "}
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    {total}
                                </span>
                            </p>
                        )}

                        {errorMsg && (
                            <p className="mt-3 text-xs font-medium text-red-500">
                                {errorMsg}
                            </p>
                        )}
                    </div>

                    {/* Results */}
                    {!hasSearched ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white py-16 dark:border-zinc-700 dark:bg-zinc-900">
                            <SearchIcon className="mb-3 h-10 w-10 text-zinc-300 dark:text-zinc-600" />
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                ابدأ بكتابة كلمة للبحث
                            </p>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white py-16 dark:border-zinc-700 dark:bg-zinc-900">
                            <SearchIcon className="mb-3 h-10 w-10 text-zinc-300 dark:text-zinc-600" />
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                لا توجد نتائج مطابقة لـ "{search}"
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {results.map((customer) => (
                                <Link
                                    key={customer.id}
                                    href={route("customers.show", customer.id)}
                                    className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
                                >
                                    {/* الصورة الشخصية */}
                                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                                        {customer.personal_image ? (
                                            <img
                                                src={`/storage/${customer.personal_image}`}
                                                alt={customer.name_ar}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <UserCircle2 className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                                            </div>
                                        )}
                                    </div>

                                    {/* الاسم */}
                                    <div className="w-48 flex-shrink-0">
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                            {customer.name_ar}
                                        </p>
                                        {customer.name_en && (
                                            <p className="text-xs text-zinc-400">
                                                {customer.name_en}
                                            </p>
                                        )}
                                    </div>

                                    {/* رقم الجواز */}
                                    <div className="hidden w-40 flex-shrink-0 sm:block">
                                        <div className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-300">
                                            <BookUser className="h-3.5 w-3.5 text-zinc-400" />
                                            {customer.passport_number ?? "—"}
                                        </div>
                                        <p className="mt-0.5 text-[11px] text-zinc-400">
                                            رقم الجواز
                                        </p>
                                    </div>

                                    {/* الرقم القومي */}
                                    <div className="hidden w-40 flex-shrink-0 md:block">
                                        <div className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-300">
                                            <IdCard className="h-3.5 w-3.5 text-zinc-400" />
                                            {customer.national_id ?? "—"}
                                        </div>
                                        <p className="mt-0.5 text-[11px] text-zinc-400">
                                            الرقم القومي
                                        </p>
                                    </div>

                                    {/* التواصل */}
                                    <div className="mr-auto flex flex-shrink-0 flex-col gap-1">
                                        <div className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-300">
                                            <Phone className="h-3.5 w-3.5 text-zinc-400" />
                                            {customer.phone ?? "—"}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-300">
                                            <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                                            {customer.whatsapp ?? "—"}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
