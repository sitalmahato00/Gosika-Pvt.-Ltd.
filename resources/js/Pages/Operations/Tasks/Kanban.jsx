import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import Badge from '@/Components/Badge';
import {
    CheckSquare,
    Plus,
    Calendar,
    User,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Filter
} from 'lucide-react';

export default function Kanban({ tasks, projects, employees, selectedProjectId }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [filterProject, setFilterProject] = useState(selectedProjectId || '');

    const form = useForm({
        project_id: filterProject || (projects[0]?.id || ''),
        assigned_to: '',
        title: '',
        description: '',
        start_date: new Date().toISOString().split('T')[0],
        due_date: new Date().toISOString().split('T')[0],
        priority: 'medium',
        status: 'todo',
    });

    const columns = [
        { id: 'todo', title: 'To Do', color: 'border-t-gray-400', badge: 'default' },
        { id: 'in_progress', title: 'In Progress', color: 'border-t-[#FF5500]', badge: 'primary' },
        { id: 'review', title: 'Under Review', color: 'border-t-amber-500', badge: 'warning' },
        { id: 'completed', title: 'Completed', color: 'border-t-emerald-500', badge: 'success' },
    ];

    const handleFilterChange = (pId) => {
        setFilterProject(pId);
        router.get('/tasks/kanban', pId ? { project_id: pId } : {});
    };

    const handleCreateTask = (e) => {
        e.preventDefault();
        form.post('/tasks', {
            onSuccess: () => {
                form.reset();
                setModalOpen(false);
            },
        });
    };

    const handleMoveTask = (taskId, newStatus) => {
        router.patch(`/tasks/${taskId}/status`, { status: newStatus });
    };

    return (
        <AdminLayout title="Tasks Kanban">
            <Head title="Interactive Kanban Board" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Task Operations Kanban
                    </h1>
                    <p className="text-xs text-[#6B7280]">
                        Visual workflow tracking across active sprints and project deliverables
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={filterProject}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] bg-white"
                    >
                        <option value="">All Projects</option>
                        {projects.map((p) => (
                            <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                        ))}
                    </select>

                    <button
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-xs transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Task</span>
                    </button>
                </div>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {columns.map((col) => {
                    const columnTasks = tasks.filter((t) => t.status === col.id);

                    return (
                        <div
                            key={col.id}
                            className={`bg-white rounded-2xl border border-[#E5E7EB] border-t-4 ${col.color} shadow-xs p-4 flex flex-col`}
                        >
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{col.title}</h2>
                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                        {columnTasks.length}
                                    </span>
                                </div>
                            </div>

                            {/* Column Task Cards */}
                            <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                                {columnTasks.length > 0 ? (
                                    columnTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-[#FFD6C0] shadow-2xs hover:shadow-xs transition space-y-2.5"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <span className="font-bold text-xs text-gray-900 line-clamp-2">
                                                    {task.title}
                                                </span>
                                                <Badge variant={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'default'} className="shrink-0 text-[9px] px-1.5 py-0">
                                                    {task.priority}
                                                </Badge>
                                            </div>

                                            {task.project && (
                                                <span className="inline-block text-[10px] font-mono font-bold text-[#FF5500] bg-[#FFF0E8] px-1.5 py-0.5 rounded">
                                                    {task.project.code}
                                                </span>
                                            )}

                                            <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                                                <div className="flex items-center gap-1 truncate max-w-[120px]">
                                                    <User className="h-3 w-3 text-gray-400 shrink-0" />
                                                    <span className="truncate">{task.assigned_employee?.full_name || 'Unassigned'}</span>
                                                </div>
                                                <div className="flex items-center gap-1 font-mono text-gray-400 shrink-0">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{task.due_date}</span>
                                                </div>
                                            </div>

                                            {/* Column Transition Buttons */}
                                            <div className="pt-2 flex items-center justify-between border-t border-dashed border-gray-200 text-[10px]">
                                                {col.id !== 'todo' ? (
                                                    <button
                                                        onClick={() => {
                                                            const prev = col.id === 'completed' ? 'review' : col.id === 'review' ? 'in_progress' : 'todo';
                                                            handleMoveTask(task.id, prev);
                                                        }}
                                                        className="text-gray-400 hover:text-gray-700 font-semibold flex items-center gap-0.5"
                                                        title="Move back"
                                                    >
                                                        <ArrowLeft className="h-3 w-3" />
                                                        <span>Back</span>
                                                    </button>
                                                ) : <div />}

                                                {col.id !== 'completed' ? (
                                                    <button
                                                        onClick={() => {
                                                            const next = col.id === 'todo' ? 'in_progress' : col.id === 'in_progress' ? 'review' : 'completed';
                                                            handleMoveTask(task.id, next);
                                                        }}
                                                        className="text-[#FF5500] hover:text-[#E04B00] font-bold flex items-center gap-0.5 ml-auto"
                                                        title="Advance task"
                                                    >
                                                        <span>Next</span>
                                                        <ArrowRight className="h-3 w-3" />
                                                    </button>
                                                ) : (
                                                    <span className="text-emerald-600 font-bold flex items-center gap-0.5 ml-auto">
                                                        <CheckCircle2 className="h-3 w-3" /> Done
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl text-xs text-gray-400">
                                        No tasks
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal: Add Task */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Create Sprint Task"
            >
                <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Task Title *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Design CR80 card physical template view"
                            value={form.data.title}
                            onChange={(e) => form.setData('title', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Related Project</label>
                            <select
                                value={form.data.project_id}
                                onChange={(e) => form.setData('project_id', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="">No Project</option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Assign To</label>
                            <select
                                value={form.data.assigned_to}
                                onChange={(e) => form.setData('assigned_to', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="">Unassigned</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                                ))}
                            </select>
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
                            <label className="block text-xs font-bold text-gray-700 mb-1">Due Date *</label>
                            <input
                                type="date"
                                required
                                value={form.data.due_date}
                                onChange={(e) => form.setData('due_date', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Task Details</label>
                        <textarea
                            rows={3}
                            placeholder="Detailed technical specifications..."
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
                            Create Task
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
