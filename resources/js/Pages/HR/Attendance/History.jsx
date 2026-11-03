import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, CalendarDays, Check, Pencil, X } from 'lucide-react';

const statusOptions = [
    ['present', 'Present'],
    ['late', 'Late'],
    ['half_day', 'Half day'],
    ['absent', 'Absent'],
    ['on_leave', 'On leave'],
    ['holiday', 'Holiday'],
];
const statusStyles = {
    present: 'bg-emerald-50 text-emerald-700',
    late: 'bg-amber-50 text-amber-700',
    half_day: 'bg-blue-50 text-blue-700',
    absent: 'bg-red-50 text-red-700',
    on_leave: 'bg-purple-50 text-purple-700',
    holiday: 'bg-gray-100 text-gray-700',
};

function AttendanceRow({ attendance }) {
    const [editing, setEditing] = useState(false);
    const form = useForm({
        status: attendance.status,
        clock_in: attendance.clock_in?.slice(0, 5) || '',
        clock_out: attendance.clock_out?.slice(0, 5) || '',
        total_hours: attendance.total_hours ?? 0,
        notes: attendance.notes || '',
    });

    const save = (event) => {
        event.preventDefault();
        form.put(`/attendance/${attendance.id}`, { onSuccess: () => setEditing(false) });
    };

    return (
        <tr className="align-top">
            <td className="px-4 py-3">
                <p className="font-semibold text-gray-900">{attendance.employee?.full_name}</p>
                <p className="mt-0.5 text-xs text-gray-500">{attendance.employee?.employee_code} · {attendance.employee?.department?.name || 'General'}</p>
            </td>
            {editing ? (
                <td colSpan="5" className="px-4 py-3">
                    <form onSubmit={save} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                        <label className="text-xs font-semibold text-gray-600">
                            Status
                            <select value={form.data.status} onChange={(event) => form.setData('status', event.target.value)} className="mt-1 block w-full rounded-lg border-gray-300 text-sm">
                                {statusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                            </select>
                        </label>
                        <label className="text-xs font-semibold text-gray-600">
                            Clock in
                            <input type="time" value={form.data.clock_in} onChange={(event) => form.setData('clock_in', event.target.value)} className="mt-1 block w-full rounded-lg border-gray-300 text-sm" />
                        </label>
                        <label className="text-xs font-semibold text-gray-600">
                            Clock out
                            <input type="time" value={form.data.clock_out} onChange={(event) => form.setData('clock_out', event.target.value)} className="mt-1 block w-full rounded-lg border-gray-300 text-sm" />
                        </label>
                        <label className="text-xs font-semibold text-gray-600">
                            Hours
                            <input type="number" min="0" max="24" step="0.25" value={form.data.total_hours} onChange={(event) => form.setData('total_hours', event.target.value)} className="mt-1 block w-full rounded-lg border-gray-300 text-sm" />
                        </label>
                        <label className="text-xs font-semibold text-gray-600">
                            Notes
                            <input value={form.data.notes} onChange={(event) => form.setData('notes', event.target.value)} className="mt-1 block w-full rounded-lg border-gray-300 text-sm" />
                        </label>
                        <div className="flex gap-2 md:col-span-2 xl:col-span-5">
                            <button disabled={form.processing} className="inline-flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"><Check className="h-4 w-4" /> Save changes</button>
                            <button type="button" onClick={() => setEditing(false)} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700"><X className="h-4 w-4" /> Cancel</button>
                            {form.errors.status && <span className="self-center text-xs text-red-600">{form.errors.status}</span>}
                        </div>
                    </form>
                </td>
            ) : (
                <>
                    <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[attendance.status] || statusStyles.holiday}`}>
                            {statusOptions.find(([value]) => value === attendance.status)?.[1] || attendance.status}
                        </span>
                        {attendance.is_corrected && <p className="mt-1 text-[10px] text-gray-500">Corrected{attendance.corrected_by_user?.name ? ` by ${attendance.corrected_by_user.name}` : ''}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{attendance.clock_in?.slice(0, 5) || '—'} – {attendance.clock_out?.slice(0, 5) || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{Number(attendance.total_hours || 0).toFixed(2)} hrs</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{attendance.notes || '—'}</td>
                    <td className="px-4 py-3">
                        <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                            <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                    </td>
                </>
            )}
        </tr>
    );
}

export default function History({ selectedDate, dateLabel, attendances, stats }) {
    const changeDate = (date) => router.get('/attendance/history', { date }, { preserveState: true });

    return (
        <AdminLayout title="Attendance History">
            <Head title={`Attendance History - ${dateLabel}`} />
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/attendance/calendar" className="hover:text-orange-700">Calendar</Link><span>/</span><span>History</span>
                    </div>
                    <h1 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">Saved Attendance History</h1>
                    <p className="mt-1 text-sm text-gray-500">{dateLabel} · {stats.records} saved {stats.records === 1 ? 'record' : 'records'}</p>
                </div>
                <Link href="/attendance/calendar" className="inline-flex items-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                    <ArrowLeft className="h-4 w-4" /> Monthly Calendar
                </Link>
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <label htmlFor="history-date" className="flex items-center gap-2 text-sm font-semibold text-gray-700"><CalendarDays className="h-4 w-4 text-orange-600" />Choose date</label>
                <input id="history-date" type="date" value={selectedDate} onChange={(event) => changeDate(event.target.value)} className="rounded-lg border-gray-300 text-sm" />
                <div className="flex flex-wrap gap-2 text-xs">
                    {statusOptions.map(([key, label]) => stats[key] > 0 && (
                        <span key={key} className={`rounded-full px-2.5 py-1 font-semibold ${statusStyles[key]}`}>{label}: {stats[key]}</span>
                    ))}
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {attendances.length ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 text-left">
                            <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Employee</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Clock In / Out</th><th className="px-4 py-3">Work Hours</th><th className="px-4 py-3">Notes</th><th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {attendances.map((attendance) => <AttendanceRow key={attendance.id} attendance={attendance} />)}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-6 py-14 text-center">
                        <CalendarDays className="mx-auto h-10 w-10 text-gray-300" />
                        <h2 className="mt-3 font-bold text-gray-800">No saved attendance for this day</h2>
                        <p className="mt-1 text-sm text-gray-500">Saved records for other dates remain available in the calendar.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
