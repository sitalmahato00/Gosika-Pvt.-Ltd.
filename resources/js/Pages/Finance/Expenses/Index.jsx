import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import Badge from '@/Components/Badge';
import Pagination from '@/Components/Pagination';
import {
    ArrowUpRight,
    Plus,
    Search,
    Download,
    Receipt,
    Calendar,
    Paperclip,
    Printer,
    FileSpreadsheet
} from 'lucide-react';

export default function Index({ expenses, categories, filters }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [receiptModalOpen, setReceiptModalOpen] = useState(false);
    const [activeReceiptPath, setActiveReceiptPath] = useState('');

    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const form = useForm({
        title: '',
        category_id: categories[0]?.id || '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        payee: '',
        payment_method: 'bank_transfer',
        payment_reference: '',
        description: '',
        notes: '',
        receipt: null,
    });

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/finance/expenses', {
            search,
            category_id: categoryId,
            start_date: startDate,
            end_date: endDate,
        }, { preserveState: true });
    };

    const handleCreate = (e) => {
        e.preventDefault();
        form.post('/finance/expenses', {
            onSuccess: () => {
                form.reset();
                setModalOpen(false);
            },
        });
    };

    const viewReceipt = (path) => {
        setActiveReceiptPath(path);
        setReceiptModalOpen(true);
    };

    return (
        <AdminLayout title="Office Expenses">
            <Head title="Operating Expenses" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Operating & Capital Expenditures
                    </h1>
                    <p className="text-xs text-[#6B7280]">
                        Log office leases, utilities, assets, vendor bills, and audit receipts
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href={`/finance/expenses/report-pdf?start_date=${startDate}&end_date=${endDate}&category_id=${categoryId}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#FF5500] bg-[#FFF0E8] border border-[#FFD6C0] hover:bg-orange-100 rounded-lg shadow-2xs transition"
                    >
                        <Printer className="h-4 w-4" />
                        <span>Download Audit Report (PDF)</span>
                    </a>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Log New Expense</span>
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs mb-6">
                <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search title, ref, payee..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>
                    <div>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        >
                            <option value="">All Categories</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>
                    <div>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-1.5 text-xs font-bold text-white bg-[#202124] hover:bg-black rounded-lg transition"
                        >
                            Filter
                        </button>
                    </div>
                </form>
            </div>

            {/* Expenses Table */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs">
                        <thead className="bg-[#F7F8FA]">
                            <tr>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Expense Ref</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Title & Payee</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Category</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Date</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Payment Method</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Amount (NPR)</th>
                                <th className="px-5 py-3 text-right font-bold text-gray-500 uppercase">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {expenses.data.length > 0 ? (
                                expenses.data.map((exp) => (
                                    <tr key={exp.id} className="hover:bg-gray-50/70 transition">
                                        <td className="px-5 py-3 font-mono font-bold text-gray-800">{exp.expense_number}</td>
                                        <td className="px-5 py-3">
                                            <p className="font-bold text-gray-900">{exp.title}</p>
                                            <p className="text-[10px] text-gray-500">Payee: {exp.payee}</p>
                                        </td>
                                        <td className="px-5 py-3 text-gray-600">{exp.category?.name}</td>
                                        <td className="px-5 py-3 text-gray-700">{exp.date}</td>
                                        <td className="px-5 py-3 uppercase text-gray-600">{exp.payment_method?.replace('_', ' ')}</td>
                                        <td className="px-5 py-3 font-mono font-bold text-red-600">
                                            - NPR {Number(exp.amount).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            {exp.receipt_path ? (
                                                <button
                                                    type="button"
                                                    onClick={() => viewReceipt(exp.receipt_path)}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5500] hover:underline"
                                                >
                                                    <Receipt className="h-3.5 w-3.5" />
                                                    <span>View</span>
                                                </button>
                                            ) : (
                                                <span className="text-[10px] text-gray-400">None</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-xs text-gray-400">
                                        No expense records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={expenses.links} />
            </div>

            {/* Modal: Log Expense */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Log Corporate Expenditure"
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Expense Title *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Monthly Commercial Lease - Level 4 Tinkune"
                            value={form.data.title}
                            onChange={(e) => form.setData('title', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                            <select
                                required
                                value={form.data.category_id}
                                onChange={(e) => form.setData('category_id', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Amount (NPR) *</label>
                            <input
                                type="number"
                                required
                                min="1"
                                placeholder="135000"
                                value={form.data.amount}
                                onChange={(e) => form.setData('amount', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] font-mono font-bold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Date *</label>
                            <input
                                type="date"
                                required
                                value={form.data.date}
                                onChange={(e) => form.setData('date', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Payee / Vendor *</label>
                            <input
                                type="text"
                                required
                                placeholder="Tower Management / ISP / Vendor"
                                value={form.data.payee}
                                onChange={(e) => form.setData('payee', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Payment Method</label>
                            <select
                                value={form.data.payment_method}
                                onChange={(e) => form.setData('payment_method', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="cheque">Cheque</option>
                                <option value="cash">Cash</option>
                                <option value="card">Company Credit Card</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Receipt Attachment</label>
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => form.setData('receipt', e.target.files[0])}
                            className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#FF5500]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Notes / TDS Tax Remark</label>
                        <textarea
                            rows={2}
                            placeholder="TDS deductions, invoice numbers, warranty notes..."
                            value={form.data.notes}
                            onChange={(e) => form.setData('notes', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
                        >
                            Log Expense Record
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal: Receipt Preview */}
            <Modal
                isOpen={receiptModalOpen}
                onClose={() => setReceiptModalOpen(false)}
                title="Expense Invoice / Receipt Attachment"
            >
                <div className="flex flex-col items-center justify-center p-4">
                    <img
                        src={`/storage/${activeReceiptPath}`}
                        alt="Receipt"
                        className="max-h-96 object-contain rounded-lg border border-gray-200 shadow-md"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                    <div className="mt-4">
                        <a
                            href={`/storage/${activeReceiptPath}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#FF5500] rounded-lg"
                        >
                            <Download className="h-4 w-4" />
                            <span>Open Full Document</span>
                        </a>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
