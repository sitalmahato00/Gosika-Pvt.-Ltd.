import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const statusStyles = {
    present: 'text-emerald-700 bg-emerald-50',
    late: 'text-amber-700 bg-amber-50',
    half_day: 'text-blue-700 bg-blue-50',
    absent: 'text-red-700 bg-red-50',
    on_leave: 'text-purple-700 bg-purple-50',
    holiday: 'text-gray-600 bg-gray-100',
};
const statusLabels = {
    present: 'Present',
    late: 'Late',
    half_day: 'Half day',
    absent: 'Absent',
    on_leave: 'On leave',
    holiday: 'Holiday',
};

export default function Calendar({ month, year, monthName, daySummaries, daysInMonth, leadingDays }) {
    const changeMonth = (offset) => {
        const next = new Date(year, month - 1 + offset, 1);
        router.get('/attendance/calendar', {
            month: next.getMonth() + 1,
            year: next.getFullYear(),
        }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AdminLayout title="Attendance Calendar">
            <Head title="Monthly Attendance Calendar" />
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">Monthly Attendance Calendar</h1>
                    <p className="mt-1 text-sm text-gray-500">Select a day to review and edit saved attendance history.</p>
                </div>
                <Link href="/attendance" className="inline-flex items-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                    <ArrowLeft className="h-4 w-4" /> Daily Attendance
                </Link>
            </div>

            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6">
                    <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                        <CalendarDays className="h-5 w-5 text-orange-600" /> {monthName}
                    </h2>
                    <button type="button" onClick={() => changeMonth(1)} aria-label="Next month" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
                <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
                    {weekdays.map((day) => (
                        <div key={day} className="py-2 text-center text-xs font-bold uppercase tracking-wide text-gray-500">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {Array.from({ length: leadingDays }, (_, index) => (
                        <div key={`blank-${index}`} className="min-h-24 border-b border-r border-gray-100 bg-gray-50/50 sm:min-h-32" />
                    ))}
                    {Array.from({ length: daysInMonth }, (_, index) => {
                        const day = index + 1;
                        const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const summary = daySummaries[date];
                        return (
                            <div key={date} className="min-h-24 border-b border-r border-gray-100 p-1.5 sm:min-h-32 sm:p-2">
                                <div className="mb-1 flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-800 sm:text-sm">{day}</span>
                                    {summary && <span className="rounded-full bg-orange-50 px-1.5 py-0.5 text-[9px] font-bold text-orange-700 sm:text-[10px]">
                                        {summary.records} {summary.records === 1 ? 'record' : 'records'}
                                    </span>}
                                </div>
                                {summary ? (
                                    <Link href={`/attendance/history?date=${date}`} className="block rounded-lg border border-gray-100 p-1.5 transition hover:border-orange-200 hover:bg-orange-50/50 sm:p-2">
                                        <div className="space-y-1">
                                            {Object.entries(statusLabels).map(([key, label]) => summary[key] > 0 && (
                                                <div key={key} className="flex items-center justify-between gap-1">
                                                    <span className={`truncate rounded px-1 py-0.5 text-[9px] font-semibold sm:text-[10px] ${statusStyles[key]}`}>{label}</span>
                                                    <span className="text-[10px] font-bold text-gray-700">{summary[key]}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <span className="mt-2 block text-[9px] font-bold text-orange-700 sm:text-[10px]">View history →</span>
                                    </Link>
                                ) : (
                                    <p className="mt-3 text-center text-[10px] text-gray-300">No records</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </AdminLayout>
    );
}
