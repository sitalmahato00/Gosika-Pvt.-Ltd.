import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/Badge';
import Pagination from '@/Components/Pagination';
import {
    Users,
    Search,
    Filter,
    Plus,
    Download,
    Eye,
    Edit3,
    Trash2,
    CreditCard,
    Building2,
    Briefcase
} from 'lucide-react';

export default function Index({ employees, departments, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [departmentId, setDepartmentId] = useState(filters.department_id || '');
    const [status, setStatus] = useState(filters.status || '');
    const [employmentType, setEmploymentType] = useState(filters.employment_type || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/employees', {
            search,
            department_id: departmentId,
            status,
            employment_type: employmentType,
        }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setDepartmentId('');
        setStatus('');
        setEmploymentType('');
        router.get('/employees');
    };

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to deactivate and archive ${name}?`)) {
            router.delete(`/employees/${id}`);
        }
    };

    return (
        <AdminLayout title="Employee Directory">
            <Head title="Employees Directory" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Employee Management
                    </h1>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                        Manage corporate staff records, profiles, salaries, and credentials
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <a
                        href="/employees/export-csv"
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-2xs transition"
                    >
                        <Download className="h-4 w-4" />
                        <span>Export CSV</span>
                    </a>
                    <Link
                        href="/employees/create"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-xs transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add New Employee</span>
                    </Link>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs mb-6">
                <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search name, code, email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>

                    {/* Department */}
                    <div>
                        <select
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#FF5500]"
                        >
                            <option value="">All Departments</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#FF5500]"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="on_leave">On Leave</option>
                            <option value="resigned">Resigned</option>
                            <option value="terminated">Terminated</option>
                        </select>
                    </div>

                    {/* Employment Type */}
                    <div>
                        <select
                            value={employmentType}
                            onChange={(e) => setEmploymentType(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#FF5500]"
                        >
                            <option value="">All Employment Types</option>
                            <option value="full_time">Full Time</option>
                            <option value="part_time">Part Time</option>
                            <option value="contract">Contract</option>
                            <option value="intern">Intern</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            className="flex-1 px-3 py-1.5 text-xs font-bold text-white bg-[#202124] hover:bg-black rounded-lg transition"
                        >
                            Filter
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>

            {/* Employee Table */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#F7F8FA]">
                            <tr>
                                <th className="px-5 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    Employee
                                </th>
                                <th className="px-5 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    Department & Role
                                </th>
                                <th className="px-5 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    Contact Details
                                </th>
                                <th className="px-5 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    Salary (NPR)
                                </th>
                                <th className="px-5 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-5 py-3 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {employees.data.length > 0 ? (
                                employees.data.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-gray-50/70 transition">
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                {emp.photo_path ? (
                                                    <img
                                                        src={`/storage/${emp.photo_path}`}
                                                        alt={emp.full_name}
                                                        className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-[#FFF0E8] border border-[#FFD6C0] text-[#FF5500] font-bold flex items-center justify-center text-xs">
                                                        {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <Link
                                                        href={`/employees/${emp.id}`}
                                                        className="text-xs font-bold text-[#202124] hover:text-[#FF5500] transition"
                                                    >
                                                        {emp.full_name}
                                                    </Link>
                                                    <p className="text-[10px] font-mono text-gray-400 mt-0.5">
                                                        {emp.employee_code}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <p className="text-xs font-semibold text-gray-800">{emp.designation?.title || 'Staff'}</p>
                                            <p className="text-[10px] text-gray-500">{emp.department?.name || 'General'}</p>
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <p className="text-xs text-gray-800 font-medium">{emp.email}</p>
                                            <p className="text-[10px] text-gray-500">{emp.phone}</p>
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <p className="text-xs font-bold text-gray-900 font-mono">
                                                {emp.basic_salary === null ? 'Not set' : `रू ${Number(emp.basic_salary).toLocaleString()}`}
                                            </p>
                                            <p className="text-[10px] text-gray-400 uppercase">
                                                {emp.employment_type?.replace('_', ' ')}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <Badge variant={emp.status === 'active' ? 'success' : emp.status === 'on_leave' ? 'warning' : 'danger'}>
                                                {emp.status?.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={`/employees/${emp.id}`}
                                                    className="p-1.5 text-gray-500 hover:text-[#FF5500] hover:bg-orange-50 rounded-lg transition"
                                                    title="View Profile"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/employee-id-cards?employee_id=${emp.id}`}
                                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="View ID Card"
                                                >
                                                    <CreditCard className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/employees/${emp.id}/edit`}
                                                    className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                                    title="Edit Details"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(emp.id, emp.full_name)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Archive Employee"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-xs text-gray-400">
                                        No employee records found matching your filter criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={employees.links} />
            </div>
        </AdminLayout>
    );
}
