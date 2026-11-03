import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import { FolderTree, Plus, TrendingUp, TrendingDown } from 'lucide-react';

export default function Categories({ incomeCategories, expenseCategories }) {
    const [modalOpen, setModalOpen] = useState(false);

    const form = useForm({
        type: 'expense',
        name: '',
        code: '',
        monthly_budget: 0,
        description: '',
    });

    const handleCreate = (e) => {
        e.preventDefault();
        form.post('/finance/categories', {
            onSuccess: () => {
                form.reset();
                setModalOpen(false);
            },
        });
    };

    return (
        <AdminLayout title="Finance Categories">
            <Head title="Finance Categories & Budgets" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Financial Categories & Monthly Budgets
                    </h1>
                    <p className="text-xs text-[#6B7280]">
                        Configure budget allocations, departmental codes, and revenue streams
                    </p>
                </div>
                <div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-xs transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Category</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Income Categories */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-5">
                    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                        <h2 className="text-sm font-bold text-[#202124]">Corporate Inflow Categories</h2>
                    </div>

                    <div className="space-y-3">
                        {incomeCategories.map((c) => (
                            <div key={c.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                            {c.code}
                                        </span>
                                        <span className="font-bold text-gray-900">{c.name}</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-1">{c.description || 'Corporate revenue source'}</p>
                                </div>
                                <span className="font-mono text-gray-400 text-[10px]">
                                    {c.incomes_count} entry(s)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Expense Categories */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-5">
                    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                        <TrendingDown className="h-5 w-5 text-red-600" />
                        <h2 className="text-sm font-bold text-[#202124]">Expenditure Categories & Limits</h2>
                    </div>

                    <div className="space-y-3">
                        {expenseCategories.map((c) => (
                            <div key={c.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
                                            {c.code}
                                        </span>
                                        <span className="font-bold text-gray-900">{c.name}</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-1">{c.description || 'Operating overhead'}</p>
                                </div>
                                <div className="text-right">
                                    <span className="font-mono font-bold text-gray-800">
                                        NPR {Number(c.monthly_budget).toLocaleString()}
                                    </span>
                                    <p className="text-[9px] text-gray-400 uppercase">Monthly Budget</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal: Create Category */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Create Financial Category"
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Category Type *</label>
                        <select
                            value={form.data.type}
                            onChange={(e) => form.setData('type', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        >
                            <option value="expense">Operating Expense</option>
                            <option value="income">Corporate Inflow / Revenue</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Category Name *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Cloud Infrastructure & Subscriptions"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Short Code *</label>
                            <input
                                type="text"
                                required
                                maxLength={10}
                                placeholder="e.g. CIS"
                                value={form.data.code}
                                onChange={(e) => form.setData('code', e.target.value.toUpperCase())}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] font-mono"
                            />
                        </div>

                        {form.data.type === 'expense' && (
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Monthly Budget (NPR)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.data.monthly_budget}
                                    onChange={(e) => form.setData('monthly_budget', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] font-mono"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                        <textarea
                            rows={2}
                            placeholder="Category scope and purpose..."
                            value={form.data.description}
                            onChange={(e) => form.setData('description', e.target.value)}
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
                            className="px-5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-sm"
                        >
                            Save Category
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
