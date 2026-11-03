import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import Badge from '@/Components/Badge';
import Pagination from '@/Components/Pagination';
import {
    Clock,
    Plus,
    CheckCircle,
    XCircle,
    FileText,
    Calendar,
    Users,
    Paperclip
} from 'lucide-react';

export default function Index({
    leaveRequests,
    leaveTypes,
    employees,
    leaveBalances,
    statusFilter
}) {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [typeModalOpen, setTypeModalOpen] = useState(false);

    // Form for Leave Request
    const leaveForm = useForm({
        employee_id: employees[0]?.id || '',
        leave_type_id: leaveTypes[0]?.id || '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        reason: '',
        status: 'approved', // Admin directly approves or records pending
        admin_remarks: '',
        attachment: null,
    });

    // Form for Leave Type
    const typeForm = useForm({
        name: '',
        code: '',
        max_days_per_year: 12,
        is_paid: true,
        description: '',
    });

    const handleCreateLeave = (e) => {
        e.preventDefault();
        leaveForm.post('/leave-management', {
            onSuccess: () => {
                leaveForm.reset();
                setCreateModalOpen(false);
            },
        });
    };

    const handleCreateType = (e) => {
        e.preventDefault();
        typeForm.post('/leave-types', {
            onSuccess: () => {
                typeForm.reset();
                setTypeModalOpen(false);
            },
        });
    };

    const handleStatusUpdate = (leaveId, status) => {
        router.patch(`/leave-management/${leaveId}/status`, { status });
    };

    return (
        <AdminLayout title="Leave Management">
            <Head title="Leave Management" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Leave Management & Entitlements
                    </h1>
                    <p className="text-xs text-[#6B7280]">
                        Single administrator workflow for reviewing, approving, and recording employee time off
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setTypeModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-2xs transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Leave Policy</span>
                    </button>
                    <button
                        onClick={() => setCreateModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-xs transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Record Leave Request</span>
                    </button>
                </div>
            </div>

            {/* Leave Balance Quota Cards */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Annual Leave Quota Ledger (18 Days Annual Baseline)
                    </h2>
                    <span className="text-xs text-gray-400">Total Staff: {leaveBalances.length}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {leaveBalances.map((b) => (
                        <div key={b.employee.id} className="p-3 rounded-xl bg-[#F7F8FA] border border-gray-100 flex flex-col justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-900 truncate">{b.employee.full_name}</p>
                                <p className="text-[10px] font-mono text-gray-400">{b.employee.employee_code}</p>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-xs">
                                <span className="text-[10px] text-gray-500">Used: <strong>{b.used_days}d</strong></span>
                                <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                                    {b.remaining_days}d Left
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Leave Requests Table */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#FF5500]" />
                        <h2 className="text-sm font-bold text-[#202124]">Staff Leave Requests</h2>
                    </div>

                    <div className="flex items-center gap-1">
                        {['all', 'pending', 'approved', 'rejected'].map((st) => (
                            <button
                                key={st}
                                onClick={() => router.get('/leave-management', st !== 'all' ? { status: st } : {})}
                                className={`px-2.5 py-1 text-xs font-bold rounded-lg capitalize transition ${
                                    (st === 'all' && !statusFilter) || statusFilter === st
                                        ? 'bg-[#FF5500] text-white shadow-2xs'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {st}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs">
                        <thead className="bg-[#F7F8FA]">
                            <tr>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Employee</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Leave Category</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Dates & Duration</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Reason / Justification</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-5 py-3 text-right font-bold text-gray-500 uppercase">Admin Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {leaveRequests.data.length > 0 ? (
                                leaveRequests.data.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50/70 transition">
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <p className="font-bold text-gray-900">{req.employee?.full_name}</p>
                                            <p className="font-mono text-[10px] text-gray-400">{req.employee?.employee_code}</p>
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <Badge variant="default">{req.leave_type?.name}</Badge>
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <p className="font-semibold text-gray-800">{req.start_date} to {req.end_date}</p>
                                            <p className="text-[10px] font-bold text-[#FF5500]">{req.total_days} Day(s)</p>
                                        </td>
                                        <td className="px-5 py-3 max-w-xs truncate text-gray-600">
                                            {req.reason}
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <Badge variant={req.status === 'approved' ? 'success' : req.status === 'pending' ? 'warning' : 'danger'}>
                                                {req.status?.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap text-right">
                                            {req.status === 'pending' ? (
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => handleStatusUpdate(req.id, 'approved')}
                                                        className="px-2 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-2xs transition"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(req.id, 'rejected')}
                                                        className="px-2 py-1 text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-2xs transition"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-gray-400 font-mono">
                                                    Reviewed by Admin
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-xs text-gray-400">
                                        No leave applications found for this filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={leaveRequests.links} />
            </div>

            {/* Modal: Record Leave */}
            <Modal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                title="Record Employee Leave Request"
            >
                <form onSubmit={handleCreateLeave} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Employee *</label>
                        <select
                            required
                            value={leaveForm.data.employee_id}
                            onChange={(e) => leaveForm.setData('employee_id', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        >
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.full_name} ({emp.employee_code})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Leave Policy Category *</label>
                        <select
                            required
                            value={leaveForm.data.leave_type_id}
                            onChange={(e) => leaveForm.setData('leave_type_id', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        >
                            {leaveTypes.map((lt) => (
                                <option key={lt.id} value={lt.id}>
                                    {lt.name} (Max {lt.max_days_per_year}d/yr)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Start Date *</label>
                            <input
                                type="date"
                                required
                                value={leaveForm.data.start_date}
                                onChange={(e) => leaveForm.setData('start_date', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">End Date *</label>
                            <input
                                type="date"
                                required
                                value={leaveForm.data.end_date}
                                onChange={(e) => leaveForm.setData('end_date', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Reason / Statement *</label>
                        <textarea
                            rows={3}
                            required
                            placeholder="Personal urgency, medical certificate details, family event..."
                            value={leaveForm.data.reason}
                            onChange={(e) => leaveForm.setData('reason', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Status Disposition *</label>
                        <select
                            value={leaveForm.data.status}
                            onChange={(e) => leaveForm.setData('status', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        >
                            <option value="approved">Approve Immediately</option>
                            <option value="pending">Keep Pending</option>
                            <option value="rejected">Reject</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setCreateModalOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={leaveForm.processing}
                            className="px-5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-sm"
                        >
                            Submit Leave Application
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal: Create Leave Type */}
            <Modal
                isOpen={typeModalOpen}
                onClose={() => setTypeModalOpen(false)}
                title="Create Leave Policy / Entitlement Category"
            >
                <form onSubmit={handleCreateType} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Category Title *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Paternity Leave"
                            value={typeForm.data.name}
                            onChange={(e) => typeForm.setData('name', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Code *</label>
                            <input
                                type="text"
                                required
                                maxLength={10}
                                placeholder="e.g. PAT"
                                value={typeForm.data.code}
                                onChange={(e) => typeForm.setData('code', e.target.value.toUpperCase())}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Days / Year *</label>
                            <input
                                type="number"
                                required
                                min={1}
                                max={90}
                                value={typeForm.data.max_days_per_year}
                                onChange={(e) => typeForm.setData('max_days_per_year', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={typeForm.data.is_paid}
                                onChange={(e) => typeForm.setData('is_paid', e.target.checked)}
                                className="h-4 w-4 text-[#FF5500] focus:ring-[#FF5500] border-gray-300 rounded"
                            />
                            <span className="text-xs font-bold text-gray-700">Paid Leave Category</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setTypeModalOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={typeForm.processing}
                            className="px-5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-sm"
                        >
                            Save Policy
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
