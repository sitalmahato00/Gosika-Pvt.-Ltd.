import React, { useState, useRef } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import Badge from '@/Components/Badge';
import Modal from '@/Components/Modal';
import {
    FolderLock, Upload, Search, Download, Trash2, X, FileText,
    FileSpreadsheet, FileImage, File, Building2, Users, FileSignature,
    DollarSign, BookOpen, AlertTriangle, Calendar, Link2
} from 'lucide-react';

const CATEGORIES = [
    { value: '', label: 'All Documents' },
    { value: 'company', label: 'Company' },
    { value: 'employee', label: 'Employee' },
    { value: 'contract', label: 'Contract' },
    { value: 'agreement', label: 'Agreement' },
    { value: 'finance', label: 'Finance' },
    { value: 'policy', label: 'Policy' },
];

const CATEGORY_META = {
    company:   { label: 'Company',   color: 'bg-blue-50 text-blue-700',   variant: 'info' },
    employee:  { label: 'Employee',  color: 'bg-purple-50 text-purple-700', variant: 'default' },
    contract:  { label: 'Contract',  color: 'bg-orange-50 text-orange-700', variant: 'warning' },
    agreement: { label: 'Agreement', color: 'bg-teal-50 text-teal-700',   variant: 'default' },
    finance:   { label: 'Finance',   color: 'bg-green-50 text-green-700',  variant: 'success' },
    policy:    { label: 'Policy',    color: 'bg-gray-50 text-gray-700',    variant: 'default' },
};

function fileIcon(ext) {
    const e = (ext || '').toLowerCase();
    if (['pdf'].includes(e)) return <FileText size={22} className="text-red-500" />;
    if (['xlsx', 'xls', 'csv'].includes(e)) return <FileSpreadsheet size={22} className="text-green-600" />;
    if (['docx', 'doc'].includes(e)) return <FileText size={22} className="text-blue-600" />;
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(e)) return <FileImage size={22} className="text-purple-500" />;
    return <File size={22} className="text-gray-400" />;
}

function formatSize(kb) {
    if (!kb) return '—';
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
}

