import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import Badge from '@/Components/Badge';
import Pagination from '@/Components/Pagination';
import { Video, Plus, Calendar, Clock, MapPin, Users, Edit3 } from 'lucide-react';

export default function Index({ meetings, employees }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState(null);

    const form = useForm({
        title: '',
        meeting_date: new Date().toISOString().split('T')[0],
        start_time: '10:00',
        end_time: '11:00',
        location_or_link: '',
        agenda: '',
        status: 'scheduled',
        participant_ids: [],
    });

    const editForm = useForm({
        title: '',
        meeting_date: '',
        start_time: '',
        end_time: '',
        location_or_link: '',
        agenda: '',
        minutes_of_meeting: '',
        status: 'scheduled',
    });

    const handleCreate = (e) => {
        e.preventDefault();
        form.post('/meetings', {
            onSuccess: () => {
                form.reset();
                setModalOpen(false);
            },
        });
    };

    const handleOpenEdit = (m) => {
        setSelectedMeeting(m);
        editForm.setData({
            title: m.title,
            meeting_date: m.meeting_date,
            start_time: m.start_time?.substring(0, 5) || '',
            end_time: m.end_time?.substring(0, 5) || '',
            location_or_link: m.location_or_link,
            agenda: m.agenda || '',
            minutes_of_meeting: m.minutes_of_meeting || '',
            status: m.status,
        });
        setEditModalOpen(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.put(`/meetings/${selectedMeeting.id}`, {
            onSuccess: () => {
                setEditModalOpen(false);
            },
        });
    };

    return (
        <AdminLayout title="Meetings">
            <Head title="Corporate Meetings" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Corporate Meetings & Minutes
                    </h1>
                    <p className="text-xs text-[#6B7280]">
                        Schedule leadership syncs, executive reviews, and record official minutes of meeting
                    </p>
                </div>
                <div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-xs transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Schedule Meeting</span>
                    </button>
                </div>
            </div>

            {/* Meetings Cards List */}
            <div className="space-y-4 mb-6">
                {meetings.data.map((m) => (
                    <div key={m.id} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-[#FFD6C0] transition">
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2.5">
                                <h3 className="text-sm font-black text-gray-900">{m.title}</h3>
                                <Badge variant={m.status === 'completed' ? 'success' : m.status === 'scheduled' ? 'primary' : 'default'}>
                                    {m.status?.toUpperCase()}
                                </Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5 text-[#FF5500]" />
                                    <span>{m.meeting_date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                                    <span>{m.start_time?.substring(0, 5)} - {m.end_time?.substring(0, 5) || 'TBD'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                    <span className="font-semibold text-gray-800">{m.location_or_link}</span>
                                </div>
                            </div>

                            {m.agenda && (
                                <p className="text-xs text-gray-500 whitespace-pre-line line-clamp-2">{m.agenda}</p>
                            )}

                            {/* Participants */}
                            {m.participants?.length > 0 && (
                                <div className="flex items-center gap-1.5 pt-1">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Attendees:</span>
                                    <div className="flex flex-wrap gap-1">
                                        {m.participants.map((p) => (
                                            <span key={p.id} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-semibold">
                                                {p.employee?.full_name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                            <button
                                onClick={() => handleOpenEdit(m)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition"
                            >
                                <Edit3 className="h-3.5 w-3.5" />
                                <span>Edit / Minutes</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Pagination links={meetings.links} />

            {/* Modal: Schedule Meeting */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Schedule Corporate Meeting"
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Meeting Title *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Q4 Executive Sprint & Financial Audit Sync"
                            value={form.data.title}
                            onChange={(e) => form.setData('title', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Date *</label>
                            <input
                                type="date"
                                required
                                value={form.data.meeting_date}
                                onChange={(e) => form.setData('meeting_date', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Start Time *</label>
                            <input
                                type="time"
                                required
                                value={form.data.start_time}
                                onChange={(e) => form.setData('start_time', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">End Time</label>
                            <input
                                type="time"
                                value={form.data.end_time}
                                onChange={(e) => form.setData('end_time', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Location / Video Link *</label>
                        <input
                            type="text"
                            required
                            placeholder="Main Boardroom (Level 4) or Google Meet URL"
                            value={form.data.location_or_link}
                            onChange={(e) => form.setData('location_or_link', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Agenda & Discussions</label>
                        <textarea
                            rows={3}
                            placeholder="1. Review milestones&#10;2. Expense budget reconciliation&#10;3. Key action items"
                            value={form.data.agenda}
                            onChange={(e) => form.setData('agenda', e.target.value)}
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
                            Schedule Meeting
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal: Edit / Minutes of Meeting */}
            {selectedMeeting && (
                <Modal
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    title={`Meeting: ${selectedMeeting.title}`}
                >
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                                <select
                                    value={editForm.data.status}
                                    onChange={(e) => editForm.setData('status', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                                >
                                    <option value="scheduled">Scheduled</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={editForm.data.location_or_link}
                                    onChange={(e) => editForm.setData('location_or_link', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Official Minutes of Meeting (MoM)</label>
                            <textarea
                                rows={4}
                                placeholder="Decisions made, appointed owners, next steps agreed upon..."
                                value={editForm.data.minutes_of_meeting}
                                onChange={(e) => editForm.setData('minutes_of_meeting', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setEditModalOpen(false)}
                                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg"
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                disabled={editForm.processing}
                                className="px-5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-sm"
                            >
                                Save Minutes
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </AdminLayout>
    );
}
