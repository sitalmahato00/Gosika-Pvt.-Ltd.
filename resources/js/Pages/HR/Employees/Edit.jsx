import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ArrowLeft,
    User,
    Building2,
    Banknote,
    HeartPulse
} from 'lucide-react';

export default function Edit({ employee, departments }) {
    const [selectedDeptId, setSelectedDeptId] = useState(employee.department_id || '');

    const { data, setData, put, processing, errors } = useForm({
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        gender: employee.gender || 'male',
        date_of_birth: employee.date_of_birth || '',
        marital_status: employee.marital_status || 'Single',
        blood_group: employee.blood_group || 'O+',
        permanent_address: employee.permanent_address || '',
        current_address: employee.current_address || '',
        department_id: employee.department_id || '',
        designation_id: employee.designation_id || '',
        employment_type: employee.employment_type || 'full_time',
        joining_date: employee.joining_date || '',
        exit_date: employee.exit_date || '',
        exit_reason: employee.exit_reason || '',
        basic_salary: employee.basic_salary || '',
        bank_name: employee.bank_name || '',
        bank_account_no: employee.bank_account_no || '',
        bank_branch: employee.bank_branch || '',
        emergency_contact_name: employee.emergency_contact_name || '',
        emergency_contact_phone: employee.emergency_contact_phone || '',
        emergency_contact_relation: employee.emergency_contact_relation || '',
        status: employee.status || 'active',
        notes: employee.notes || '',
        photo: null,
    });

    const [previewUrl, setPreviewUrl] = useState(
        employee.photo_path ? `/storage/${employee.photo_path}` : null
    );

    const activeDepartment = departments.find((d) => String(d.id) === String(selectedDeptId));
    const availableDesignations = activeDepartment ? activeDepartment.designations : [];

    const handleDeptChange = (deptId) => {
        setSelectedDeptId(deptId);
        setData({
            ...data,
            department_id: deptId,
            designation_id: '',
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photo', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(`/employees/${employee.id}`, {
            _method: 'put',
            ...data,
        }, {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title={`Edit: ${employee.full_name}`}>
            <Head title={`Edit ${employee.full_name}`} />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <Link href={`/employees/${employee.id}`} className="text-xs font-semibold text-gray-500 hover:text-[#FF5500]">
                        &larr; Back to Profile
                    </Link>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight mt-1">
                        Edit Employee Details
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                        <User className="h-5 w-5 text-[#FF5500]" />
                        <h2 className="text-sm font-bold text-[#202124]">Personal Information</h2>
                    </div>

                    {/* Photo Upload with Preview */}
                    <div className="flex items-center gap-5 p-4 mb-4 bg-[#F7F8FA] border border-gray-200 rounded-xl">
                        <div className="shrink-0">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-16 h-20 object-cover rounded-xl border-2 border-[#FF5500] shadow-sm"
                                />
                            ) : (
                                <div className="w-16 h-20 rounded-xl bg-[#FFF0E8] border border-dashed border-[#FF5500] text-[#FF5500] flex items-center justify-center font-bold text-xs text-center p-1">
                                    No Photo
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Employee Portrait Photo (for CR80 ID Card & Profile)
                            </label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={handlePhotoChange}
                                className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#FFF0E8] file:text-[#FF5500] hover:file:bg-orange-100 cursor-pointer"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Accepts JPG, PNG, WebP (Max 2MB). Ideal ratio: Portrait 3:4.</p>
                            {errors.photo && <p className="text-xs text-red-600 mt-1">{errors.photo}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">First Name *</label>
                            <input
                                type="text"
                                required
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                            {errors.first_name && <p className="text-xs text-red-600 mt-1">{errors.first_name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Last Name *</label>
                            <input
                                type="text"
                                required
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                            {errors.last_name && <p className="text-xs text-red-600 mt-1">{errors.last_name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Status *</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="active">Active</option>
                                <option value="on_leave">On Leave</option>
                                <option value="resigned">Resigned</option>
                                <option value="terminated">Terminated</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Official Email *</label>
                            <input
                                type="email"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                            <input
                                type="text"
                                required
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Blood Group</label>
                            <input
                                type="text"
                                value={data.blood_group}
                                onChange={(e) => setData('blood_group', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-xs font-bold text-gray-700 mb-1">Current Address</label>
                            <input
                                type="text"
                                value={data.current_address}
                                onChange={(e) => setData('current_address', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>
                    </div>
                </div>

                {/* Employment & Salary */}
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                        <Building2 className="h-5 w-5 text-[#FF5500]" />
                        <h2 className="text-sm font-bold text-[#202124]">Department, Role & Basic Salary</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Department *</label>
                            <select
                                required
                                value={data.department_id}
                                onChange={(e) => handleDeptChange(e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="">Select Department</option>
                                {departments.map((d) => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Designation *</label>
                            <select
                                required
                                value={data.designation_id}
                                onChange={(e) => setData('designation_id', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="">Select Designation</option>
                                {availableDesignations.map((des) => (
                                    <option key={des.id} value={des.id}>{des.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Basic Salary (NPR)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.basic_salary}
                                onChange={(e) => setData('basic_salary', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] font-mono font-bold"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <Link
                        href={`/employees/${employee.id}`}
                        className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-sm transition disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Update Employee Record'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
