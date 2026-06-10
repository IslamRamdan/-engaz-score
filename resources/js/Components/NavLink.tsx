import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-emerald-400 text-zinc-900 dark:text-zinc-100 focus:border-emerald-700'
                    : 'border-transparent text-gray-500 hover:border-zinc-300 dark:border-zinc-700 hover:text-zinc-700 dark:text-zinc-300 focus:border-zinc-300 dark:border-zinc-700 focus:text-zinc-700 dark:text-zinc-300') +
                className
            }
        >
            {children}
        </Link>
    );
}
