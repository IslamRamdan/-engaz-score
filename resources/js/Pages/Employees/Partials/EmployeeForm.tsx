import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";

// 1. تحديث نوع البيانات لتشمل حقول منصة إنجاز الجديدة
interface Employee {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    is_active: boolean | number;
    role: "owner" | "admin" | "employee";
    engaz_email: string | null; // تمت الإضافة هنا
    engaz_password: string | null; // تمت الإضافة هنا
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    employee: Employee | null;
    roles?: Record<string, string>; // كائن اختياري لمنع الانهيار
}

export default function EmployeeForm({
    isOpen,
    onClose,
    employee,
    roles = {},
}: Props) {
    // 2. إعداد الحقول بالقيم الافتراضية لمنع مشاكل الـ Uncontrolled Inputs
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
            email: "",
            phone: "",
            password: "",
            password_confirmation: "",
            is_active: true,
            role: "employee", // القيمة الافتراضية للـ enum عند الإضافة
            engaz_email: "", // تمت الإضافة هنا
            engaz_password: "", // تمت الإضافة هنا
        });

    // 3. مراقبة فتح المودال لتعبئة البيانات الجديدة في حال التعديل
    useEffect(() => {
        if (employee) {
            setData({
                name: employee.name,
                email: employee.email,
                phone: employee.phone || "",
                password: "",
                password_confirmation: "",
                is_active: Boolean(employee.is_active),
                role: employee.role,
                engaz_email: employee.engaz_email || "", // تمت الإضافة هنا
                engaz_password: employee.engaz_password || "", // تمت الإضافة هنا
            });
        } else {
            reset();
        }
        clearErrors();
    }, [employee, isOpen]);

    if (!isOpen) return null;

    // معالجة إرسال النموذج (إضافة أو تحديث)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (employee) {
            put(route("employees.update", employee.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route("employees.store"), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/65 backdrop-blur-sm"
            dir="rtl"
        >
            <div className="bg-white dark:bg-zinc-950 w-full max-w-xl rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col font-sans">
                {/* رأس النافذة المنبثقة */}
                <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/70 dark:bg-zinc-900/40">
                    <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                        {employee
                            ? "تعديل بيانات وصلاحيات الموظف"
                            : "إضافة موظف جديد للمنشأة"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-300 transition-all"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* استمارة البيانات */}
                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-4 overflow-y-auto flex-1"
                >
                    {/* الاسم الكامل */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                            اسم الموظف الثلاثي أو الكامل
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className={`w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-zinc-100 outline-none transition-all ${errors.name ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"}`}
                            placeholder="سلطان بن عبد الله العتيبي"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1 font-semibold">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* البريد الإلكتروني الرسمي */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                            البريد الإلكتروني المهني
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className={`w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-zinc-100 outline-none transition-all ${errors.email ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"}`}
                            placeholder="s.alotaibi@company.com.sa"
                            dir="ltr"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1 font-semibold">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* ================= قسم حقول إنجاز الجديدة ================= */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-zinc-100 dark:border-zinc-800/50 py-4 my-2">
                        {/* بريد إنجاز الإلكتروني */}
                        <div>
                            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                بريد منصة إنجاز (engaz_email)
                            </label>
                            <input
                                type="text"
                                value={data.engaz_email}
                                onChange={(e) =>
                                    setData("engaz_email", e.target.value)
                                }
                                className={`w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-zinc-100 outline-none transition-all ${errors.engaz_email ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"}`}
                                placeholder="engaz.user"
                                dir="ltr"
                            />
                            {errors.engaz_email && (
                                <p className="text-red-500 text-xs mt-1 font-semibold">
                                    {errors.engaz_email}
                                </p>
                            )}
                        </div>

                        {/* كلمة مرور إنجاز (نص عادي) */}
                        <div>
                            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                كلمة مرور منصة إنجاز (engaz_password)
                            </label>
                            <input
                                type="text"
                                value={data.engaz_password}
                                onChange={(e) =>
                                    setData("engaz_password", e.target.value)
                                }
                                className={`w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-zinc-100 outline-none transition-all ${errors.engaz_password ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"}`}
                                placeholder="كلمة المرور النصية"
                                dir="ltr"
                            />
                            {errors.engaz_password && (
                                <p className="text-red-500 text-xs mt-1 font-semibold">
                                    {errors.engaz_password}
                                </p>
                            )}
                        </div>
                    </div>
                    {/* ========================================================= */}

                    {/* رقم الجوال السعودي */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                            رقم الجوال
                        </label>
                        <input
                            type="tel"
                            maxLength={11}
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            className={`w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-zinc-100 outline-none transition-all ${errors.phone ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"}`}
                            placeholder="05xxxxxxxx"
                            dir="ltr"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1 font-semibold">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* مرتبة الصلاحية والدور */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                            مرتبة الصلاحية بالنظام (الدور)
                        </label>
                        <select
                            value={data.role}
                            onChange={(e) =>
                                setData("role", e.target.value as any)
                            }
                            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-zinc-100 outline-none transition-all cursor-pointer font-medium"
                        >
                            {Object.entries(roles).length > 0 ? (
                                Object.entries(roles).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))
                            ) : (
                                <>
                                    <option value="owner">
                                        مالك المنشأة / المدير العام (Owner)
                                    </option>
                                    <option value="admin">
                                        مدير النظام (Admin)
                                    </option>
                                    <option value="employee">
                                        موظف قياسي (Employee)
                                    </option>
                                </>
                            )}
                        </select>
                        {errors.role && (
                            <p className="text-red-500 text-xs mt-1 font-semibold">
                                {errors.role}
                            </p>
                        )}
                    </div>

                    {/* حقول كلمة المرور وتأكيد الحماية للنظام الأساسي */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                كلمة المرور الشخصية{" "}
                                {employee && "(اتركها فارغة لعدم التغيير)"}
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className={`w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-zinc-100 outline-none transition-all ${errors.password ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"}`}
                                dir="ltr"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1 font-semibold">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                تأكيد كلمة المرور الشخصية
                            </label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-zinc-100 outline-none transition-all"
                                dir="ltr"
                            />
                        </div>
                    </div>

                    {/* حالة تفعيل الحساب وحظر الوصول */}
                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="modal_is_active"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData("is_active", e.target.checked)
                            }
                            className="w-4 h-4 text-blue-600 border-zinc-300 dark:border-zinc-700 rounded focus:ring-blue-500 bg-zinc-50 dark:bg-zinc-900 cursor-pointer"
                        />
                        <label
                            htmlFor="modal_is_active"
                            className="text-sm font-bold text-zinc-700 dark:text-zinc-300 select-none cursor-pointer"
                        >
                            تمكين الموظف ومصادقة دخوله للبوابة الإلكترونية
                        </label>
                    </div>

                    {/* أزرار الإجراءات */}
                    <div className="flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                        >
                            إلغاء التغيير
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm disabled:opacity-50 transition-colors"
                        >
                            {processing
                                ? "جاري حفظ البيانات..."
                                : "اعتماد وحفظ"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
