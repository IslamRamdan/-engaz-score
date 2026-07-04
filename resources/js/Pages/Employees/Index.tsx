import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import EmployeeForm from "./Partials/EmployeeForm";

interface Employee {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: "owner" | "admin" | "employee"; // إضافة الصلاحية هنا للـ TypeScript
    is_active: boolean | number;
    created_at: string;
}

interface Props {
    employees: Employee[];
}

export default function Index({ employees }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
        null,
    );
    const [searchTerm, setSearchTerm] = useState("");

    // تصفية الموظفين بناءً على الاسم أو البريد الإلكتروني أو الهاتف
    const filteredEmployees = employees.filter(
        (e) =>
            e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (e.phone && e.phone.includes(searchTerm)),
    );

    const openCreateModal = () => {
        setSelectedEmployee(null);
        setIsModalOpen(true);
    };

    const openEditModal = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    const deleteEmployee = (id: number) => {
        if (
            confirm(
                "هل أنت متأكد من حذف هذا الموظف؟ لا يمكن التراجع عن هذا الإجراء.",
            )
        ) {
            router.delete(route("employees.destroy", id));
        }
    };

    // دالة مساعدة لتنسيق شارات الصلاحية بألوان مختلفة ونصوص عربية واضحة
    const renderRoleBadge = (role: Employee["role"]) => {
        switch (role) {
            case "owner":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/50">
                        مالك المنشأة
                    </span>
                );
            case "admin":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                        مدير نظام
                    </span>
                );
            case "employee":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50">
                        موظف
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <AppLayout>
            <Head title="إدارة الموظفين" />

            <div className="max-w-7xl mx-auto py-4 px-2 md:py-8" dir="rtl">
                {/* الرأس والإجراءات */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                            إدارة الموظفين
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                            عرض ومتابعة كافة الموظفين المسجلين في الشركة وإدارة
                            صلاحيات وصولهم وحالة حساباتهم
                        </p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-xs hover:shadow-md shadow-emerald-100/50 dark:shadow-none cursor-pointer"
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
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        إضافة موظف جديد
                    </button>
                </div>

                {/* شريط البحث */}
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm mb-6">
                    <div className="relative max-w-md">
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-zinc-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="بحث باسم الموظف، البريد، أو رقم الهاتف..."
                            className="w-full pr-10 pl-4 py-2 bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* جدول البيانات */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                    الموظف
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                    رقم الهاتف
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-center">
                                    الصلاحية
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-center">
                                    حالة الحساب
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-center">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {filteredEmployees.length > 0 ? (
                                filteredEmployees.map((employee) => (
                                    <tr
                                        key={employee.id}
                                        className="hover:bg-zinc-50/30 dark:hover:bg-zinc-800/30 transition-colors"
                                    >
                                        {/* عمود الموظف */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
                                                    👤
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">
                                                        {employee.name}
                                                    </span>
                                                    <span
                                                        className="text-xs text-zinc-400 dark:text-zinc-500"
                                                        dir="ltr"
                                                    >
                                                        {employee.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* عمود رقم الهاتف */}
                                        <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300 font-medium">
                                            {employee.phone ? (
                                                <span dir="ltr">
                                                    {employee.phone}
                                                </span>
                                            ) : (
                                                <span className="text-zinc-400 dark:text-zinc-600 italic text-xs">
                                                    لا يوجد
                                                </span>
                                            )}
                                        </td>

                                        {/* عمود الصلاحية المضاف حديثاً */}
                                        <td className="px-6 py-4 text-center">
                                            {renderRoleBadge(employee.role)}
                                        </td>

                                        {/* عمود حالة الحساب */}
                                        <td className="px-6 py-4 text-center">
                                            {employee.is_active ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    نشط
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200/50 dark:border-red-800/50">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                    معطل
                                                </span>
                                            )}
                                        </td>

                                        {/* الأزرار والعمليات */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(employee)
                                                    }
                                                    className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-all"
                                                    title="تعديل"
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
                                                            strokeWidth="2"
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                        />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteEmployee(
                                                            employee.id,
                                                        )
                                                    }
                                                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-all"
                                                    title="حذف"
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
                                                            strokeWidth="2"
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5} // تم تعديلها لتصبح 5 لتغطية العمود الجديد
                                        className="px-6 py-12 text-center text-zinc-400 text-sm italic"
                                    >
                                        لا يوجد موظفين مسجلين حالياً يتطابقون مع
                                        البحث..
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* الفُورم المنبثق المعدل للموظفين */}
            <EmployeeForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                employee={selectedEmployee}
            />
        </AppLayout>
    );
}
