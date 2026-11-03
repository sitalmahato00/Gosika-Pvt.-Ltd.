import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ChevronLeft, ChevronRight, CalendarCheck, ArrowLeft } from 'lucide-react';

export default function CalendarView({ month, year, monthName, attendances, daysInMonth }) {
    const handlePrevMonth = () => {
        let newMonth = month - 1;
        let newYear = year;
        if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
        }
        router.get('/attendance/calendar', { month: newMonth, year: newYear });
    };

    const handleNextMonth = () => {
        let newMonth = month + 1;
        let newYear = year;
        if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        }
        router.get('/attendance/calendar', { month: newMonth, year: newYear });
    };

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <AdminLayout title="Attendance Calendar">
            <Head title={`Attendance Calendar - ${monthName}`} />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <Link href="/attendance" className="text-xs font-semibold text-gray-500 hover:text-[#FF5500]">
                        &larr; Back to Daily Ledger
                    </Link>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight mt-1">
                        Monthly Attendance Calendar
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrevMonth}
                        className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-2xs"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-bold text-gray-800 min-w-32 text-center">{monthName}</span>
                    <button
                        onClick={handleNextMonth}
                        className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-2xs"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                    {daysArray.map((dayNum) => {
                        const dateString = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                        const dayAttendances = attendances.filter((a) => a.date === dateString);

                        const presentCount = dayAttendances.filter((a) => a.status === 'present').length;
                        const lateCount = dayAttendances.filter((a) => a.status === 'late').length;
                        const absentCount = dayAttendances.filter((a) => a.status === 'absent' || a.status === 'on_leave').length;

                        return (
                            <div
                                key={dayNum}
                                className="min-h-24 p-2.5 rounded-xl border border-gray-100 bg-[#F7F8FA]/70 flex flex-col justify-between hover:border-[#FFD6C0] transition"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black text-gray-900">{dayNum}</span>
                                    <span className="text-[10px] text-gray-400 font-mono">
                                        {dayAttendances.length} recs
                                    </span>
                                </div>

                                <div className="space-y-1 my-1">
                                    {presentCount > 0 && (
                                        <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                            {presentCount} Present
                                        </div>
                                    )}
                                    {lateCount > 0 && (
                                        <div className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                                            {lateCount} Late
                                        </div>
                                    )}
                                    {absentCount > 0 && (
                                        <div className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
                                            {absentCount} Absent/Leave
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href={`/attendance?date=${dateString}`}
                                    className="text-[10px] font-bold text-[#FF5500] hover:underline block text-right"
                                >
                                    Inspect Day &rarr;
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AdminLayout>
    );
}
