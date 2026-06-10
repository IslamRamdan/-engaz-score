import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    UserPlus,
    User,
    Phone,
    Briefcase,
    Calendar,
    Edit3,
    Users,
    ChevronLeft,
    LayoutDashboard,
    Search,
    MessageCircle,
    X,
    Download,
    Copy,
    Check,
    ChevronDown,
    FolderPlus,
} from "lucide-react";

interface Customer {
    id: number;
    name_ar: string;
    phone: string | null;
    whatsapp: string | null;
    personal_image: string | null;
    latest_delegate?: { id: number; name: string }[] | null;
    created_at: string;
}

interface Group {
    id: number;
    name: string;
}

interface Props {
    customers: Customer[];
    visas?: any;
    groups: Group[]; // تم استقبال المجموعات القادمة من الـ Controller
}

// ── مساعد تنسيق التاريخ dd/mm/yyyy ─────────────────────────────────────────
function formatDate(iso: string) {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

// ── مكوّن بادج المندوب ───────────────────────────────────────────────────────
function DelegateBadge({ name }: { name?: string | null }) {
    if (!name)
        return (
            <span className="text-zinc-300 dark:text-zinc-600 text-xs font-bold">
                غير محدد
            </span>
        );
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-[11px] font-black border border-emerald-100 dark:border-emerald-800/50">
            <Briefcase className="w-2.5 h-2.5" />
            {name}
        </span>
    );
}

