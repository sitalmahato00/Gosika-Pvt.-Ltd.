import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import Badge from '@/Components/Badge';
import {
    ArrowLeft,
    Briefcase,
    Plus,
    Calendar,
    CheckSquare,
    Clock,
    User,
    CheckCircle2
} from 'lucide-react';

export default function Show({ project, employees }) {
    const [taskModalOpen, setTaskModalOpen] = useState(false);

    const taskForm = useForm({
        project_id: project.id,
        assigned_to: '',
        title: '',
        description: '',
        start_date: new Date().toISOString().split('T')[0],
        due_date: new Date().toISOString().split('T')[0],
        priority: 'medium',
        status: 'todo',
        progress_percentage: 0,
    });

    const handleCreateTask = (e) => {
        e.preventDefault();
        taskForm.post('/tasks', {
            onSuccess: () => {
                taskForm.reset();
                setTaskModalOpen(false);
            },
        });
    };

    const handleTaskStatus = (taskId, status) => {
        router.patch(`/tasks/${taskId}/status`, { status });
    };

    return (
        <AdminLayout title={`Project: ${project.name}`}>
            <Head title={`${project.name} (${project.code})`} />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <Link href="/projects" className="text-xs font-semibold text-gray-500 hover:text-[#FF5500]">
                        &larr; Back to Projects
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                        <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                            {project.name}
                        </h1>
                        <span className="font-mono text-xs font-bold text-[#FF5500] bg-[#FFF0E8] px-2 py-0.5 rounded">
                            {project.code}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setTaskModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-xs transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Task</span>
                    </button>
                </div>
            </div>

            {/* Project Overview Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-gray-100">
                    <div>
                        <span className="text-xs text-gray-400 font-bold uppercase">Client / Stakeholder</span>
                        <p className="text-sm font-bold text-gray-900 mt-1">{project.client_name || 'Internal Operations'}</p>
                    </div>
                    <div>
                        <span className="text-xs text-gray-400 font-bold uppercase">Allocated Budget</span>
                        <p className="text-sm font-bold text-[#FF5500] font-mono mt-1">
                            NPR {Number(project.budget).toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <span className="text-xs text-gray-400 font-bold uppercase">Execution Timeline</span>
                        <p className="text-sm font-bold text-gray-900 mt-1">
                            {project.start_date} to {project.end_date || 'Ongoing'}
                        </p>
                    </div>
                    <div>
                        <span className="text-xs text-gray-400 font-bold uppercase">Lifecycle Status</span>
                        <div className="mt-1">
                            <Badge variant={project.status === 'completed' ? 'success' : 'primary'}>
                                {project.status?.toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                        <span>Milestone Progress</span>
                        <span>{project.progress_percentage}% Completed</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#FF5500] rounded-full transition-all duration-500"
                            style={{ width: `${project.progress_percentage}%` }}
                        />
                    </div>
                </div>

                {project.description && (
                    <div className="mt-5 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700 leading-relaxed">
                        <p className="font-bold text-gray-900 mb-0.5">Project Brief & Scope:</p>
                        {project.description}
                    </div>
                )}
            </div>

            {/* Associated Tasks */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-[#FF5500]" />
                        <h2 className="text-sm font-bold text-[#202124]">Project Sprint Tasks</h2>
                    </div>
                    <span className="text-xs text-gray-400">{project.tasks.length} Total Task(s)</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs">
                        <thead className="bg-[#F7F8FA]">
                            <tr>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Task Title</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Assignee</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Due Date</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Priority</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-5 py-3 text-right font-bold text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {project.tasks.length > 0 ? (
                                project.tasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-gray-50/70 transition">
                                        <td className="px-5 py-3">
                                            <p className="font-bold text-gray-900">{task.title}</p>
                                            {task.description && <p className="text-[10px] text-gray-500 truncate max-w-xs">{task.description}</p>}
                                        </td>
                                        <td className="px-5 py-3 text-gray-700">
                                            {task.assigned_employee?.full_name || 'Unassigned'}
                                        </td>
                                        <td className="px-5 py-3 text-gray-600 font-mono">{task.due_date}</td>
                                        <td className="px-5 py-3">
                                            <Badge variant={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'default'}>
                                                {task.priority?.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3 capitalize font-bold">
                                            <span className={task.status === 'completed' ? 'text-emerald-600' : 'text-gray-800'}>
                                                {task.status?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            {task.status !== 'completed' ? (
                                                <button
                                                    onClick={() => handleTaskStatus(task.id, 'completed')}
                                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline"
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    <span>Mark Done</span>
                                                </button>
                                            ) : (
                                                <span className="text-[10px] text-gray-400">Complete</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-xs text-gray-400">
                                        No tasks created for this project yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal: Add Task */}
            <Modal
                isOpen={taskModalOpen}
                onClose={() => setTaskModalOpen(false)}
                title={`Add Task to ${project.name}`}
            >
                <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Task Title *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Implement authentication JWT middleware"
                            value={taskForm.data.title}
                            onChange={(e) => taskForm.setData('title', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Assign To</label>
                            <select
                                value={taskForm.data.assigned_to}
                                onChange={(e) => taskForm.setData('assigned_to', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="">Select Employee</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Due Date *</label>
                            <input
                                type="date"
                                required
                                value={taskForm.data.due_date}
                                onChange={(e) => taskForm.setData('due_date', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Priority</label>
                            <select
                                value={taskForm.data.priority}
                                onChange={(e) => taskForm.setData('priority', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Initial Status</label>
                            <select
                                value={taskForm.data.status}
                                onChange={(e) => taskForm.setData('status', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="todo">To Do</option>
                                <option value="in_progress">In Progress</option>
                                <option value="review">Review</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Task Description</label>
                        <textarea
                            rows={3}
                            placeholder="Detailed technical instructions..."
                            value={taskForm.data.description}
                            onChange={(e) => taskForm.setData('description', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setTaskModalOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={taskForm.processing}
                            className="px-5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-sm"
                        >
                            Save Task
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
