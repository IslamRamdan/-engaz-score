import { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Users,
    Phone,
    MessageCircle,
    ArrowRight,
    CheckSquare,
    Square,
    MoreVertical,
    Trash2,
    FileText,
    Globe,
    Copy,
    Download,
    X,
    ChevronDown,
    FolderPlus,
    UserPlus,
    UserMinus,
} from "lucide-react";

type Customer = {
    id: number;
    name_ar: string;
    name_en: string | null;
    phone: string | null;
    whatsapp: string | null;
    nationality: string | null;
    passport_number: string | null;
    passport_expiry_date: string | null;
    visa_number: string | null;
    e_number: string | null;
    gender: string | null;
    personal_image?: string | null;
};

type Group = {
    id: number;
    name: string;
};

type Props = {
    group: Group;
    customers: Customer[];
};

export default function Show({ group, customers }: Props) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [activeRowMenu, setActiveRowMenu] = useState<number | null>(null);
    const [isOperationsOpen, setIsOperationsOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

    // حالات الـ Popup الخاصة بالصورة
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isCopying, setIsCopying] = useState(false);

    const isAllSelected =
        customers.length > 0 && selectedIds.length === customers.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(customers.map((c) => c.id));
        }
    };

    const handleSelectRow = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((item) => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkRemove = () => {
        if (selectedIds.length === 0) return;

        if (
            confirm(
                `هل أنت متأكد من إزالة ${selectedIds.length} عميل من هذه المجموعة؟`,
            )
        ) {
            router.delete(route("groups.remove-customers", group.id), {
                data: {
                    customer_ids: selectedIds,
                },
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedIds([]);
                    setActiveRowMenu(null);
                },
            });
        }
    };

    const handleRemoveSingleCustomer = (customerId: number) => {
        if (!confirm("هل أنت متأكد من إزالة هذا العميل من المجموعة؟")) {
            return;
        }

        router.delete(route("groups.remove-customers", group.id), {
            data: {
                customer_ids: [customerId],
            },
            preserveScroll: true,
            onSuccess: () => {
                setSelectedIds((prev) =>
                    prev.filter((id) => id !== customerId),
                );
                setActiveRowMenu(null);
            },
        });
    };

    // دالة نسخ الصورة إلى الحافظة
    const handleCopyImage = async (imageUrl: string) => {
        try {
            setIsCopying(true);
            const response = await fetch(imageUrl);
            const blob = await response.blob();

            const img = new Image();
            img.src = URL.createObjectURL(blob);
            img.onload = async () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0);

                canvas.toBlob(async (pngBlob) => {
                    if (pngBlob) {
                        await navigator.clipboard.write([
                            new ClipboardItem({ [pngBlob.type]: pngBlob }),
                        ]);
                        alert("تم نسخ الصورة إلى الحافظة بنجاح!");
                    }
                }, "image/png");
            };
        } catch (err) {
            console.error("Failed to copy image: ", err);
            alert(
                "فشل نسخ الصورة، قد يكون ذلك بسبب سياسات الحماية للمتصفح المضيف للصورة.",
            );
        } finally {
            setIsCopying(false);
        }
    };

    return (
        <AppLayout>
            <Head title={`مجموعة ${group.name}`} />

            <div
                className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-6 antialiased text-zinc-800 dark:text-zinc-200"
                dir="rtl"
            >
                {/* ===== HEADER ===== */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                <Users className="w-6 h-6" />
                            </span>
                            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
                                إدارة مجموعة: {group.name}
                            </h1>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mr-10">
                            استعراض والتحكم في العملاء المرتبطين بالمجموعة
                            الحالية
                        </p>
                    </div>

                    {/* أزرار التحكم جهة اليسار */}
                    <div className="flex items-center gap-3 self-start sm:self-auto relative">
                        {/* زر العمليات */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setIsOperationsOpen(!isOperationsOpen)
                                }
                                disabled={selectedIds.length === 0}
                                className={`inline-flex items-center justify-center gap-2 px-5 py-3 font-black text-sm rounded-2xl transition-all shadow-sm ${
                                    selectedIds.length > 0
                                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800"
                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                                }`}
                            >
                                <span>العمليات</span>
                                <ChevronDown className="w-4 h-4" />
                                {selectedIds.length > 0 && (
                                    <span className="mr-1 px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
                                        {selectedIds.length}
                                    </span>
                                )}
                            </button>

                            {/* القائمة المنسدلة للعمليات */}
                            {isOperationsOpen && selectedIds.length > 0 && (
                                <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-30 overflow-hidden">
                                    <button
                                        onClick={handleBulkRemove}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-right text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                                    >
                                        <UserMinus className="w-4 h-4 text-red-500" />{" "}
                                        <span>ازالة العملاء من المجموعة</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <Link
                            href={route("groups.index")}
                            className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm transition self-start sm:self-center"
                        >
                            <ArrowRight className="w-4 h-4" />
                            الرجوع للمجموعات
                        </Link>
                    </div>
                </div>

                {/* ===== STATS ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm">
                        <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                            إجمالي العملاء
                        </p>
                        <p className="text-3xl font-black text-zinc-900 dark:text-white mt-1">
                            {customers.length}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm">
                        <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                            جوازات سفر مسجلة
                        </p>
                        <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
                            {customers.filter((c) => c.passport_number).length}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm">
                        <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                            جاهز للتواصل (واتساب)
                        </p>
                        <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                            {customers.filter((c) => c.whatsapp).length}
                        </p>
                    </div>
                </div>

                {/* ===== CUSTOMERS TABLE CARD ===== */}
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                    <th className="p-4 w-12 text-center">
                                        <button
                                            onClick={handleSelectAll}
                                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
                                        >
                                            {isAllSelected ? (
                                                <CheckSquare className="w-5 h-5 text-emerald-500" />
                                            ) : (
                                                <Square className="w-5 h-5" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="p-4 min-w-[200px]">
                                        العميل
                                    </th>
                                    <th className="p-4">الجنسية</th>
                                    <th className="p-4">بيانات الجواز</th>
                                    <th className="p-4">رقم التأشيرة / E-No</th>
                                    <th className="p-4">روابط التواصل</th>
                                    <th className="p-4 w-20 text-center">
                                        العمليات
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm">
                                {customers.length > 0 ? (
                                    customers.map((c) => {
                                        const isSelected = selectedIds.includes(
                                            c.id,
                                        );
                                        const imageUrl = c.personal_image
                                            ? `/storage/${c.personal_image}`
                                            : null;
                                        return (
                                            <tr
                                                key={c.id}
                                                className={`hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors ${isSelected ? "bg-emerald-50/30 dark:bg-emerald-950/10" : ""}`}
                                            >
                                                {/* Checkbox */}
                                                <td className="p-4 text-center">
                                                    <button
                                                        onClick={() =>
                                                            handleSelectRow(
                                                                c.id,
                                                            )
                                                        }
                                                        className="text-zinc-400 hover:text-zinc-600 transition"
                                                    >
                                                        {isSelected ? (
                                                            <CheckSquare className="w-5 h-5 text-emerald-500" />
                                                        ) : (
                                                            <Square className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </td>

                                                {/* العميل */}
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        {imageUrl ? (
                                                            <button
                                                                onClick={() =>
                                                                    setSelectedImage(
                                                                        imageUrl,
                                                                    )
                                                                }
                                                                className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:scale-105 transition shrink-0 cursor-pointer shadow-sm relative group"
                                                                title="اضغط لعرض وتنزيل الصورة"
                                                            >
                                                                <img
                                                                    src={
                                                                        imageUrl
                                                                    }
                                                                    alt={
                                                                        c.name_ar
                                                                    }
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </button>
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center font-bold text-lg shrink-0 border border-zinc-200 dark:border-zinc-700 select-none">
                                                                {c.gender ===
                                                                "female"
                                                                    ? "🙋‍♀️"
                                                                    : "🙋‍♂️"}
                                                            </div>
                                                        )}
                                                        <div className="space-y-0.5 truncate max-w-[240px]">
                                                            <p className="font-bold text-zinc-900 dark:text-white truncate">
                                                                {c.name_ar}
                                                            </p>
                                                            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono truncate">
                                                                {c.name_en ??
                                                                    "—"}
                                                            </p>
                                                            <span className="inline-block text-[10px] px-1.5 py-0.2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded font-mono">
                                                                ID: #{c.id}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* الجنسية */}
                                                <td className="p-4">
                                                    <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                                                        <Globe className="w-4 h-4 text-zinc-400" />
                                                        <span className="font-medium">
                                                            {c.nationality ??
                                                                "غير محدد"}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* بيانات الجواز */}
                                                <td className="p-4">
                                                    {c.passport_number ? (
                                                        <div className="space-y-1">
                                                            <p className="font-mono font-bold text-zinc-900 dark:text-zinc-200">
                                                                {
                                                                    c.passport_number
                                                                }
                                                            </p>
                                                            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                                                                ينتهي في:{" "}
                                                                {c.passport_expiry_date
                                                                    ? new Date(
                                                                          c.passport_expiry_date,
                                                                      ).toLocaleDateString(
                                                                          "ar-EG",
                                                                      )
                                                                    : "—"}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-zinc-400">
                                                            —
                                                        </span>
                                                    )}
                                                </td>

                                                {/* رقم التأشيرة */}
                                                <td className="p-4">
                                                    <div className="space-y-1">
                                                        <p className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                                            <span className="text-zinc-400 font-sans">
                                                                تأشيرة:
                                                            </span>{" "}
                                                            {c.visa_number ??
                                                                "—"}
                                                        </p>
                                                        <p className="font-mono text-[11px] text-zinc-400">
                                                            <span className="text-zinc-500 font-sans">
                                                                E-No:
                                                            </span>{" "}
                                                            {c.e_number ?? "—"}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* روابط التواصل */}
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        {c.phone ? (
                                                            <a
                                                                href={`tel:${c.phone}`}
                                                                className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                                                                title="اتصال هاتفي"
                                                            >
                                                                <Phone className="w-3.5 h-3.5" />
                                                            </a>
                                                        ) : (
                                                            <div className="p-2 text-zinc-300 dark:text-zinc-700">
                                                                <Phone className="w-3.5 h-3.5" />
                                                            </div>
                                                        )}

                                                        {c.whatsapp ? (
                                                            <a
                                                                href={`https://wa.me/${c.whatsapp.replace(/\+/g, "")}`}
                                                                target="_blank"
                                                                className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition"
                                                                title="مراسلة واتساب"
                                                            >
                                                                <MessageCircle className="w-3.5 h-3.5" />
                                                            </a>
                                                        ) : (
                                                            <div className="p-2 text-zinc-300 dark:text-zinc-700">
                                                                <MessageCircle className="w-3.5 h-3.5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* قائمة العمليات الفردية */}
                                                <td className="p-4 text-center relative">
                                                    <button
                                                        onClick={() =>
                                                            setActiveRowMenu(
                                                                activeRowMenu ===
                                                                    c.id
                                                                    ? null
                                                                    : c.id,
                                                            )
                                                        }
                                                        className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>

                                                    {activeRowMenu === c.id && (
                                                        <>
                                                            <div
                                                                className="fixed inset-0 z-10"
                                                                onClick={() =>
                                                                    setActiveRowMenu(
                                                                        null,
                                                                    )
                                                                }
                                                            />
                                                            <div className="absolute left-4 top-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl rounded-xl p-1 w-44 z-20 text-right animate-in fade-in zoom-in-95 duration-100">
                                                                <Link
                                                                    href={route(
                                                                        "customers.show",
                                                                        c.id,
                                                                    )}
                                                                    className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                                                >
                                                                    <FileText className="w-4 h-4 text-zinc-400" />
                                                                    الملف الكامل
                                                                    للعميل
                                                                </Link>
                                                                <button
                                                                    onClick={() => {
                                                                        setActiveRowMenu(
                                                                            null,
                                                                        );
                                                                        handleRemoveSingleCustomer(
                                                                            c.id,
                                                                        );
                                                                    }}
                                                                    className="w-full flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-right"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    إزالة من
                                                                    المجموعة
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-12 text-center text-zinc-400 dark:text-zinc-500"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Users className="w-8 h-8 text-zinc-300" />
                                                <p className="text-sm font-medium">
                                                    لا يوجد عملاء داخل هذه
                                                    المجموعة حالياً
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ===== IMAGE MODAL POPUP ===== */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div
                        className="absolute inset-0"
                        onClick={() => setSelectedImage(null)}
                    />

                    <div className="bg-zinc-900 text-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative z-10 border border-zinc-800 animate-in zoom-in-95 duration-200">
                        {/* Header Bar */}
                        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
                            <h3 className="text-xs font-bold tracking-wide text-zinc-400">
                                معاينة صورة العميل
                            </h3>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition text-zinc-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Image Body */}
                        <div className="p-6 flex items-center justify-center bg-zinc-950/40 border-b border-zinc-800">
                            <img
                                src={selectedImage}
                                alt="Customer Avatar Expanded"
                                className="max-h-[60vh] max-w-full rounded-lg object-contain shadow-md"
                            />
                        </div>

                        {/* Actions Footer */}
                        <div
                            className="p-4 bg-zinc-900/80 flex items-center justify-end gap-2"
                            dir="rtl"
                        >
                            <button
                                onClick={() => handleCopyImage(selectedImage)}
                                disabled={isCopying}
                                className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 transition text-zinc-200 disabled:opacity-50"
                            >
                                <Copy className="w-4 h-4" />
                                {isCopying ? "جاري النسخ..." : "نسخ الصورة"}
                            </button>
                            <a
                                href={selectedImage}
                                download="customer_image.png"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 transition"
                            >
                                <Download className="w-4 h-4" />
                                تنزيل الصورة
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