export default function Index({ customers = [], groups = [] }: Props) {
    const [search, setSearch] = useState("");
    const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>(
        [],
    );
    const [isOperationsOpen, setIsOperationsOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<string>("");

    // فورم Inertia لإرسال البيانات للخلفية
    const { data, setData, post, processing, reset } = useForm({
        customer_ids: [] as number[],
    });

    // حالة الـ Popup الخاص بالصورة
    const [activeImage, setActiveImage] = useState<{
        src: string;
        name: string;
    } | null>(null);
    const [copied, setCopied] = useState(false);

    const filtered = customers.filter(
        (c) =>
            c.name_ar.includes(search) ||
            (c.phone ?? "").includes(search) ||
            (c.latest_delegate?.[0]?.name ?? "").includes(search),
    );

    // إدارة تحديد العناصر
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedCustomerIds(filtered.map((c) => c.id));
        } else {
            setSelectedCustomerIds([]);
        }
    };

    const handleSelectCustomer = (id: number) => {
        setSelectedCustomerIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id],
        );
    };

    // إرسال العملاء المحددين إلى السيرفر للمجموعة المختارة
    const handleAddToGroupSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedGroupId || selectedCustomerIds.length === 0) return;

        setData("customer_ids", selectedCustomerIds);

        post(route("groups.sync-customers", selectedGroupId), {
            onSuccess: () => {
                setIsGroupModalOpen(false);
                setSelectedCustomerIds([]);
                setSelectedGroupId("");
                reset();
            },
        });
    };

    // دالة نسخ رابط الصورة
    const handleCopyLink = async (src: string) => {
        try {
            const absoluteUrl = `${window.location.origin}${src}`;
            await navigator.clipboard.writeText(absoluteUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("فشل نسخ الرابط", err);
        }
    };

    return (
        <>
            <Head title="إدارة ملفات العملاء" />

            <div className="max-w-7xl mx-auto py-6 px-4" dir="rtl">
                {/* ── الهيدر ─────────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-[10px] font-black tracking-widest uppercase mb-2">
                            <LayoutDashboard className="w-3 h-3" />
                            <span>لوحة التحكم</span>
                            <ChevronLeft className="w-3 h-3" />
                            <span className="text-emerald-600 dark:text-emerald-400">
                                العملاء
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                                سجل ملفات العملاء
                            </h1>
                            <span className="px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-black rounded-full border border-zinc-200 dark:border-zinc-700">
                                {customers.length} عميل
                            </span>
                        </div>
                    </div>

                    {/* أزرار التحكم جهة اليسار */}
                    <div className="flex items-center gap-3 self-start sm:self-auto relative">
                        {/* زر العمليات */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setIsOperationsOpen(!isOperationsOpen)
                                }
                                disabled={selectedCustomerIds.length === 0}
                                className={`inline-flex items-center justify-center gap-2 px-5 py-3 font-black text-sm rounded-2xl transition-all shadow-sm ${
                                    selectedCustomerIds.length > 0
                                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800"
                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                                }`}
                            >
                                <span>العمليات</span>
                                <ChevronDown className="w-4 h-4" />
                                {selectedCustomerIds.length > 0 && (
                                    <span className="mr-1 px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
                                        {selectedCustomerIds.length}
                                    </span>
                                )}
                            </button>

                            {/* القائمة المنسدلة للعمليات */}
                            {isOperationsOpen &&
                                selectedCustomerIds.length > 0 && (
                                    <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-30 overflow-hidden">
                                        <button
                                            onClick={() => {
                                                setIsOperationsOpen(false);
                                                setIsGroupModalOpen(true);
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-3 text-right text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                                        >
                                            <FolderPlus className="w-4 h-4 text-emerald-500" />
                                            <span>
                                                إضافة العملاء إلى مجموعة
                                            </span>
                                        </button>
                                    </div>
                                )}
                        </div>

                        <Link
                            href={route("customers.create")}
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl transition-all shadow-sm"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span>إضافة عميل جديد</span>
                        </Link>
                    </div>
                </div>

                {/* ── شريط البحث ─────────────────────────────────────────── */}
                <div className="relative mb-6">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="ابحث بالاسم أو الهاتف أو المندوب..."
                        className="w-full pr-11 pl-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors"
                    />
                </div>

                {/* ── الجدول ─────────────────────────────────────────────── */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right border-collapse">
                            <thead>
                                <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-black tracking-widest uppercase">
                                    <th className="p-4 pr-6 text-right w-12">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={
                                                filtered.length > 0 &&
                                                selectedCustomerIds.length ===
                                                    filtered.length
                                            }
                                            className="w-4 h-4 text-emerald-600 bg-zinc-100 border-zinc-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-zinc-800 dark:bg-zinc-700 dark:border-zinc-600 focus:ring-2"
                                        />
                                    </th>
                                    <th className="p-4 text-right">العميل</th>
                                    <th className="p-4 text-center">الهاتف</th>
                                    <th className="p-4 text-center">
                                        الواتساب
                                    </th>
                                    <th className="p-4 text-center">المندوب</th>
                                    <th className="p-4 text-center">
                                        تاريخ التسجيل
                                    </th>
                                    <th className="p-4 pl-6 text-left">
                                        إجراءات
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {filtered.length > 0 ? (
                                    filtered.map((customer, i) => (
                                        <tr
                                            key={customer.id}
                                            className={`group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors ${
                                                selectedCustomerIds.includes(
                                                    customer.id,
                                                )
                                                    ? "bg-emerald-50/40 dark:bg-emerald-950/10"
                                                    : ""
                                            }`}
                                            style={{
                                                animationDelay: `${i * 30}ms`,
                                            }}
                                        >
                                            {/* التيك بوكس التحديد */}
                                            <td className="p-4 pr-6 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCustomerIds.includes(
                                                        customer.id,
                                                    )}
                                                    onChange={() =>
                                                        handleSelectCustomer(
                                                            customer.id,
                                                        )
                                                    }
                                                    className="w-4 h-4 text-emerald-600 bg-zinc-100 border-zinc-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-zinc-800 dark:bg-zinc-700 dark:border-zinc-600 focus:ring-2"
                                                />
                                            </td>

                                            {/* الاسم والصورة */}
                                            <td className="p-4 whitespace-nowrap ">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        onClick={() =>
                                                            customer.personal_image &&
                                                            setActiveImage({
                                                                src: `/storage/${customer.personal_image}`,
                                                                name: customer.name_ar,
                                                            })
                                                        }
                                                        className={`w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 transition-all shrink-0 overflow-hidden ${customer.personal_image ? "cursor-zoom-in hover:ring-2 hover:ring-emerald-500/50" : ""}`}
                                                    >
                                                        {customer.personal_image ? (
                                                            <img
                                                                src={`/storage/${customer.personal_image}`}
                                                                alt={
                                                                    customer.name_ar
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <User className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                                                            {customer.name_ar}
                                                        </p>
                                                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold">
                                                            #{customer.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* الهاتف */}
                                            <td className="p-4 whitespace-nowrap">
                                                {customer.phone ? (
                                                    <div
                                                        className="flex items-center gap-1.5 justify-center"
                                                        dir="ltr"
                                                    >
                                                        <Phone className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600 shrink-0" />
                                                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                                            {customer.phone}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-zinc-300 dark:text-zinc-700 font-black text-sm">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            {/* الواتساب */}
                                            <td className="p-4 whitespace-nowrap">
                                                {customer.whatsapp ? (
                                                    <div
                                                        className="flex items-center gap-1.5 justify-center"
                                                        dir="ltr"
                                                    >
                                                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                                            {customer.whatsapp}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-zinc-300 dark:text-zinc-700 font-black text-sm">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            {/* المندوب */}
                                            <td className="p-4 whitespace-nowrap text-center">
                                                {customer.latest_delegate?.[0]
                                                    ?.name ? (
                                                    <Link
                                                        href={route(
                                                            "customer.delegate_history",
                                                            customer.id,
                                                        )}
                                                        className="hover:opacity-80 transition cursor-pointer inline-block"
                                                    >
                                                        <DelegateBadge
                                                            name={
                                                                customer
                                                                    .latest_delegate[0]
                                                                    .name
                                                            }
                                                        />
                                                    </Link>
                                                ) : (
                                                    <span className="text-zinc-400 dark:text-zinc-600 italic text-xs">
                                                        لا يوجد مندوب
                                                    </span>
                                                )}
                                            </td>

                                            {/* التاريخ */}
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 justify-center">
                                                    <Calendar className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600 shrink-0" />
                                                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                                        {formatDate(
                                                            customer.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* الإجراءات */}
                                            <td className="p-4 pl-6 whitespace-nowrap text-left">
                                                <div className="inline-flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 justify-center">
                                                    <Link
                                                        href={route(
                                                            "customers.edit",
                                                            customer.id,
                                                        )}
                                                        className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-white dark:hover:bg-zinc-700 transition-all"
                                                        title="تعديل البيانات"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-16 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                                                    <Users className="w-6 h-6 text-zinc-300 dark:text-zinc-600" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                                                        {search
                                                            ? "لا توجد نتائج للبحث"
                                                            : "لا يوجد عملاء مسجلين"}
                                                    </p>
                                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-bold">
                                                        {search
                                                            ? "جرّب كلمة بحث مختلفة"
                                                            : "ابدأ بإضافة أول عميل للمنظومة الآن."}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ── فوتر الجدول ──────────────────────────────────────── */}
                    {filtered.length > 0 && (
                        <div className="px-6 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 flex items-center justify-between">
                            <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500">
                                {search
                                    ? `${filtered.length} من ${customers.length} نتيجة`
                                    : `إجمالي ${customers.length} عميل`}
                            </p>
                            <p className="text-[11px] font-bold text-zinc-300 dark:text-zinc-600">
                                آخر تحديث:{" "}
                                {formatDate(new Date().toISOString())}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── مودال اختيار المجموعة ─────────────────────────────────────────── */}
            {isGroupModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                            <h3 className="text-md font-black text-zinc-900 dark:text-zinc-100">
                                إضافة العملاء المحددين إلى مجموعة
                            </h3>
                            <button
                                onClick={() => setIsGroupModalOpen(false)}
                                className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddToGroupSubmit}>
                            <div className="p-6 space-y-4">
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold">
                                    سيتم إضافة عدد ({selectedCustomerIds.length}
                                    ) عميل إلى المجموعة المحددة أدناه:
                                </p>
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-zinc-600 dark:text-zinc-400">
                                        اختر المجموعة
                                    </label>
                                    <select
                                        required
                                        value={selectedGroupId}
                                        onChange={(e) =>
                                            setSelectedGroupId(e.target.value)
                                        }
                                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-zinc-950 dark:text-zinc-50 focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="">
                                            -- اختر من القائمة --
                                        </option>
                                        {groups.map((group) => (
                                            <option
                                                key={group.id}
                                                value={group.id}
                                            >
                                                {group.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={processing || !selectedGroupId}
                                    className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition shadow-sm disabled:opacity-50"
                                >
                                    {processing
                                        ? "جاري الحفظ..."
                                        : "تأكيد الإضافة"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsGroupModalOpen(false)}
                                    className="px-4 py-3 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-black rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── نافذة منبثقة لعرض الصورة (Lightbox) ───────────────── */}
            {activeImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
                    <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/20">
                            <div className="space-y-0.5">
                                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                                    الصورة الشخصية
                                </h3>
                                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-bold">
                                    {activeImage.name}
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveImage(null)}
                                className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 rounded-xl transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-6 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950/40">
                            <div className="w-64 h-64 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-inner">
                                <img
                                    src={activeImage.src}
                                    alt={activeImage.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 flex items-center gap-3">
                            <a
                                href={activeImage.src}
                                download={`${activeImage.name}.jpg`}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition shadow-sm"
                            >
                                <Download className="w-4 h-4" />
                                <span>تنزيل الصورة</span>
                            </a>
                            <button
                                onClick={() => handleCopyLink(activeImage.src)}
                                className={`inline-flex items-center justify-center gap-2 px-4 py-3 border rounded-xl text-xs font-black transition-all shadow-sm ${
                                    copied
                                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 w-32"
                                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 w-32"
                                }`}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        <span>تم النسخ!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        <span>نسخ الرابط</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

Index.layout = (page: React.ReactNode) => <AppLayout children={page} />;
