import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode, useState } from "react";

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        // الاتجاه الافتراضي يدعم العربية، والخلفية رمادي ناعم فاخر جداً
        <div className="min-h-screen bg-zinc-50 text-zinc-900" dir="rtl">
            <nav className="border-b border-zinc-200 bg-white sticky top-0 z-50 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        {/* الجهة اليمنى: الشعار وروابط التنقل الأساسية */}
                        <div className="flex items-center gap-8">
                            <div className="flex shrink-0 items-center">
                                <Link href={route("dashboard")}>
                                    {/* شعار الهوية ممرر بلون النظام الموحد */}
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-[#006C35]" />
                                </Link>
                            </div>

                            {/* الروابط العلوية للشاشات الكبيرة (تم تعديل المسافات لتناسب الـ RTL) */}
                            <div className="hidden sm:flex sm:items-center sm:gap-6 h-16">
                                <NavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                    className="h-full inline-flex items-center text-sm font-bold transition-colors"
                                >
                                    لوحة التحكم
                                </NavLink>
                            </div>
                        </div>

                        {/* الجهة اليسرى: قائمة الحساب الشخصي المنسدلة */}
                        <div className="hidden sm:flex sm:items-center">
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-xl">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-zinc-700 transition duration-150 ease-in-out hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#006C35]/15"
                                            >
                                                <span className="w-2 h-2 rounded-full bg-[#006C35]" />
                                                {user.name}

                                                <svg
                                                    className="h-4 w-4 text-zinc-400 mr-1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content align="left">
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                            className="text-right text-sm font-medium block w-full px-4 py-2 hover:bg-zinc-50"
                                        >
                                            الملف الشخصي
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="text-right text-sm font-bold block w-full px-4 py-2 text-red-600 hover:bg-red-50"
                                        >
                                            تسجيل الخروج
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* زر القائمة للشاشات الصغيرة الجوالة */}
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-xl p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus:bg-zinc-100 focus:text-zinc-800 focus:outline-none transition duration-150"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* قائمة التنقل المنسدلة المخصصة للجوال والتابلت */}
                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden border-t border-zinc-100 bg-white"
                    }
                >
                    <div className="space-y-1 pb-3 pt-2 px-2">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                            className="rounded-xl font-bold"
                        >
                            لوحة التحكم
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-zinc-200 pb-3 pt-4 px-4">
                        <div>
                            <div className="text-base font-black text-zinc-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-zinc-400 mt-0.5">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink
                                href={route("profile.edit")}
                                className="rounded-xl"
                            >
                                الملف الشخصي
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                                className="rounded-xl text-red-600 font-bold text-right w-full"
                            >
                                تسجيل الخروج
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* الهيدر أو العنوان الفرعي للصفحات الداخلية */}
            {header && (
                <header className="bg-white border-b border-zinc-200/60 shadow-sm shadow-zinc-100/40">
                    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* محتوى الصفحات الرئيسي */}
            <main className="relative z-10">{children}</main>
        </div>
    );
}
