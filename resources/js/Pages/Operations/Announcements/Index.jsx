import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import Badge from '@/Components/Badge';
import Pagination from '@/Components/Pagination';
import { Megaphone, Plus, Trash2, Calendar, AlertCircle } from 'lucide-react';

export default function Index({ announcements }) {
    const [modalOpen, setModalOpen] = useState(false);

    const form = useForm({
        title: '',
        content: '',
        priority: 'normal',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        is_active: true,
    });

    const handleCreate = (e) => {
        e.preventDefault();
        form.post('/announcements', {
            onSuccess: () => {
                form.reset();
                setModalOpen(false);
            },
        });
    };

    const handleDelete = (id, title) => {
        if (confirm(`Delete announcement "${title}"?`)) {
            router.delete(`/announcements/${id}`);
        }
    };

    return (
        <AdminLayout title="Announcements">
            <Head title="Corporate Notice Board" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Company Notice Board & Announcements
                    </h1>
                    <p className="text-xs text-[#6B7280]">
                        Publish internal company updates, holiday memos, and operational circulars
                    </p>
                </div>
                <div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-xs transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Publish Notice</span>
                    </button>
                </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-4 mb-6">
                {announcements.data.map((item) => (
                    <div
                        key={item.id}
                        className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between hover:border-[#FFD6C0] transition ${
                            item.priority === 'urgent'
                                ? 'border-red-300 bg-red-50/20'
                                : item.priority === 'important'
                                ? 'border-amber-300 bg-amber-50/20'
                                : 'border-[#E5E7EB]'
                        }`}
                    >
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant={item.priority === 'urgent' ? 'danger' : item.priority === 'important' ? 'warning' : 'default'}>
                                    {item.priority?.toUpperCase()} NOTICE
                                </Badge>
                                <button
                                    onClick={() => handleDelete(item.id, item.title)}
                                    className="p-1 text-gray-400 hover:text-red-600 transition"
                                    title="Delete Announcement"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <h3 className="text-sm font-black text-gray-900">{item.title}</h3>
                            <p className="text-xs text-gray-600 mt-2 whitespace-pre-line leading-relaxed">{item.content}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Published: {item.start_date} {item.end_date ? `(Valid until ${item.end_date})` : ''}</span>
                            </div>
                            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                                Active Broadcast
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <Pagination links={announcements.links} />

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Publish Corporate Notice"
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Notice Title *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Annual IT Security & Asset Verification Drive"
                            value={form.data.title}
                            onChange={(e) => form.setData('title', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Priority Broadcast</label>
                            <select
                                value={form.data.priority}
                                onChange={(e) => form.setData('priority', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="normal">Normal Announcement</option>
                                <option value="important">Important (Amber Banner)</option>
                                <option value="urgent">Urgent Operational Action</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Effective Date *</label>
                            <input
                                type="date"
                                required
                                value={form.data.start_date}
                                onChange={(e) => form.setData('start_date', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Notice Body *</label>
                        <textarea
                            rows={4}
                            required
                            placeholder="Full announcement body and operational instructions..."
                            value={form.data.content}
                            onChange={(e) => form.setData('content', e.target.value)}
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
                            Publish Circular
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
