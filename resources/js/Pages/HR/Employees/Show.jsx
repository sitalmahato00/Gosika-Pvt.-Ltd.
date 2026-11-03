import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/Badge';
import {
    ArrowLeft,
    Edit3,
    CreditCard,
    Printer,
    Download,
    Mail,
    Phone,
    Building2,
    Calendar,
    Briefcase,
    HeartPulse,
    ShieldCheck,
    Clock,
    Banknote,
    FolderLock,
    History
} from 'lucide-react';

export default function Show({
    employee,
    attendances,
    leaves,
    salaries,
    documents,
    idCards,
    auditLogs,
    qrCodeUri,
    tab = 'personal'
}) {
    const [activeTab, setActiveTab] = useState(tab);
    const { company } = usePage().props;
    const companyLocation = [company?.address, company?.city, company?.country].filter(Boolean).join(', ');

    const tabs = [
        { id: 'personal', name: 'Personal Profile' },
        { id: 'employment', name: 'Employment & Compensation' },
        { id: 'idcard', name: 'CR80 ID Card' },
        { id: 'attendance', name: 'Attendance History' },
        { id: 'leave', name: 'Leave Record' },
        { id: 'payroll', name: 'Salary Slips' },
        { id: 'documents', name: 'Documents' },
        { id: 'history', name: 'Audit Trail' },
    ];

    const handlePrintProfile = () => {
        window.print();
    };

    return (
        <AdminLayout title={`Employee: ${employee.full_name}`}>
            <Head title={`${employee.full_name} (${employee.employee_code})`} />

            {/* Back link & actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 no-print">
                <div className="flex items-center gap-2">
                    <Link
                        href="/employees"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#FF5500] transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Directory</span>
                    </Link>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={handlePrintProfile}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-2xs transition"
                    >
                        <Printer className="h-4 w-4" />
                        <span>Print Profile</span>
                    </button>
                    <a
                        href={`/employee-id-cards/${employee.id}/pdf`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#FF5500] bg-[#FFF0E8] border border-[#FFD6C0] hover:bg-orange-100 rounded-lg shadow-2xs transition"
                    >
                        <CreditCard className="h-4 w-4" />
                        <span>Download CR80 ID Card</span>
                    </a>
                    <Link
                        href={`/employees/${employee.id}/edit`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-xs transition"
                    >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit Employee</span>
                    </Link>
                </div>
            </div>

            {/* Top Employee Profile Card Banner */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    {/* Photo */}
                    {employee.photo_path ? (
                        <img
                            src={`/storage/${employee.photo_path}`}
                            alt={employee.full_name}
                            className="h-24 w-24 rounded-2xl object-cover border-2 border-[#FF5500] shadow-sm shrink-0"
                        />
                    ) : (
                        <div className="h-24 w-24 rounded-2xl bg-[#FFF0E8] border-2 border-[#FFD6C0] text-[#FF5500] font-black flex items-center justify-center text-2xl shadow-xs shrink-0">
                            {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
                        </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 text-center sm:text-left min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                            <h1 className="text-xl font-black text-[#202124]">{employee.full_name}</h1>
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                    {employee.employee_code}
                                </span>
                                <Badge variant={employee.status === 'active' ? 'success' : 'danger'}>
                                    {employee.status?.toUpperCase()}
                                </Badge>
                            </div>
                        </div>

                        <p className="text-xs font-bold text-[#FF5500] mb-3">
                            {employee.designation?.title || 'Staff'} &bull; <span className="text-gray-600">{employee.department?.name || 'General Management'}</span>
                        </p>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 text-gray-400" />
                                <span>{employee.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-gray-400" />
                                <span>{employee.phone}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                <span>Joined {employee.joining_date}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs bar */}
                <div className="flex items-center gap-1 border-t border-gray-100 mt-6 pt-3 overflow-x-auto no-print">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                                activeTab === t.id
                                    ? 'bg-[#FF5500] text-white shadow-2xs'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {t.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Contents */}
            {activeTab === 'personal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Personal & Demographic Information
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <span className="text-gray-400">Gender:</span>
                                <p className="font-bold text-gray-800 capitalize">{employee.gender}</p>
                            </div>
                            <div>
                                <span className="text-gray-400">Date of Birth:</span>
                                <p className="font-bold text-gray-800">{employee.date_of_birth || 'Not recorded'}</p>
                            </div>
                            <div>
                                <span className="text-gray-400">Marital Status:</span>
                                <p className="font-bold text-gray-800">{employee.marital_status || 'Single'}</p>
                            </div>
                            <div>
                                <span className="text-gray-400">Blood Group:</span>
                                <p className="font-bold text-gray-800 font-mono">{employee.blood_group || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Residential & Emergency Contacts
                        </h3>
                        <div className="space-y-3 text-xs">
                            <div>
                                <span className="text-gray-400">Current Residence:</span>
                                <p className="font-semibold text-gray-800">{employee.current_address || 'Tinkune, Kathmandu'}</p>
                            </div>
                            <div>
                                <span className="text-gray-400">Permanent Address:</span>
                                <p className="font-semibold text-gray-800">{employee.permanent_address || 'N/A'}</p>
                            </div>
                            <div className="pt-2 border-t border-gray-100">
                                <span className="text-gray-400">Emergency Contact:</span>
                                <p className="font-bold text-gray-900">{employee.emergency_contact_name} ({employee.emergency_contact_relation})</p>
                                <p className="font-mono text-gray-600 mt-0.5">{employee.emergency_contact_phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'employment' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Employment Structure
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <span className="text-gray-400">Department:</span>
                                <p className="font-bold text-gray-800">{employee.department?.name}</p>
                            </div>
                            <div>
                                <span className="text-gray-400">Designation:</span>
                                <p className="font-bold text-gray-800">{employee.designation?.title}</p>
                            </div>
                            <div>
                                <span className="text-gray-400">Employment Type:</span>
                                <p className="font-bold text-gray-800 uppercase">{employee.employment_type?.replace('_', ' ')}</p>
                            </div>
                            <div>
                                <span className="text-gray-400">Date of Joining:</span>
                                <p className="font-bold text-gray-800">{employee.joining_date}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Salary & Banking Details
                        </h3>
                        <div className="space-y-3 text-xs">
                            <div>
                                <span className="text-gray-400">Basic Monthly Salary:</span>
                                <p className="font-black text-[#FF5500] text-base font-mono">
                                    {employee.basic_salary === null ? 'Not set' : `NPR ${Number(employee.basic_salary).toLocaleString()}`}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                                <div>
                                    <span className="text-gray-400">Bank Name:</span>
                                    <p className="font-bold text-gray-800">{employee.bank_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400">Account Number:</span>
                                    <p className="font-mono font-bold text-gray-800">{employee.bank_account_no || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CR80 ID Card Preview */}
            {activeTab === 'idcard' && (
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-sm font-bold text-[#202124]">Official CR80 Identity Card</h2>
                            <p className="text-xs text-gray-500">Standard CR80 dimensions (85.60 mm x 53.98 mm) with Front & Back Live Preview</p>
                        </div>
                        <a
                            href={`/employee-id-cards/${employee.id}/pdf`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-sm transition"
                        >
                            <Download className="h-4 w-4" />
                            <span>Download Individual Card (PDF)</span>
                        </a>
                    </div>

                    {/* Interactive CR80 Portrait Visual Preview */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-8 bg-[#F7F8FA] rounded-2xl border border-gray-200">
                        {/* Front Side */}
                        <div className="w-[220px] h-[348px] bg-white rounded-xl shadow-lg border border-gray-200 relative overflow-hidden flex flex-col justify-between p-3 select-none">
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FF5500]" />

                            <div className="pt-2 text-center">
                                <div className="w-10 h-1 mx-auto bg-gray-200 rounded-full border border-dashed border-gray-400 mb-1.5" />
                                {company?.logo_url ? (
                                    <img src={company.logo_url} alt={company.name || 'Company logo'} className="h-6 max-w-[120px] mx-auto object-contain" />
                                ) : (
                                    <span className="text-xs font-black text-gray-900 tracking-tight block">
                                        {company?.trading_name || company?.name || 'GOSIKA'}
                                    </span>
                                )}
                                <p className="text-[6.5px] text-gray-400 uppercase font-bold tracking-wider">Employee Identity Badge</p>
                            </div>

                            <div className="text-center my-1">
                                {employee.photo_path ? (
                                    <img
                                        src={`/storage/${employee.photo_path}`}
                                        alt={employee.full_name}
                                        className="h-20 w-16 mx-auto rounded-lg object-cover border-2 border-[#FF5500] shadow-2xs"
                                    />
                                ) : (
                                    <div className="h-20 w-16 mx-auto rounded-lg bg-[#FFF0E8] border border-[#FF5500] text-[#FF5500] font-black flex items-center justify-center text-base">
                                        {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="text-center space-y-0.5">
                                <p className="text-xs font-black text-gray-900 truncate leading-tight">{employee.full_name}</p>
                                <p className="text-[10px] font-bold text-[#FF5500] truncate">{employee.designation?.title}</p>
                                <span className="inline-block text-[7.5px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full uppercase">
                                    {employee.department?.name}
                                </span>
                            </div>

                            <div className="bg-gray-50 rounded p-1.5 text-[8px] space-y-0.5 border border-gray-100">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-bold">ID:</span>
                                    <span className="font-mono font-bold text-gray-800">{employee.employee_code}</span>
                                </div>
                                {employee.blood_group && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-bold">BLOOD:</span>
                                        <span className="font-bold text-gray-800">{employee.blood_group}</span>
                                    </div>
                                )}
                            </div>

                            {qrCodeUri && (
                                <div className="text-center">
                                    <img src={qrCodeUri} alt="QR" className="h-9 w-9 mx-auto border border-gray-200 rounded p-0.5 bg-white shadow-2xs" />
                                    <span className="text-[6px] text-gray-400 block mt-0.5 uppercase">Scan to Verify</span>
                                </div>
                            )}

                            <div className="bg-[#202124] -mx-3 -mb-3 px-2 py-1 flex items-center justify-between text-[6.5px] text-gray-300">
                                <span>gosika.com</span>
                                <span className="text-[#FF5500] font-bold">AUTHORIZED</span>
                            </div>
                        </div>

                        {/* Back Side */}
                        <div className="w-[220px] h-[348px] bg-white rounded-xl shadow-lg border border-gray-200 relative overflow-hidden flex flex-col justify-between p-3 select-none">
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FF5500]" />

                            <div className="pt-2 text-center">
                                <div className="w-10 h-1 mx-auto bg-gray-200 rounded-full border border-dashed border-gray-400 mb-1.5" />
                                <span className="text-[8px] font-black text-gray-900 uppercase block">Property of GOSIKA</span>
                                <span className="text-[6.5px] text-gray-500">Please return if found</span>
                            </div>

                            <div className="bg-gray-50 border border-gray-100 rounded p-2 text-[7px] text-gray-600 leading-tight space-y-1">
                                <p>&bull; Non-transferable company ID badge.</p>
                                <p>&bull; Wear visibly within corporate facilities.</p>
                                <p>&bull; Report lost or damaged cards to HR.</p>
                            </div>

                            <div className="text-center text-[7px] text-gray-600 leading-tight">
                                <p className="font-bold text-gray-800">{company?.name || 'Company'}</p>
                                {companyLocation && <p>{companyLocation}</p>}
                                {company?.phone && <p>Tel: <span className="font-bold">{company.phone}</span></p>}
                                <p>Emergency: <span className="font-bold text-[#FF5500]">{employee.emergency_contact_phone || company?.phone || '—'}</span></p>
                            </div>

                            <div className="text-center pt-1 border-t border-gray-100">
                                <div className="w-16 border-t border-gray-400 mx-auto mb-0.5" />
                                <span className="text-[6.5px] font-bold text-gray-500 uppercase block">Authorized Signatory</span>
                                <span className="text-[6px] text-gray-400 font-mono mt-0.5 block">CR80-PORTRAIT-V1</span>
                            </div>

                            <div className="bg-[#FF5500] -mx-3 -mb-3 px-2 py-1 text-center text-[6.5px] text-white font-bold uppercase tracking-wider">
                                OFFICIAL COMPANY RECORD
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'attendance' && (
                <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-900">Recent Attendance Records (Last 30 Days)</h3>
                        <Link href="/attendance" className="text-xs font-semibold text-[#FF5500] hover:underline">
                            Full Attendance Ledger
                        </Link>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200 text-xs">
                        <thead className="bg-[#F7F8FA]">
                            <tr>
                                <th className="px-5 py-2.5 text-left font-bold text-gray-500">Date</th>
                                <th className="px-5 py-2.5 text-left font-bold text-gray-500">Clock In</th>
                                <th className="px-5 py-2.5 text-left font-bold text-gray-500">Clock Out</th>
                                <th className="px-5 py-2.5 text-left font-bold text-gray-500">Hours</th>
                                <th className="px-5 py-2.5 text-left font-bold text-gray-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {attendances.map((att) => (
                                <tr key={att.id}>
                                    <td className="px-5 py-2.5 font-semibold text-gray-900">{att.date}</td>
                                    <td className="px-5 py-2.5 text-gray-600">{att.clock_in || '--'}</td>
                                    <td className="px-5 py-2.5 text-gray-600">{att.clock_out || '--'}</td>
                                    <td className="px-5 py-2.5 font-mono">{att.total_hours}h</td>
                                    <td className="px-5 py-2.5">
                                        <Badge variant={att.status === 'present' ? 'success' : att.status === 'late' ? 'warning' : 'danger'}>
                                            {att.status?.toUpperCase()}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'payroll' && (
                <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-900">Historical Salary Slips</h3>
                        <Link href="/payroll" className="text-xs font-semibold text-[#FF5500] hover:underline">
                            Payroll Dashboard
                        </Link>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200 text-xs">
                        <thead className="bg-[#F7F8FA]">
                            <tr>
                                <th className="px-5 py-2.5 text-left font-bold text-gray-500">Slip Number</th>
                                <th className="px-5 py-2.5 text-left font-bold text-gray-500">Period</th>
                                <th className="px-5 py-2.5 text-left font-bold text-gray-500">Gross (NPR)</th>
                                <th className="px-5 py-2.5 text-left font-bold text-gray-500">Deductions</th>
                                <th className="px-5 py-2.5 text-left font-bold text-gray-500">Net Paid</th>
                                <th className="px-5 py-2.5 text-right font-bold text-gray-500">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {salaries.map((sal) => (
                                <tr key={sal.id}>
                                    <td className="px-5 py-2.5 font-mono font-bold text-gray-800">{sal.slip_number}</td>
                                    <td className="px-5 py-2.5 font-semibold text-gray-700">{sal.salary_period}</td>
                                    <td className="px-5 py-2.5 font-mono">{Number(sal.gross_salary).toLocaleString()}</td>
                                    <td className="px-5 py-2.5 font-mono text-red-600">- {Number(sal.total_deductions).toLocaleString()}</td>
                                    <td className="px-5 py-2.5 font-mono font-bold text-emerald-600">NPR {Number(sal.net_salary).toLocaleString()}</td>
                                    <td className="px-5 py-2.5 text-right">
                                        <a
                                            href={`/payroll/${sal.id}/pdf`}
                                            className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5500] hover:underline"
                                        >
                                            <Download className="h-3.5 w-3.5" />
                                            <span>PDF Slip</span>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}
