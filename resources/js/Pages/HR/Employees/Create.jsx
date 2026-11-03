import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ArrowLeft,
    Upload,
    User,
    Building2,
    Briefcase,
    Phone,
    Mail,
    Banknote,
    HeartPulse,
    FileText
} from 'lucide-react';

export default function Create({ departments }) {
    const [selectedDeptId, setSelectedDeptId] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        gender: 'male',
        date_of_birth: '',
        marital_status: 'Single',
        blood_group: 'O+',
        permanent_address: '',
        current_address: '',
        department_id: '',
        designation_id: '',
        employment_type: 'full_time',
        joining_date: new Date().toISOString().split('T')[0],
        basic_salary: '',
        bank_name: '',
        bank_account_no: '',
        bank_branch: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_contact_relation: '',
        status: 'active',
        notes: '',
        photo: null,
    });

    const [previewUrl, setPreviewUrl] = useState(null);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/employees');
    };

    return (
        <AdminLayout title="Add New Employee">
            <Head title="Register Employee" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/employees" className="text-xs font-semibold text-gray-500 hover:text-[#FF5500]">
                            &larr; Back to Directory
                        </Link>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Employee Registration Form
                    </h1>
                    <p className="text-xs text-[#6B7280]">
                        Record a new staff member and automatically generate their CR80 ID Card
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Personal Details */}
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                        <User className="h-5 w-5 text-[#FF5500]" />
                        <h2 className="text-sm font-bold text-[#202124]">Personal Information</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* First Name */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">First Name *</label>
                            <input
                                type="text"
                                required
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                placeholder="Aarav"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                            {errors.first_name && <p className="text-xs text-red-600 mt-1">{errors.first_name}</p>}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Last Name *</label>
                            <input
                                type="text"
                                required
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                placeholder="Sharma"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                            {errors.last_name && <p className="text-xs text-red-600 mt-1">{errors.last_name}</p>}
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Gender *</label>
                            <select
                                value={data.gender}
                                onChange={(e) => setData('gender', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Date of Birth</label>
                            <input
                                type="date"
                                value={data.date_of_birth}
                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        {/* Marital Status */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Marital Status</label>
                            <select
                                value={data.marital_status}
                                onChange={(e) => setData('marital_status', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                            </select>
                        </div>

                        {/* Blood Group */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Blood Group</label>
                            <select
                                value={data.blood_group}
                                onChange={(e) => setData('blood_group', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Official Email *</label>
                            <input
                                type="email"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="aarav@gosika.com"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                            <input
                                type="text"
                                required
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="+977-9841122334"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                            {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                        </div>

                        {/* Photo Upload with Preview */}
                        <div className="sm:col-span-1">
                            <label className="block text-xs font-bold text-gray-700 mb-1">Portrait Profile Photo</label>
                            <div className="flex items-center gap-3">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-12 h-14 object-cover rounded-lg border-2 border-[#FF5500] shrink-0"
                                    />
                                ) : (
                                    <div className="w-12 h-14 rounded-lg bg-[#FFF0E8] border border-dashed border-[#FF5500] text-[#FF5500] flex items-center justify-center font-bold text-[10px] shrink-0">
                                        Photo
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setData('photo', file);
                                            setPreviewUrl(URL.createObjectURL(file));
                                        }
                                    }}
                                    className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#FFF0E8] file:text-[#FF5500] hover:file:bg-orange-100 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Permanent Address */}
                        <div className="sm:col-span-1">
                            <label className="block text-xs font-bold text-gray-700 mb-1">Permanent Address</label>
                            <input
                                type="text"
                                value={data.permanent_address}
                                onChange={(e) => setData('permanent_address', e.target.value)}
                                placeholder="Ward 4, Pokhara, Kaski"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        {/* Current Address */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 mb-1">Current Residence Address</label>
                            <input
                                type="text"
                                value={data.current_address}
                                onChange={(e) => setData('current_address', e.target.value)}
                                placeholder="Tinkune, Kathmandu"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Employment & Designation */}
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                        <Building2 className="h-5 w-5 text-[#FF5500]" />
                        <h2 className="text-sm font-bold text-[#202124]">Employment & Department Assignment</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        {/* Department */}
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
                            {errors.department_id && <p className="text-xs text-red-600 mt-1">{errors.department_id}</p>}
                        </div>

                        {/* Designation */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Designation *</label>
                            <select
                                required
                                value={data.designation_id}
                                onChange={(e) => setData('designation_id', e.target.value)}
                                disabled={!selectedDeptId}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] disabled:bg-gray-50"
                            >
                                <option value="">Select Designation</option>
                                {availableDesignations.map((des) => (
                                    <option key={des.id} value={des.id}>{des.title}</option>
                                ))}
                            </select>
                            {errors.designation_id && <p className="text-xs text-red-600 mt-1">{errors.designation_id}</p>}
                        </div>

                        {/* Employment Type */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Employment Type *</label>
                            <select
                                value={data.employment_type}
                                onChange={(e) => setData('employment_type', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="full_time">Full Time</option>
                                <option value="part_time">Part Time</option>
                                <option value="contract">Contract</option>
                                <option value="intern">Intern</option>
                            </select>
                        </div>

                        {/* Joining Date */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Joining Date *</label>
                            <input
                                type="date"
                                required
                                value={data.joining_date}
                                onChange={(e) => setData('joining_date', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Compensation & Bank Account */}
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                        <Banknote className="h-5 w-5 text-[#FF5500]" />
                        <h2 className="text-sm font-bold text-[#202124]">Compensation & Bank Information</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        {/* Basic Salary */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Basic Monthly Salary (NPR) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="100"
                                value={data.basic_salary}
                                onChange={(e) => setData('basic_salary', e.target.value)}
                                placeholder="85000"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] font-mono font-bold"
                            />
                            {errors.basic_salary && <p className="text-xs text-red-600 mt-1">{errors.basic_salary}</p>}
                        </div>

                        {/* Bank Name */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Bank Name</label>
                            <input
                                type="text"
                                value={data.bank_name}
                                onChange={(e) => setData('bank_name', e.target.value)}
                                placeholder="Nabil Bank Ltd"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        {/* Account Number */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Bank Account Number</label>
                            <input
                                type="text"
                                value={data.bank_account_no}
                                onChange={(e) => setData('bank_account_no', e.target.value)}
                                placeholder="0120019988112"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] font-mono"
                            />
                        </div>

                        {/* Bank Branch */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Branch Name</label>
                            <input
                                type="text"
                                value={data.bank_branch}
                                onChange={(e) => setData('bank_branch', e.target.value)}
                                placeholder="Tinkune Branch"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>
                    </div>
                </div>

                {/* 4. Emergency Contacts & Notes */}
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                        <HeartPulse className="h-5 w-5 text-[#FF5500]" />
                        <h2 className="text-sm font-bold text-[#202124]">Emergency Contact & Remarks</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Contact Person Name</label>
                            <input
                                type="text"
                                value={data.emergency_contact_name}
                                onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                placeholder="Sunita Sharma"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Emergency Phone</label>
                            <input
                                type="text"
                                value={data.emergency_contact_phone}
                                onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                                placeholder="+977-9841009988"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Relationship</label>
                            <input
                                type="text"
                                value={data.emergency_contact_relation}
                                onChange={(e) => setData('emergency_contact_relation', e.target.value)}
                                placeholder="Spouse / Parent / Sibling"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-xs font-bold text-gray-700 mb-1">Admin Notes</label>
                            <textarea
                                rows={2}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Special agreements, equipment notes, probation notes..."
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Link
                        href="/employees"
                        className="px-5 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-sm transition disabled:opacity-50"
                    >
                        {processing ? 'Registering...' : 'Complete Registration & Generate ID Card'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
