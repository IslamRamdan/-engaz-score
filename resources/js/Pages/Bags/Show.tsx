import AppLayout from "@/Layouts/AppLayout";
import {
    Briefcase,
    ArrowRight,
    User,
    CheckSquare,
    Square,
    Edit3,
    X,
    Download,
    Copy, // استيراد أيقونة النسخ
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { useState } from "react";

type Customer = {
    id: number;
    name_ar?: string;
    name_en?: string;
    gender?: string;
    personal_image?: string; // رابط الصورة الشخصية
    birth_date?: string;
    passport_number?: string;
    phone?: string;
    medical_status?: string;
    lab_status?: string;
    enjaz_status?: string;
};

type Bag = {
    id: number;
    name: string;
    customers: Customer[];
};

type Props = {
    bag: Bag;
};

export default function Show({ bag }: Props) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isCopying, setIsCopying] = useState(false); // حالة جاري النسخ

    const isAllSelected =
        bag.customers.length > 0 && selectedIds.length === bag.customers.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(bag.customers.map((c) => c.id));
        }
    };

    const handleSelectCustomer = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((item) => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // دالة نسخ الصورة إلى الحافظة (Clipboard)
    const handleCopyImage = async (url: string | null) => {
        if (!url) return;
        try {
            setIsCopying(true);
            const response = await fetch(url);
            const blob = await response.blob();
            await navigator.clipboard.write([
                new ClipboardItem({ [blob.type]: blob }),
            ]);
            alert("تم نسخ الصورة إلى الحافظة بنجاح!");
        } catch (err) {
            console.error("فشل نسخ الصورة: ", err);
            alert("عذراً، لم نتمكن من نسخ الصورة تلقائياً.");
        } finally {
            setIsCopying(false);
        }
    };

    const calculateAge = (birthDateString?: string) => {
        if (!birthDateString) return "—";
        const today = new Date();
        const birthDate = new Date(birthDateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <AppLayout>
            <div
                className="space-y-6 p-4 md:p-8 max-w-[1600px] mx-auto antialiased text-zinc-800 dark:text-zinc-200"
                dir="rtl"
            >
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
                    <div className="space-y-2">
                        <Link
                            href={route("dashboard")}
                            className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 font-bold transition"
                        >
                            <ArrowRight className="w-3.5 h-3.5" />
                            العودة للوحة التحكم
                        </Link>
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
                                {bag.name}
                            </h1>
                        </div>
                    </div>

                    <span className="text-xs font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full text-zinc-600 dark:text-zinc-400 self-start sm:self-center">
                        عدد العملاء المضافين: {bag.customers.length}
                    </span>
                </div>

                {/* CUSTOMERS TABLE / LIST */}
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
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
                                    <th className="p-4 min-w-[250px]">
                                        الاسم والملف
                                    </th>
                                    <th className="p-4">السن</th>
                                    <th className="p-4">الهاتف / واتساب</th>
                                    <th className="p-4">رقم الجواز</th>
                                    <th className="p-4 w-20 text-center">
                                        العمليات
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                                {bag.customers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="p-12 text-center text-zinc-400 font-medium"
                                        >
                                            <div className="space-y-2">
                                                <User className="w-8 h-8 text-zinc-300 mx-auto" />
                                                <p className="text-sm">
                                                    لا يوجد عملاء في هذه الحقيبة
                                                    حالياً
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    bag.customers.map((c) => {
                                        const isSelected = selectedIds.includes(
                                            c.id,
                                        );

                                        // تعديل مسار الصورة ليعتمد على مجلد الـ storage العام
                                        const imageUrl = c.personal_image
                                            ? `/storage/${c.personal_image}`
                                            : null;

                                        return (
                                            <tr
                                                key={c.id}
                                                className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors ${
                                                    isSelected
                                                        ? "bg-emerald-50/30 dark:bg-emerald-950/10"
                                                        : ""
                                                }`}
                                            >
                                                {/* Checkbox */}
                                                <td className="p-4 text-center">
                                                    <button
                                                        onClick={() =>
                                                            handleSelectCustomer(
                                                                c.id,
                                                            )
                                                        }
                                                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
                                                    >
                                                        {isSelected ? (
                                                            <CheckSquare className="w-5 h-5 text-emerald-500" />
                                                        ) : (
                                                            <Square className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </td>

                                                {/* الاسم مع الصورة الشخصية */}
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        {imageUrl ? (
                                                            <button
                                                                onClick={() =>
                                                                    setSelectedImage(
                                                                        imageUrl,
                                                                    )
                                                                }
                                                                className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:scale-105 transition shrink-0 cursor-pointer shadow-sm"
                                                                title="اضغط لعرض وتنزيل الصورة"
                                                            >
                                                                <img
                                                                    src={
                                                                        imageUrl
                                                                    }
                                                                    alt={
                                                                        c.name_ar ||
                                                                        "صورة العميل"
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
                                                        <div>
                                                            <p className="font-bold text-zinc-900 dark:text-white text-sm">
                                                                {c.name_ar ||
                                                                    "—"}
                                                            </p>
                                                            {c.name_en && (
                                                                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                                                                    {c.name_en}
                                                                </p>
                                                            )}
                                                            <span className="inline-block text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded font-mono mt-0.5">
                                                                #{c.id}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* السن */}
                                                <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
                                                    {calculateAge(c.birth_date)}
                                                </td>

                                                {/* الهاتف */}
                                                <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                                                    {c.phone ?? "—"}
                                                </td>

                                                {/* رقم الجواز */}
                                                <td className="p-4 text-sm font-mono text-zinc-500 dark:text-zinc-400 uppercase">
                                                    {c.passport_number ?? "—"}
                                                </td>

                                                {/* العمليات */}
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            href={route(
                                                                "customers.edit",
                                                                c.id,
                                                            )}
                                                            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition inline-block"
                                                            title="تعديل"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* LIGHTBOX MODAL FOR IMAGES */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    {/* الخلفية لإغلاق المودال عند الضغط خارج الإطار */}
                    <div
                        className="absolute inset-0"
                        onClick={() => setSelectedImage(null)}
                    />

                    {/* نافذة المعاينة بالتصميم الجديد النظيف المحاط بحدود zinc-800 */}
                    <div className="bg-zinc-900 text-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative z-10 border border-zinc-800">
                        {/* الهيدر العلوي للمودال */}
                        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
                            <h3 className="text-xs font-bold tracking-wide text-zinc-400">
                                معاينة صورة العميل
                            </h3>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition text-zinc-400 hover:text-white"
                                title="إغلاق"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* حاوية عرض الصورة */}
                        <div className="p-6 flex items-center justify-center bg-zinc-950/40 border-b border-zinc-800">
                            <img
                                src={selectedImage}
                                alt="Customer Avatar Expanded"
                                className="max-h-[60vh] max-w-full rounded-lg object-contain shadow-md"
                            />
                        </div>

                        {/* شريط التحكم السفلي (نسخ + تنزيل) */}
                        <div
                            className="p-4 bg-zinc-900/80 flex items-center justify-end gap-2"
                            dir="rtl"
                        >
                            {/* زر نسخ الصورة */}
                            <button
                                onClick={() => handleCopyImage(selectedImage)}
                                disabled={isCopying}
                                className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 transition text-zinc-200 disabled:opacity-50"
                            >
                                <Copy className="w-4 h-4" />
                                {isCopying ? "جاري النسخ..." : "نسخ الصورة"}
                            </button>

                            {/* زر التنزيل الأخضر المريح للعين */}
                            <a
                                href={selectedImage}
                                download={`customer_image_${Date.now()}.png`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 transition"
                                title="تنزيل الصورة"
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
