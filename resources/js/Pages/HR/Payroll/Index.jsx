import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import Badge from '@/Components/Badge';
import {
    Banknote,
    Plus,
    Download,
    FileText,
    TrendingUp,
    ShieldAlert,
    ChevronLeft,
    ChevronRight,
    Printer
} from 'lucide-react';

export default function Index({
    month,
    year,
    periodName,
    salaries,
    stats,
    rates
}) {
    const [generateModalOpen, setGenerateModalOpen] = useState(false);

    const form = useForm({
        month: month,
        year: year,
        tax_rate: rates.tax_rate || 1.00,
        pf_rate: rates.pf_rate || 10.00,
        allowance_percentage: 15.00,
    });

    const handleMonthChange = (newMonth, newYear) => {
        router.get('/payroll', { month: newMonth, year: newYear });
    };

    const handleGenerate = (e) => {
        e.preventDefault();
        form.post('/payroll/generate', {
            onSuccess: () => {
                setGenerateModalOpen(false);
            },
        });
    };

    return (
        <AdminLayout title="Payroll Management">
            <Head title={`Payroll - ${periodName}`} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Payroll & Salary Slips
                    </h1>
                    <p className="text-xs text-[#6B7280]">
                        Corporate compensation ledger, tax TDS calculation, and printable salary slips
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href={`/payroll/export-csv?month=${month}&year=${year}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-2xs transition"
                    >
                        <Download className="h-4 w-4" />
                        <span>Export Ledger (CSV)</span>
                    </a>
                    {salaries.length > 0 && (
                        <a
                            href={`/payroll/bulk-pdf?month=${month}&year=${year}`}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#FF5500] bg-[#FFF0E8] border border-[#FFD6C0] hover:bg-orange-100 rounded-lg shadow-2xs transition"
                        >
                            <Printer className="h-4 w-4" />
                            <span>Bulk Slips (PDF)</span>
                        </a>
                    )}
                    <button
                        onClick={() => setGenerateModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-xs transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Run Monthly Payroll</span>
                    </button>
                </div>
            </div>

            {/* Month Navigator & KPI Summary */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 mb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                const prevM = month === 1 ? 12 : month - 1;
                                const prevY = month === 1 ? year - 1 : year;
                                handleMonthChange(prevM, prevY);
                            }}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-base font-black text-gray-900">{periodName}</span>
                        <button
                            onClick={() => {
                                const nextM = month === 12 ? 1 : month + 1;
                                const nextY = month === 12 ? year + 1 : year;
                                handleMonthChange(nextM, nextY);
                            }}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="text-xs text-gray-500">
                        Disbursement Cycle: <strong>Monthly Direct Bank Transfer (ACH)</strong>
                    </div>
                </div>

                {/* 4 Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Processed Staff</span>
                        <p className="text-lg font-black text-gray-900 mt-0.5">
                            {stats.generated_count} / {stats.active_employees}
                        </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Gross Earnings</span>
                        <p className="text-base font-black text-gray-800 font-mono mt-0.5">
                            रू {stats.total_gross.toLocaleString()}
                        </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-red-50/50 border border-red-100">
                        <span className="text-[10px] font-bold text-red-600 uppercase">Total Deductions</span>
                        <p className="text-base font-black text-red-600 font-mono mt-0.5">
                            - रू {stats.total_deductions.toLocaleString()}
                        </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#FFF0E8] border border-[#FFD6C0]">
                        <span className="text-[10px] font-bold text-[#662200] uppercase">Net Disbursed</span>
                        <p className="text-base font-black text-[#FF5500] font-mono mt-0.5">
                            रू {stats.total_disbursed.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Salary Slips Table */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#FF5500]" />
                        <h2 className="text-sm font-bold text-[#202124]">Monthly Disbursement Ledger</h2>
                    </div>
                    <span className="text-xs text-gray-400">{salaries.length} Slips Generated</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs">
                        <thead className="bg-[#F7F8FA]">
                            <tr>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Slip Number</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Employee</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Bank Information</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Basic (NPR)</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Gross</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Deductions</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Net Salary</th>
                                <th className="px-5 py-3 text-right font-bold text-gray-500 uppercase">Slip Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {salaries.length > 0 ? (
                                salaries.map((sal) => (
                                    <tr key={sal.id} className="hover:bg-gray-50/70 transition">
                                        <td className="px-5 py-3 whitespace-nowrap font-mono font-bold text-gray-800">
                                            {sal.slip_number}
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <p className="font-bold text-gray-900">{sal.employee?.full_name}</p>
                                            <p className="text-[10px] text-gray-400">{sal.employee?.designation?.title}</p>
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <p className="text-gray-800 font-medium">{sal.employee?.bank_name || 'N/A'}</p>
                                            <p className="text-[10px] font-mono text-gray-400">{sal.employee?.bank_account_no || 'N/A'}</p>
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap font-mono">
                                            {Number(sal.basic_salary).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap font-mono">
                                            {Number(sal.gross_salary).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap font-mono text-red-600">
                                            - {Number(sal.total_deductions).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap font-mono font-bold text-emerald-600">
                                            NPR {Number(sal.net_salary).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap text-right">
                                            <a
                                                href={`/payroll/${sal.id}/pdf`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#FF5500] bg-[#FFF0E8] hover:bg-orange-100 rounded-lg transition shadow-2xs"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                <span>Download PDF</span>
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-12 text-xs text-gray-400">
                                        No payroll has been generated for {periodName} yet. Click "Run Monthly Payroll" above.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal: Batch Generate Payroll */}
            <Modal
                isOpen={generateModalOpen}
                onClose={() => setGenerateModalOpen(false)}
                title={`Run Monthly Payroll Calculation: ${periodName}`}
            >
                <form onSubmit={handleGenerate} className="space-y-4">
                    <p className="text-xs text-gray-500">
                        This batch job calculates individual earnings and statutory deductions for all active staff, writes atomic records within a database transaction, and assigns unique verifiable slip numbers.
                    </p>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Allowance Rate (%) *</label>
                            <input
                                type="number"
                                step="0.5"
                                required
                                value={form.data.allowance_percentage}
                                onChange={(e) => form.setData('allowance_percentage', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Tax TDS Rate (%) *</label>
                            <input
                                type="number"
                                step="0.1"
                                required
                                value={form.data.tax_rate}
                                onChange={(e) => form.setData('tax_rate', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Provident Fund (%) *</label>
                            <input
                                type="number"
                                step="0.5"
                                required
                                value={form.data.pf_rate}
                                onChange={(e) => form.setData('pf_rate', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>
                    </div>

                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-800 text-xs">
                        <p className="font-bold">Database Safeguard Notice</p>
                        <p className="text-[11px] mt-0.5">Existing slips for {periodName} will be safely recalculated and updated with audited timestamps.</p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setGenerateModalOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="px-5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-sm"
                        >
                            {form.processing ? 'Calculating...' : 'Execute Payroll Run'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
