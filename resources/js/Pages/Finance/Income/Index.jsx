import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import Badge from '@/Components/Badge';
import Pagination from '@/Components/Pagination';
import {
    ArrowDownRight,
    Plus,
    Search,
    Download,
    Receipt,
    FileText
} from 'lucide-react';

export default function Index({ incomes, categories, filters }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');

    const form = useForm({
        title: '',
        category_id: categories[0]?.id || '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        payment_method: 'bank_transfer',
        payer: '',
        reference_no: '',
        description: '',
        receipt: null,
    });

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/finance/income', { search, category_id: categoryId }, { preserveState: true });
    };

    const handleCreate = (e) => {
        e.preventDefault();
        form.post('/finance/income', {
            onSuccess: () => {
                form.reset();
                setModalOpen(false);
            },
        });
    };

    return (
        <AdminLayout title="Corporate Income">
            <Head title="Corporate Incomes" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Corporate Inflow & Revenue
                    </h1>
                    <p className="text-xs text-[#6B7280]">
                        Track client payments, consulting retainers, and office revenue
                    </p>
                </div>
                <div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Record Income</span>
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs mb-6">
                <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search title, ref #, payer..."
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
                            <option value="">All Revenue Categories</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            className="px-4 py-1.5 text-xs font-bold text-white bg-[#202124] hover:bg-black rounded-lg transition"
                        >
                            Filter
                        </button>
                    </div>
                </form>
            </div>

            {/* Income Table */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs">
                        <thead className="bg-[#F7F8FA]">
                            <tr>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Ref Number</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Title & Source</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Category</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Date</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Method</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Amount (NPR)</th>
                                <th className="px-5 py-3 text-right font-bold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {incomes.data.length > 0 ? (
                                incomes.data.map((inc) => (
                                    <tr key={inc.id} className="hover:bg-gray-50/70 transition">
                                        <td className="px-5 py-3 font-mono font-bold text-gray-800">{inc.income_number}</td>
                                        <td className="px-5 py-3">
                                            <p className="font-bold text-gray-900">{inc.title}</p>
                                            <p className="text-[10px] text-gray-500">Payer: {inc.payer}</p>
                                        </td>
                                        <td className="px-5 py-3 text-gray-600">{inc.category?.name}</td>
                                        <td className="px-5 py-3 text-gray-700">{inc.date}</td>
                                        <td className="px-5 py-3 uppercase text-gray-600">{inc.payment_method?.replace('_', ' ')}</td>
                                        <td className="px-5 py-3 font-mono font-bold text-emerald-600">
                                            NPR {Number(inc.amount).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <Badge variant="success">COMPLETED</Badge>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-xs text-gray-400">
                                        No income transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={incomes.links} />
            </div>

            {/* Modal: Record Income */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Record Corporate Income"
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Income Title *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Q4 Cloud Advisory & Retainer Payment"
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
                                placeholder="150000"
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
                            <label className="block text-xs font-bold text-gray-700 mb-1">Payer / Client *</label>
                            <input
                                type="text"
                                required
                                placeholder="Client Corp"
                                value={form.data.payer}
                                onChange={(e) => form.setData('payer', e.target.value)}
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
                                <option value="digital_wallet">Digital Wallet</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Transaction Ref #</label>
                        <input
                            type="text"
                            placeholder="ACH-88912 or Cheque #"
                            value={form.data.reference_no}
                            onChange={(e) => form.setData('reference_no', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] font-mono"
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
                            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                        >
                            Save Inflow
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
