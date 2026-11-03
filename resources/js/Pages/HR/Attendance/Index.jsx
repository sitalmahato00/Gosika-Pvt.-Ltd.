import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/Badge';
import {
    CalendarCheck,
    Calendar,
    Download,
    CheckCircle,
    XCircle,
    Clock,
    Sun,
    Save,
    Filter
} from 'lucide-react';

export default function Index({
    selectedDate,
    departmentId,
    employees,
    attendances,
    departments,
    stats
}) {
    const [date, setDate] = useState(selectedDate);
    const [dept, setDept] = useState(departmentId || '');

    // State for local attendance status editing
    const [records, setRecords] = useState(() => {
        const initial = {};
        employees.forEach((emp) => {
            const existing = attendances[emp.id];
            initial[emp.id] = {
                employee_id: emp.id,
                status: existing ? existing.status : 'present',
                clock_in: existing?.clock_in || '09:00',
                clock_out: existing?.clock_out || '17:30',
                total_hours: existing ? existing.total_hours : 8.5,
                notes: existing?.notes || '',
            };
        });
        return initial;
    });

    const handleDateChange = (newDate) => {
        setDate(newDate);
        router.get('/attendance', { date: newDate, department_id: dept }, { preserveState: true });
    };

    const handleDeptChange = (newDept) => {
        setDept(newDept);
        router.get('/attendance', { date, department_id: newDept }, { preserveState: true });
    };

    const setStatusForEmployee = (empId, status) => {
        setRecords((prev) => ({
            ...prev,
            [empId]: {
                ...prev[empId],
                status,
                clock_in: status === 'present' || status === 'late' ? '09:00' : null,
                clock_out: status === 'present' || status === 'late' ? '17:30' : null,
                total_hours: status === 'present' ? 8.5 : status === 'half_day' ? 4.0 : 0.0,
            },
        }));
    };

    const markAllPresent = () => {
        const updated = { ...records };
        employees.forEach((emp) => {
            updated[emp.id] = {
                ...updated[emp.id],
                status: 'present',
                clock_in: '09:00',
                clock_out: '17:30',
                total_hours: 8.5,
            };
        });
        setRecords(updated);
    };

    const handleSaveBatch = () => {
        router.post('/attendance/batch', {
            date,
            records: Object.values(records),
        });
    };

    return (
        <AdminLayout title="Attendance Management">
            <Head title="Daily Attendance" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Daily Attendance Ledger
                    </h1>
                    <p className="text-xs text-[#6B7280]">
                        Record daily staff check-ins, punctuality, and work hours
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <Link
                        href="/attendance/calendar"
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-2xs transition"
                    >
                        <Calendar className="h-4 w-4" />
                        <span>Monthly Calendar View</span>
                    </Link>
                    <a
                        href="/attendance/export-csv"
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-2xs transition"
                    >
                        <Download className="h-4 w-4" />
                        <span>Export CSV</span>
                    </a>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Staff</span>
                    <p className="text-lg font-black text-gray-900 mt-0.5">{stats.total}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs text-center">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Present</span>
                    <p className="text-lg font-black text-emerald-600 mt-0.5">{stats.present}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs text-center">
                    <span className="text-[10px] font-bold text-amber-600 uppercase">Late</span>
                    <p className="text-lg font-black text-amber-600 mt-0.5">{stats.late}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-2xs text-center">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Half Day</span>
                    <p className="text-lg font-black text-blue-600 mt-0.5">{stats.half_day}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-red-200 shadow-2xs text-center">
                    <span className="text-[10px] font-bold text-red-600 uppercase">Absent</span>
                    <p className="text-lg font-black text-red-600 mt-0.5">{stats.absent}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-purple-200 shadow-2xs text-center">
                    <span className="text-[10px] font-bold text-purple-600 uppercase">On Leave</span>
                    <p className="text-lg font-black text-purple-600 mt-0.5">{stats.on_leave}</p>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="px-3 py-1.5 text-xs font-bold text-gray-800 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>
                    <div>
                        <select
                            value={dept}
                            onChange={(e) => handleDeptChange(e.target.value)}
                            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        >
                            <option value="">All Departments</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                        type="button"
                        onClick={markAllPresent}
                        className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                        Mark All Present
                    </button>
                    <button
                        type="button"
                        onClick={handleSaveBatch}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-xs transition"
                    >
                        <Save className="h-4 w-4" />
                        <span>Save Attendance</span>
                    </button>
                </div>
            </div>

            {/* Matrix Table */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs">
                        <thead className="bg-[#F7F8FA]">
                            <tr>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Employee</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Department</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Status Action</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Clock In</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Clock Out</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Work Hours</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {employees.map((emp) => {
                                const rec = records[emp.id] || { status: 'present', total_hours: 8.5 };

                                return (
                                    <tr key={emp.id} className="hover:bg-gray-50/70 transition">
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-8 w-8 rounded-full bg-[#FFF0E8] text-[#FF5500] font-bold flex items-center justify-center text-xs shrink-0">
                                                    {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{emp.full_name}</p>
                                                    <p className="font-mono text-[10px] text-gray-400">{emp.employee_code}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap text-gray-600">
                                            {emp.department?.name || 'General'}
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-1">
                                                {['present', 'late', 'half_day', 'absent', 'on_leave'].map((st) => (
                                                    <button
                                                        key={st}
                                                        type="button"
                                                        onClick={() => setStatusForEmployee(emp.id, st)}
                                                        className={`px-2 py-1 rounded text-[11px] font-bold capitalize transition ${
                                                            rec.status === st
                                                                ? st === 'present'
                                                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                                                    : st === 'late'
                                                                    ? 'bg-amber-500 text-white shadow-2xs'
                                                                    : st === 'half_day'
                                                                    ? 'bg-blue-600 text-white shadow-2xs'
                                                                    : st === 'on_leave'
                                                                    ? 'bg-purple-600 text-white shadow-2xs'
                                                                    : 'bg-red-600 text-white shadow-2xs'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {st.replace('_', ' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <input
                                                type="time"
                                                value={rec.clock_in || ''}
                                                onChange={(e) => setRecords({
                                                    ...records,
                                                    [emp.id]: { ...rec, clock_in: e.target.value },
                                                })}
                                                disabled={rec.status === 'absent' || rec.status === 'on_leave'}
                                                className="px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-[#FF5500] disabled:bg-gray-50 disabled:text-gray-400 font-mono"
                                            />
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <input
                                                type="time"
                                                value={rec.clock_out || ''}
                                                onChange={(e) => setRecords({
                                                    ...records,
                                                    [emp.id]: { ...rec, clock_out: e.target.value },
                                                })}
                                                disabled={rec.status === 'absent' || rec.status === 'on_leave'}
                                                className="px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-[#FF5500] disabled:bg-gray-50 disabled:text-gray-400 font-mono"
                                            />
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap font-mono font-bold text-gray-800">
                                            {rec.total_hours} hrs
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
