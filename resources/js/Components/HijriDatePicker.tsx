import React, { useState, useEffect } from "react";

interface HijriDatePickerProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    label?: string;
}

const HIJRI_MONTHS = [
    { value: "01", name: "محرم" },
    { value: "02", name: "صفر" },
    { value: "03", name: "ربيع الأول" },
    { value: "04", name: "ربيع الثاني" },
    { value: "05", name: "جمادى الأولى" },
    { value: "06", name: "جمادى الآخرة" },
    { value: "07", name: "رجب" },
    { value: "08", name: "شعبان" },
    { value: "09", name: "رمضان" },
    { value: "10", name: "شوال" },
    { value: "11", name: "ذو القعدة" },
    { value: "12", name: "ذو الحجة" },
];

// Dynamically compute today's Hijri date on module load
const todayHijri = (() => {
    try {
        const today = new Date();
        const formatter = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        const parts = formatter.formatToParts(today);
        const d = parts.find((p) => p.type === "day")?.value || "";
        const m = parts.find((p) => p.type === "month")?.value || "";
        const y = parts.find((p) => p.type === "year")?.value || "";
        return {
            day: d ? parseInt(d, 10) : 20,
            month: m ? parseInt(m, 10) : 12,
            year: y ? parseInt(y, 10) : 1447,
        };
    } catch (e) {
        // Fallback to safe defaults if Intl is not supported or errors out
        return { day: 20, month: 12, year: 1447 };
    }
})();

// Generate Hijri years list dynamically (from 1430 up to today's Hijri year only)
const HIJRI_YEARS = Array.from(
    { length: todayHijri.year - 1430 + 1 },
    (_, i) => String(1430 + i)
);

// Generate Hijri days list (01 to 30)
const HIJRI_DAYS = Array.from({ length: 30 }, (_, i) => String(i + 1).padStart(2, "0"));

export default function HijriDatePicker({
    value,
    onChange,
    error,
    label = "تاريخ الإصدار (هجري)"
}: HijriDatePickerProps) {
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    const selectedYearNum = year ? parseInt(year, 10) : null;
    const selectedMonthNum = month ? parseInt(month, 10) : null;

    // Filter months: if today's year is selected, only allow months up to today's month
    const filteredMonths = HIJRI_MONTHS.filter((m) => {
        if (selectedYearNum === todayHijri.year) {
            return parseInt(m.value, 10) <= todayHijri.month;
        }
        return true;
    });

    // Filter days: if today's year and month are selected, only allow days up to today's day
    const filteredDays = HIJRI_DAYS.filter((d) => {
        if (selectedYearNum === todayHijri.year && selectedMonthNum === todayHijri.month) {
            return parseInt(d, 10) <= todayHijri.day;
        }
        return true;
    });

    // Sync local state when prop value changes (e.g. during form edit or reset)
    useEffect(() => {
        if (value) {
            const parts = value.split("/");
            if (parts.length === 3) {
                setDay(parts[0]);
                setMonth(parts[1]);
                setYear(parts[2]);
                return;
            }
        }
        setDay("");
        setMonth("");
        setYear("");
    }, [value]);

    // Handle year selection and reset month/day if they exceed today's limits
    useEffect(() => {
        if (selectedYearNum === todayHijri.year) {
            if (selectedMonthNum && selectedMonthNum > todayHijri.month) {
                setMonth("");
                setDay("");
                triggerChange("", "", year);
                return;
            }
            const dNum = day ? parseInt(day, 10) : null;
            if (selectedMonthNum === todayHijri.month && dNum && dNum > todayHijri.day) {
                setDay("");
                triggerChange("", month, year);
            }
        }
    }, [year]);

    // Handle month selection and reset day if it exceeds today's limit
    useEffect(() => {
        if (selectedYearNum === todayHijri.year && selectedMonthNum === todayHijri.month) {
            const dNum = day ? parseInt(day, 10) : null;
            if (dNum && dNum > todayHijri.day) {
                setDay("");
                triggerChange("", month, year);
            }
        }
    }, [month]);

    const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDay = e.target.value;
        setDay(newDay);
        triggerChange(newDay, month, year);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = e.target.value;
        setMonth(newMonth);
        triggerChange(day, newMonth, year);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = e.target.value;
        setYear(newYear);
        triggerChange(day, month, newYear);
    };

    const triggerChange = (d: string, m: string, y: string) => {
        if (d && m && y) {
            onChange(`${d}/${m}/${y}`);
        } else {
            onChange("");
        }
    };

    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-600 dark:text-slate-400 mr-1">
                {label}
            </label>
            <div className="grid grid-cols-3 gap-2" dir="rtl">
                {/* اليوم */}
                <div>
                    <select
                        value={day}
                        onChange={handleDayChange}
                        className={`w-full text-center pr-2 pl-10 py-2.5 bg-zinc-50 dark:bg-gray-950 border dark:border-gray-700 rounded-xl text-[13px] text-zinc-900 dark:text-gray-100 transition-all focus:outline-hidden focus:ring-2 ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-zinc-200 focus:ring-emerald-500 focus:border-emerald-500"}`}
                    >
                        <option value="">اليوم</option>
                        {filteredDays.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>

                {/* الشهر */}
                <div>
                    <select
                        value={month}
                        onChange={handleMonthChange}
                        className={`w-full text-center pr-2 pl-10 py-2.5 bg-zinc-50 dark:bg-gray-950 border dark:border-gray-700 rounded-xl text-[13px] text-zinc-900 dark:text-gray-100 transition-all focus:outline-hidden focus:ring-2 ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-zinc-200 focus:ring-emerald-500 focus:border-emerald-500"}`}
                    >
                        <option value="">الشهر</option>
                        {filteredMonths.map((m) => (
                            <option key={m.value} value={m.value}>
                                {parseInt(m.value)} - {m.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* السنة */}
                <div>
                    <select
                        value={year}
                        onChange={handleYearChange}
                        className={`w-full text-center pr-2 pl-10 py-2.5 bg-zinc-50 dark:bg-gray-950 border dark:border-gray-700 rounded-xl text-[13px] text-zinc-900 dark:text-gray-100 transition-all focus:outline-hidden focus:ring-2 ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-zinc-200 focus:ring-emerald-500 focus:border-emerald-500"}`}
                    >
                        <option value="">السنة</option>
                        {HIJRI_YEARS.map((y) => (
                            <option key={y} value={y}>
                                {y} هـ
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* عرض التاريخ المحدد للمستخدم لتأكيد سهولة القراءة */}
            {day && month && year && (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mr-1 font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>التاريخ الهجري المختار: {day}/{month}/{year}</span>
                </div>
            )}

            {error && (
                <p className="text-red-500 text-[11px] mt-1 mr-1 font-semibold">
                    {error}
                </p>
            )}
        </div>
    );
}
