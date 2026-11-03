import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ChevronLeft, ChevronRight, Video, Palmtree, Clock, CheckSquare } from 'lucide-react';

export default function CalendarView({ month, year, monthName, events, daysInMonth }) {
    const handlePrevMonth = () => {
        let newMonth = month - 1;
        let newYear = year;
        if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
        }
        router.get('/calendar', { month: newMonth, year: newYear });
    };

    const handleNextMonth = () => {
        let newMonth = month + 1;
        let newYear = year;
        if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        }
        router.get('/calendar', { month: newMonth, year: newYear });
    };

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <AdminLayout title="Master Calendar">
            <Head title={`Master Calendar - ${monthName}`} />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Unified Master Operations Calendar
                    </h1>
                    <p className="text-xs text-[#6B7280]">
                        Combined timetable of meetings, official holidays, staff leaves, and project deadlines
                    </p>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {daysArray.map((dayNum) => {
                        const dateString = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                        const dayEvents = events.filter((e) => {
                            if (e.endDate) {
                                return dateString >= e.date && dateString <= e.endDate;
                            }
                            return e.date === dateString;
                        });

                        return (
                            <div
                                key={dayNum}
                                className="min-h-28 p-2.5 rounded-xl border border-gray-100 bg-[#F7F8FA]/60 flex flex-col justify-between hover:border-[#FFD6C0] hover:bg-white transition"
                            >
                                <div className="flex items-center justify-between pb-1">
                                    <span className="text-xs font-black text-gray-900">{dayNum}</span>
                                    {dayEvents.length > 0 && (
                                        <span className="text-[9px] font-bold text-[#FF5500] bg-[#FFF0E8] px-1.5 py-0.2 rounded-full">
                                            {dayEvents.length}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-1.5 my-1 overflow-y-auto max-h-24">
                                    {dayEvents.map((evt) => (
                                        <div
                                            key={evt.id}
                                            className={`p-1.5 rounded-lg text-[10px] font-semibold leading-tight flex items-start gap-1 ${
                                                evt.type === 'meeting'
                                                    ? 'bg-blue-50 text-blue-800 border border-blue-100'
                                                    : evt.type === 'holiday'
                                                    ? 'bg-amber-50 text-amber-800 border border-amber-100'
                                                    : evt.type === 'leave'
                                                    ? 'bg-purple-50 text-purple-800 border border-purple-100'
                                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                                            }`}
                                        >
                                            {evt.type === 'meeting' && <Video className="h-3 w-3 shrink-0 text-blue-600 mt-0.5" />}
                                            {evt.type === 'holiday' && <Palmtree className="h-3 w-3 shrink-0 text-amber-600 mt-0.5" />}
                                            {evt.type === 'leave' && <Clock className="h-3 w-3 shrink-0 text-purple-600 mt-0.5" />}
                                            {evt.type === 'task' && <CheckSquare className="h-3 w-3 shrink-0 text-emerald-600 mt-0.5" />}
                                            <span className="truncate">{evt.title}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-[9px] text-gray-400 font-mono text-right">
                                    {dateString}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AdminLayout>
    );
}
