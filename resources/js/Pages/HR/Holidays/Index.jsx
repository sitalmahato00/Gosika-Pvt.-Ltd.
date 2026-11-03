import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import Badge from '@/Components/Badge';
import { Palmtree, Plus, Trash2, Calendar } from 'lucide-react';

export default function Index({ holidays }) {
    const [modalOpen, setModalOpen] = useState(false);

    const form = useForm({
        title: '',
        start_date: '',
        end_date: '',
        type: 'festival',
        description: '',
        is_recurring: false,
    });

    const handleCreate = (e) => {
        e.preventDefault();
        form.post('/holidays', {
            onSuccess: () => {
                form.reset();
                setModalOpen(false);
            },
        });
    };

    const handleDelete = (id, title) => {
        if (confirm(`Remove holiday "${title}"?`)) {
            router.delete(`/holidays/${id}`);
        }
    };

    return (
        <AdminLayout title="Holidays Calendar">
            <Head title="Official Holidays" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Official Company & Public Holidays
                    </h1>
                    <p className="text-xs text-[#6B7280]">
                        Official non-working festival dates and national holidays schedule
                    </p>
                </div>
                <div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-xs transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Holiday</span>
                    </button>
                </div>
            </div>

            {/* Holidays Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {holidays.map((h) => (
                    <div key={h.id} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-5 flex flex-col justify-between hover:border-[#FFD6C0] transition">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant={h.type === 'festival' ? 'primary' : 'info'}>
                                    {h.type?.toUpperCase()}
                                </Badge>
                                <button
                                    onClick={() => handleDelete(h.id, h.title)}
                                    className="p-1 text-gray-400 hover:text-red-600 transition"
                                    title="Delete Holiday"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <h3 className="text-sm font-bold text-[#202124]">{h.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{h.description || 'Corporate holiday'}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-gray-700 font-semibold">
                                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                <span>{h.start_date} to {h.end_date}</span>
                            </div>
                            <span className="font-bold text-[#FF5500] bg-[#FFF0E8] px-2 py-0.5 rounded text-[11px]">
                                {h.total_days} Day(s)
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Add Official Holiday"
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Holiday Title *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Tihar Festival Break"
                            value={form.data.title}
                            onChange={(e) => form.setData('title', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Start Date *</label>
                            <input
                                type="date"
                                required
                                value={form.data.start_date}
                                onChange={(e) => form.setData('start_date', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">End Date *</label>
                            <input
                                type="date"
                                required
                                value={form.data.end_date}
                                onChange={(e) => form.setData('end_date', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                        <select
                            value={form.data.type}
                            onChange={(e) => form.setData('type', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        >
                            <option value="festival">Festival Break</option>
                            <option value="public">National / Public Holiday</option>
                            <option value="company">Company Specific Holiday</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                        <textarea
                            rows={2}
                            placeholder="Holiday details and remarks..."
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
                            Save Holiday
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