function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function DocumentsIndex({ documents, employees, projects, stats, filters }) {
    const [showUpload, setShowUpload] = useState(false);
    const [search, setSearch] = useState(filters?.search || '');
    const [activeCategory, setActiveCategory] = useState(filters?.category || '');
    const fileRef = useRef();

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        category: 'company',
        employee_id: '',
        project_id: '',
        issue_date: '',
        expiry_date: '',
        notes: '',
        file: null,
    });

    function applyFilter(cat) {
        setActiveCategory(cat);
        router.get('/documents', { category: cat, search }, { preserveState: true, replace: true });
    }

    function applySearch(e) {
        e.preventDefault();
        router.get('/documents', { category: activeCategory, search }, { preserveState: true, replace: true });
    }

    function handleUpload(e) {
        e.preventDefault();
        post('/documents', {
            forceFormData: true,
            onSuccess: () => { setShowUpload(false); reset(); },
        });
    }

    function handleDelete(doc) {
        if (!confirm(`Delete "${doc.title}"? This cannot be undone.`)) return;
        router.delete(`/documents/${doc.id}`);
    }

    const docs = documents.data || [];

    const statCards = [
        { label: 'Total', value: stats.total, cat: '', icon: FolderLock, bg: 'bg-[#FFF0E8] text-[#FF5500]' },
        { label: 'Company', value: stats.company, cat: 'company', icon: Building2, bg: 'bg-blue-50 text-blue-600' },
        { label: 'Employee', value: stats.employee, cat: 'employee', icon: Users, bg: 'bg-purple-50 text-purple-600' },
        { label: 'Contracts', value: stats.contracts, cat: 'contract', icon: FileSignature, bg: 'bg-orange-50 text-orange-600' },
        { label: 'Finance', value: stats.finance, cat: 'finance', icon: DollarSign, bg: 'bg-green-50 text-green-600' },
    ];

    return (
        <AdminLayout title="Document Vault">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#202124]">Document Vault</h1>
                        <p className="text-sm text-gray-500 mt-1">Centralized archive for all company documents</p>
                    </div>
                    <button onClick={() => setShowUpload(true)}
                        className="flex items-center gap-2 bg-[#FF5500] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                        <Upload size={16} /> Upload Document
                    </button>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {statCards.map(s => (
                        <button key={s.label} onClick={() => applyFilter(s.cat)}
                            className={`bg-white border rounded-xl p-4 flex items-center gap-3 text-left hover:shadow-md transition-shadow ${activeCategory === s.cat ? 'border-[#FF5500] ring-1 ring-[#FF5500]/30' : 'border-[#E5E7EB]'}`}>
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.bg}`}>
                                <s.icon size={16} />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-[#202124]">{s.value}</div>
                                <div className="text-xs text-gray-500">{s.label}</div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Category tabs + Search */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-[#E5E7EB]">
                        <div className="flex gap-1 flex-wrap">
                            {CATEGORIES.map(c => (
                                <button key={c.value} onClick={() => applyFilter(c.value)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeCategory === c.value ? 'bg-[#FF5500] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                                    {c.label}
                                </button>
                            ))}
                        </div>
                        <form onSubmit={applySearch} className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search documents..."
                                className="pl-8 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]" />
                        </form>
                    </div>

                    {docs.length === 0 ? (
                        <div className="text-center py-20">
                            <FolderLock size={40} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No documents found</p>
                            <p className="text-gray-400 text-sm mt-1">Upload your first document to get started</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-[#F7F8FA] border-b border-[#E5E7EB]">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Document</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">File</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Linked To</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Upload Date</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Expiry</th>
                                        <th className="text-center px-4 py-3 font-medium text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E7EB]">
                                    {docs.map((doc, i) => {
                                        const meta = CATEGORY_META[doc.category] || {};
                                        const isExpiringSoon = doc.expiry_date && new Date(doc.expiry_date) < new Date(Date.now() + 30 * 86400000);
                                        const isExpired = doc.expiry_date && new Date(doc.expiry_date) < new Date();
                                        return (
                                            <tr key={doc.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F7F8FA]/40'}>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        {fileIcon(doc.file_type)}
                                                        <div>
                                                            <div className="font-medium text-[#202124] max-w-[200px] truncate">{doc.title}</div>
                                                            <div className="text-xs text-gray-400 font-mono">{doc.document_number}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${meta.color}`}>
                                                        {meta.label || doc.category}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-xs text-gray-600 font-mono uppercase">{doc.file_type}</div>
                                                    <div className="text-xs text-gray-400">{formatSize(doc.file_size_kb)}</div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {doc.employee ? (
                                                        <span className="flex items-center gap-1 text-xs">
                                                            <Users size={11} className="text-purple-500" />
                                                            {doc.employee.full_name}
                                                        </span>
                                                    ) : doc.project ? (
                                                        <span className="flex items-center gap-1 text-xs">
                                                            <Link2 size={11} className="text-blue-500" />
                                                            {doc.project.name}
                                                        </span>
                                                    ) : <span className="text-gray-300">—</span>}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-500">{formatDate(doc.created_at)}</td>
                                                <td className="px-4 py-3">
                                                    {doc.expiry_date ? (
                                                        <div className={`flex items-center gap-1 text-xs ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-amber-600' : 'text-gray-500'}`}>
                                                            {(isExpired || isExpiringSoon) && <AlertTriangle size={11} />}
                                                            {formatDate(doc.expiry_date)}
                                                        </div>
                                                    ) : <span className="text-gray-300 text-xs">No expiry</span>}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <a href={`/documents/${doc.id}/download`}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                            title="Download">
                                                            <Download size={15} />
                                                        </a>
                                                        <button onClick={() => handleDelete(doc)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                            title="Delete">
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {documents.last_page > 1 && (
                        <div className="px-4 py-3 border-t border-[#E5E7EB]">
                            <Pagination links={documents.links} />
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            <Modal show={showUpload} onClose={() => { setShowUpload(false); reset(); }} maxWidth="2xl">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-[#202124]">Upload Document</h2>
                        <button onClick={() => { setShowUpload(false); reset(); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleUpload} className="space-y-4" encType="multipart/form-data">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Document Title <span className="text-red-500">*</span></label>
                                <input type="text" value={data.title} onChange={e => setData('title', e.target.value)}
                                    placeholder="e.g. Employment Contract – Aarav Sharma"
                                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]" />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                                <select value={data.category} onChange={e => setData('category', e.target.value)}
                                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]">
                                    <option value="company">Company</option>
                                    <option value="employee">Employee</option>
                                    <option value="contract">Contract</option>
                                    <option value="agreement">Agreement</option>
                                    <option value="finance">Finance</option>
                                    <option value="policy">Policy</option>
                                </select>
                            </div>
                            {data.category === 'employee' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Linked Employee</label>
                                    <select value={data.employee_id} onChange={e => setData('employee_id', e.target.value)}
                                        className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]">
                                        <option value="">— None —</option>
                                        {(employees || []).map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.employee_code})</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Linked Project</label>
                                <select value={data.project_id} onChange={e => setData('project_id', e.target.value)}
                                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]">
                                    <option value="">— None —</option>
                                    {(projects || []).map(p => (
                                        <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                                <input type="date" value={data.issue_date} onChange={e => setData('issue_date', e.target.value)}
                                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                <input type="date" value={data.expiry_date} onChange={e => setData('expiry_date', e.target.value)}
                                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={2}
                                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500] resize-none" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">File <span className="text-red-500">*</span></label>
                                <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-6 text-center hover:border-[#FF5500]/40 transition-colors">
                                    <input ref={fileRef} type="file" className="hidden"
                                        onChange={e => setData('file', e.target.files[0])} />
                                    {data.file ? (
                                        <div className="flex items-center justify-center gap-3">
                                            {fileIcon(data.file.name.split('.').pop())}
                                            <div className="text-left">
                                                <div className="text-sm font-medium text-[#202124]">{data.file.name}</div>
                                                <div className="text-xs text-gray-400">{formatSize(Math.round(data.file.size / 1024))}</div>
                                            </div>
                                            <button type="button" onClick={() => setData('file', null)} className="text-gray-400 hover:text-red-500 ml-2"><X size={16} /></button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload size={24} className="mx-auto text-gray-300 mb-2" />
                                            <p className="text-sm text-gray-500">Drag & drop or <button type="button" onClick={() => fileRef.current?.click()} className="text-[#FF5500] font-medium hover:underline">browse file</button></p>
                                            <p className="text-xs text-gray-400 mt-1">PDF, Word, Excel, Images — Max 10MB</p>
                                        </div>
                                    )}
                                </div>
                                {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => { setShowUpload(false); reset(); }}
                                className="px-4 py-2 text-sm border border-[#E5E7EB] rounded-lg hover:bg-gray-50">Cancel</button>
                            <button type="submit" disabled={processing}
                                className="px-5 py-2 text-sm bg-[#FF5500] text-white rounded-lg hover:bg-orange-600 disabled:opacity-60 transition-colors">
                                {processing ? 'Uploading...' : 'Upload Document'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
