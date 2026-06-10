import { InputHTMLAttributes } from 'react';

export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-zinc-300 dark:border-zinc-700 text-emerald-600 shadow-sm focus:ring-emerald-500 ' +
                className
            }
        />
    );
}
