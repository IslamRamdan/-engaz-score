import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const errorText = "mt-1 block text-xs text-red-500";

/* ---------- بوب أب عرض الإيصال ---------- */
function ReceiptModal({
    src,
    title = "الإيصال",
    onClose,
}: {
    src: string;
    title?: string;
    onClose: () => void;
}) {
    const [broken, setBroken] = useState(false);
    const [copyState, setCopyState] = useState<"idle" | "done" | "error">(
        "idle",
    );

    // تحويل الصورة لـ PNG عشان الكليبورد بيقبل PNG بشكل مضمون
    const toPngBlob = async (): Promise<Blob> => {
        const res = await fetch(src);
        const blob = await res.blob();
        if (blob.type === "image/png") return blob;
        const bitmap = await createImageBitmap(blob);
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
        return new Promise<Blob>((resolve, reject) =>
            canvas.toBlob(
                (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
                "image/png",
            ),
        );
    };

    const copyImage = async () => {
        try {
            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": toPngBlob() }),
            ]);
            setCopyState("done");
        } catch {
            setCopyState("error");
        }
        setTimeout(() => setCopyState("idle"), 2000);
    };

    const downloadImage = async () => {
        try {
            const res = await fetch(src);
            const blob = await res.blob();
            let name = decodeURIComponent(
                src.split("?")[0].split("/").pop() || "",
            );
            if (!/\.[a-z0-9]+$/i.test(name)) {
                const ext = blob.type.split("/")[1] || "jpg";
                name = `receipt.${ext}`;
            }
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch {
            window.open(src, "_blank");
        }
    };

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [onClose]);

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            dir="rtl"
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
            >
                <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h4>
                    <div className="flex items-center gap-1">
                        {!broken && (
                            <>
                                <button
                                    type="button"
                                    onClick={copyImage}
                                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                                        copyState === "done"
                                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                            : copyState === "error"
                                              ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                                              : "text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                    }`}
                                >
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.8}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d={
                                                copyState === "done"
                                                    ? "M4.5 12.75l6 6 9-13.5"
                                                    : "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                                            }
                                        />
                                    </svg>
                                    {copyState === "done"
                                        ? "تم النسخ"
                                        : copyState === "error"
                                          ? "تعذّر النسخ"
                                          : "نسخ الصورة"}
                                </button>
                                <button
                                    type="button"
                                    onClick={downloadImage}
                                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                >
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.8}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                        />
                                    </svg>
                                    تنزيل
                                </button>
                            </>
                        )}
                        <a
                            href={src}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        >
                            فتح في تبويب جديد
                        </a>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="إغلاق"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-auto bg-gray-50 p-3 dark:bg-black/30">
                    {broken ? (
                        <p className="py-16 text-center text-sm text-gray-500 dark:text-neutral-400">
                            تعذّر تحميل صورة الإيصال
                        </p>
                    ) : (
                        <img
                            src={src}
                            alt={title}
                            onError={() => setBroken(true)}
                            className="mx-auto max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
                        />
                    )}
                </div>
            </div>
        </div>,
        document.body,
    );
}

/* صورة مصغرة بتفتح البوب أب لما تضغط عليها */
function ReceiptThumb({
    src,
    alt = "إيصال",
    className = "",
}: {
    src: string;
    alt?: string;
    className?: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="عرض الإيصال"
                className="block shrink-0 cursor-zoom-in"
            >
                <img
                    src={src}
                    alt={alt}
                    className={`rounded-lg object-cover transition hover:scale-110 ${className}`}
                />
            </button>
            {open && <ReceiptModal src={src} onClose={() => setOpen(false)} />}
        </>
    );
}

/* زرار عرض الإيصال في الجدول (بيتعطل لو مفيش إيصال) */
export function ReceiptButton({
    src,
    title,
}: {
    src?: string | null;
    title?: string;
}) {
    const [open, setOpen] = useState(false);

    if (!src) {
        return (
            <span
                title="مفيش إيصال للقيد ده"
                className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-dashed border-gray-200 px-2.5 py-1.5 text-xs text-gray-400 dark:border-neutral-700 dark:text-neutral-600"
            >
                مفيش إيصال
            </span>
        );
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/30"
            >
                <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
                عرض الإيصال
            </button>
            {open && (
                <ReceiptModal
                    src={src}
                    title={title}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}

/* ---------- رفع الإيصال (اختيار / سحب وإفلات / لصق) ---------- */
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function ReceiptUpload({
    value,
    onChange,
    error,
}: {
    value: File | null;
    onChange: (file: File | null) => void;
    error?: string;
}) {
    const [dragging, setDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dragDepth = useRef(0);

    // معاينة الصورة + تنضيف الـ URL
    useEffect(() => {
        if (!value) {
            setPreview(null);
            if (inputRef.current) inputRef.current.value = "";
            return;
        }
        const url = URL.createObjectURL(value);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [value]);

    const accept = (file: File | undefined | null) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setLocalError("لازم الملف يكون صورة");
            return;
        }
        if (file.size > MAX_SIZE) {
            setLocalError("حجم الصورة لازم يكون أقل من 5 ميجا");
            return;
        }
        setLocalError(null);
        onChange(file);
    };

    // اللصق (Ctrl+V) من أي مكان في الصفحة
    useEffect(() => {
        const handler = (e: ClipboardEvent) => {
            const file = Array.from(e.clipboardData?.files ?? []).find((f) =>
                f.type.startsWith("image/"),
            );
            if (!file) return; // لو نص عادي سيبه يتلصق طبيعي
            e.preventDefault();
            accept(file);
        };
        document.addEventListener("paste", handler);
        return () => document.removeEventListener("paste", handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        dragDepth.current = 0;
        setDragging(false);
        accept(e.dataTransfer.files?.[0]);
    };

    const shownError = localError || error;

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => accept(e.target.files?.[0])}
            />

            {preview ? (
                <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-800">
                    <ReceiptThumb
                        src={preview}
                        alt="الإيصال"
                        className="h-14 w-14"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                        <p className="truncate font-medium text-gray-800 dark:text-neutral-200">
                            {value?.name}
                        </p>
                        <p className="text-gray-500 dark:text-neutral-400">
                            {value ? (value.size / 1024).toFixed(0) : 0} ك.ب
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        aria-label="إزالة الصورة"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            ) : (
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => inputRef.current?.click()}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            inputRef.current?.click();
                        }
                    }}
                    onDragEnter={(e) => {
                        e.preventDefault();
                        dragDepth.current++;
                        setDragging(true);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDragLeave={() => {
                        dragDepth.current--;
                        if (dragDepth.current <= 0) setDragging(false);
                    }}
                    onDrop={onDrop}
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed px-3 py-3 text-center text-xs transition ${
                        dragging
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                            : shownError
                              ? "border-red-400 text-red-500"
                              : "border-gray-300 text-gray-500 hover:border-emerald-500 hover:bg-emerald-500/5 dark:border-neutral-700 dark:text-neutral-400"
                    }`}
                >
                    <svg
                        className="h-5 w-5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.6}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z"
                        />
                    </svg>
                    <span>
                        {dragging
                            ? "سيب الصورة هنا"
                            : "اسحب الصورة هنا، أو الصقها (Ctrl+V)، أو اضغط للاختيار"}
                    </span>
                </div>
            )}

            {shownError && <span className={errorText}>{shownError}</span>}
        </div>
    );
}
