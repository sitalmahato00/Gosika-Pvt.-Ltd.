import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import Badge from '@/Components/Badge';
import Pagination from '@/Components/Pagination';
import { Briefcase, Plus, Calendar, CheckSquare, Clock } from 'lucide-react';

export default function Index({ projects, stats, statusFilter }) {
    const [modalOpen, setModalOpen] = useState(false);

    const form = useForm({
        name: '',
        client_name: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        budget: '',
        priority: 'medium',
        status: 'active',
        description: '',
    });

    const handleCreate = (e) => {
        e.preventDefault();
        form.post('/projects', {
            onSuccess: () => {
                form.reset();
                setModalOpen(false);
            },
        });
    };

    return (
        <AdminLayout title="Projects">
            <Head title="Corporate Projects" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Project & Delivery Management
                    </h1>
                    <p className="text-xs text-[#6B7280]">
                        Track enterprise milestones, budgets, client deliveries, and sprint velocity
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/tasks/kanban"
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-2xs transition"
                    >
                        <CheckSquare className="h-4 w-4" />
                        <span>Interactive Kanban</span>
                    </Link>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-xs transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>New Project</span>
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Total Projects</span>
                    <p className="text-lg font-black text-gray-900 mt-0.5">{stats.total}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-blue-200 text-center">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Active / In Execution</span>
                    <p className="text-lg font-black text-blue-600 mt-0.5">{stats.active}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-center">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Delivered / Complete</span>
                    <p className="text-lg font-black text-emerald-600 mt-0.5">{stats.completed}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-amber-200 text-center">
                    <span className="text-[10px] font-bold text-amber-600 uppercase">Planning / Scoping</span>
                    <p className="text-lg font-black text-amber-600 mt-0.5">{stats.planning}</p>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                {projects.data.map((prj) => (
                    <div key={prj.id} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-5 flex flex-col justify-between hover:border-[#FFD6C0] transition">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-mono text-xs font-bold text-[#FF5500] bg-[#FFF0E8] px-2 py-0.5 rounded">
                                    {prj.code}
                                </span>
                                <Badge variant={prj.status === 'completed' ? 'success' : prj.status === 'active' ? 'primary' : 'warning'}>
                                    {prj.status?.toUpperCase()}
                                </Badge>
                            </div>

                            <Link href={`/projects/${prj.id}`} className="text-sm font-bold text-[#202124] hover:text-[#FF5500] transition block">
                                {prj.name}
                            </Link>
                            <p className="text-xs text-gray-500 mt-0.5">Client: <strong>{prj.client_name || 'Internal'}</strong></p>
                            <p className="text-xs text-gray-600 mt-2 line-clamp-2">{prj.description || 'No description provided.'}</p>
                        </div>

                        <div className="mt-5 pt-3 border-t border-gray-100 space-y-3">
                            <div>
                                <div className="flex justify-between text-[11px] font-semibold text-gray-700 mb-1">
                                    <span>Milestone Progress</span>
                                    <span>{prj.progress_percentage}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#FF5500] rounded-full transition-all duration-300"
                                        style={{ width: `${prj.progress_percentage}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                                <span className="font-mono font-bold text-gray-900">
                                    रू {Number(prj.budget).toLocaleString()}
                                </span>
                                <div className="flex items-center gap-1 font-semibold text-gray-600">
                                    <CheckSquare className="h-3.5 w-3.5 text-gray-400" />
                                    <span>{prj.tasks_count} tasks</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Pagination links={projects.links} />

            {/* Modal: Create Project */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Initiate Corporate Project"
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Project Name *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. ERP Microservices & Security Suite"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Client / Stakeholder</label>
                            <input
                                type="text"
                                placeholder="Internal Operations / Client Corp"
                                value={form.data.client_name}
                                onChange={(e) => form.setData('client_name', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Project Budget (NPR) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                placeholder="500000"
                                value={form.data.budget}
                                onChange={(e) => form.setData('budget', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] font-mono font-bold"
                            />
                        </div>
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
                            <label className="block text-xs font-bold text-gray-700 mb-1">Target End Date</label>
                            <input
                                type="date"
                                value={form.data.end_date}
                                onChange={(e) => form.setData('end_date', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Priority</label>
                            <select
                                value={form.data.priority}
                                onChange={(e) => form.setData('priority', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                            <select
                                value={form.data.status}
                                onChange={(e) => form.setData('status', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="planning">Planning</option>
                                <option value="active">Active Execution</option>
                                <option value="on_hold">On Hold</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Scope & Objectives</label>
                        <textarea
                            rows={3}
                            placeholder="Deliverables, acceptance criteria, technical milestones..."
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
                            Create Project
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
