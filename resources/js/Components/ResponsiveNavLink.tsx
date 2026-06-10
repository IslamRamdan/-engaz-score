import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active?: boolean }) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-700 focus:border-emerald-700 focus:bg-emerald-100 focus:text-emerald-800'
                    : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:border-zinc-700 hover:bg-gray-50 hover:text-zinc-800 dark:text-zinc-200 focus:border-zinc-300 dark:border-zinc-700 focus:bg-gray-50 focus:text-zinc-800 dark:text-zinc-200'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
