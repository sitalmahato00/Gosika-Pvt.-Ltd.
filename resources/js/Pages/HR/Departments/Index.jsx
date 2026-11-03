import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import { Building2, Plus, Users, Trash2, Tag, Layers } from 'lucide-react';

export default function Index({ departments, designations }) {
    const [deptModalOpen, setDeptModalOpen] = useState(false);
    const [desigModalOpen, setDesigModalOpen] = useState(false);

    // Form for department
    const deptForm = useForm({
        name: '',
        code: '',
        description: '',
    });

    // Form for designation
    const desigForm = useForm({
        department_id: departments[0]?.id || '',
        title: '',
        code: '',
        description: '',
    });

    const handleCreateDept = (e) => {
        e.preventDefault();
        deptForm.post('/departments', {
            onSuccess: () => {
                deptForm.reset();
                setDeptModalOpen(false);
            },
        });
    };

    const handleCreateDesig = (e) => {
        e.preventDefault();
        desigForm.post('/designations', {
            onSuccess: () => {
                desigForm.reset();
                setDesigModalOpen(false);
            },
        });
    };

    const handleDeleteDept = (id, name) => {
        if (confirm(`Delete department "${name}"? This requires no active staff assigned.`)) {
            router.delete(`/departments/${id}`);
        }
    };

    const handleDeleteDesig = (id, title) => {
        if (confirm(`Delete designation "${title}"?`)) {
            router.delete(`/designations/${id}`);
        }
    };

    return (
        <AdminLayout title="Departments & Designations">
            <Head title="Departments & Roles" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Departments & Designations
                    </h1>
                    <p className="text-xs text-[#6B7280]">
                        Corporate departmental hierarchy, organizational structures, and job roles
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setDesigModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-2xs transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Designation</span>
                    </button>
                    <button
                        onClick={() => setDeptModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-xs transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Department</span>
                    </button>
                </div>
            </div>

            {/* Department Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {departments.map((dept) => (
                    <div key={dept.id} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-5 flex flex-col justify-between hover:border-[#FFD6C0] transition">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-mono text-xs font-bold text-[#FF5500] bg-[#FFF0E8] px-2 py-0.5 rounded">
                                    {dept.code}
                                </span>
                                <button
                                    onClick={() => handleDeleteDept(dept.id, dept.name)}
                                    className="p-1 text-gray-400 hover:text-red-600 transition"
                                    title="Delete Department"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <h3 className="text-sm font-bold text-[#202124]">{dept.name}</h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{dept.description || 'No description provided.'}</p>
                        </div>

                        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-gray-600 font-semibold">
                                <Users className="h-3.5 w-3.5 text-gray-400" />
                                <span>{dept.employees_count} Employee(s)</span>
                            </div>
                            <span className="text-[11px] text-gray-400">
                                {dept.designations?.length || 0} Roles
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Designations Table */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-[#FF5500]" />
                        <h2 className="text-sm font-bold text-[#202124]">Corporate Designations & Headcounts</h2>
                    </div>
                    <span className="text-xs text-gray-400">Total: {designations.length} Roles</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs">
                        <thead className="bg-[#F7F8FA]">
                            <tr>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Role Title</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Code</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Department</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Assigned Staff</th>
                                <th className="px-5 py-3 text-right font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {designations.map((desig) => (
                                <tr key={desig.id} className="hover:bg-gray-50/70 transition">
                                    <td className="px-5 py-3 font-bold text-gray-900">{desig.title}</td>
                                    <td className="px-5 py-3 font-mono font-bold text-gray-500">{desig.code}</td>
                                    <td className="px-5 py-3 text-gray-700">{desig.department?.name || 'N/A'}</td>
                                    <td className="px-5 py-3">
                                        <span className="font-bold text-[#FF5500] bg-[#FFF0E8] px-2 py-0.5 rounded text-[11px]">
                                            {desig.employees_count} active
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <button
                                            onClick={() => handleDeleteDesig(desig.id, desig.title)}
                                            className="p-1 text-gray-400 hover:text-red-600 transition"
                                            title="Delete Role"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal: Create Department */}
            <Modal
                isOpen={deptModalOpen}
                onClose={() => setDeptModalOpen(false)}
                title="Create Corporate Department"
            >
                <form onSubmit={handleCreateDept} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Department Name *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Finance & Accounting"
                            value={deptForm.data.name}
                            onChange={(e) => deptForm.setData('name', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                        {deptForm.errors.name && <p className="text-xs text-red-600 mt-1">{deptForm.errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Short Department Code *</label>
                        <input
                            type="text"
                            required
                            maxLength={10}
                            placeholder="e.g. FIN"
                            value={deptForm.data.code}
                            onChange={(e) => deptForm.setData('code', e.target.value.toUpperCase())}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] font-mono"
                        />
                        {deptForm.errors.code && <p className="text-xs text-red-600 mt-1">{deptForm.errors.code}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                        <textarea
                            rows={3}
                            placeholder="Brief operational purpose of this division..."
                            value={deptForm.data.description}
                            onChange={(e) => deptForm.setData('description', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setDeptModalOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={deptForm.processing}
                            className="px-4 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-sm"
                        >
                            Save Department
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal: Create Designation */}
            <Modal
                isOpen={desigModalOpen}
                onClose={() => setDesigModalOpen(false)}
                title="Create Job Designation / Role"
            >
                <form onSubmit={handleCreateDesig} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Department *</label>
                        <select
                            required
                            value={desigForm.data.department_id}
                            onChange={(e) => desigForm.setData('department_id', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        >
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Designation Title *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Lead Software Architect"
                            value={desigForm.data.title}
                            onChange={(e) => desigForm.setData('title', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                        {desigForm.errors.title && <p className="text-xs text-red-600 mt-1">{desigForm.errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Role Code *</label>
                        <input
                            type="text"
                            required
                            maxLength={10}
                            placeholder="e.g. LSA"
                            value={desigForm.data.code}
                            onChange={(e) => desigForm.setData('code', e.target.value.toUpperCase())}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] font-mono"
                        />
                        {desigForm.errors.code && <p className="text-xs text-red-600 mt-1">{desigForm.errors.code}</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setDesigModalOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={desigForm.processing}
                            className="px-4 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-sm"
                        >
                            Save Designation
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
