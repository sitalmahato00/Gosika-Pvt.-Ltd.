import React, { useState, useMemo } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import Badge from '@/Components/Badge';
import Pagination from '@/Components/Pagination';
import {
    Plus,
    Search,
    Building2,
    Users,
    Package,
    Boxes,
    Pencil,
    Eye,
    CheckCircle2,
    XCircle,
    Phone,
    Mail,
    MapPin,
    FileText,
    Hash,
    ShoppingBag,
    StickyNote,
} from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getStatusBadge(status) {
    if (status === 'active') return <Badge variant="success">Active</Badge>;
    return <Badge variant="default">Inactive</Badge>;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Index({ suppliers }) {
    // ── Modal state ──────────────────────────────────────────────────────────
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    // ── Client-side search ───────────────────────────────────────────────────
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return suppliers.data;
        return suppliers.data.filter(
            (s) =>
                s.name?.toLowerCase().includes(q) ||
                s.contact_person?.toLowerCase().includes(q) ||
                s.code?.toLowerCase().includes(q)
        );
    }, [search, suppliers.data]);

    // ── Summary stats ────────────────────────────────────────────────────────
    const total = suppliers.data.length;
    const activeCount = suppliers.data.filter((s) => s.status === 'active').length;
    const totalAssets = suppliers.data.reduce((sum, s) => sum + (s.assets_count || 0), 0);
    const totalInventory = suppliers.data.reduce((sum, s) => sum + (s.inventory_items_count || 0), 0);

    // ── Create form ──────────────────────────────────────────────────────────
    const emptyForm = {
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        tax_number: '',
        products_or_services: '',
        notes: '',
        status: 'active',
    };

    const form = useForm({ ...emptyForm });

    const handleCreate = (e) => {
        e.preventDefault();
        form.post('/suppliers', {
            onSuccess: () => {
                form.reset();
                setCreateModalOpen(false);
            },
        });
    };

    const handleOpenCreate = () => {
        form.setData({ ...emptyForm });
        form.clearErrors();
        setCreateModalOpen(true);
    };

    // ── Edit form ─────────────────────────────────────────────────────────────
    const editForm = useForm({ ...emptyForm });

    const handleOpenEdit = (supplier) => {
        setSelectedSupplier(supplier);
        editForm.setData({
            name: supplier.name || '',
            contact_person: supplier.contact_person || '',
            email: supplier.email || '',
            phone: supplier.phone || '',
            address: supplier.address || '',
            tax_number: supplier.tax_number || '',
            products_or_services: supplier.products_or_services || '',
            notes: supplier.notes || '',
            status: supplier.status || 'active',
        });
        editForm.clearErrors();
        setEditModalOpen(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.put(`/suppliers/${selectedSupplier.id}`, {
            onSuccess: () => {
                setEditModalOpen(false);
                setSelectedSupplier(null);
            },
        });
    };

    // ── Detail view ───────────────────────────────────────────────────────────
    const handleOpenDetail = (supplier) => {
        setSelectedSupplier(supplier);
        setDetailModalOpen(true);
    };

    return (
        <AdminLayout title="Suppliers Directory">
            <Head title="Suppliers Directory" />

            {/* ── Page Header ───────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Suppliers Directory
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Manage vendor relationships, contact information, and linked procurement items
                    </p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-sm transition"
                >
                    <Plus className="h-4 w-4" />
                    Add Supplier
                </button>
            </div>

            {/* ── Summary Stats ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Suppliers</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900">{suppliers.total ?? total}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Active</span>
                    </div>
                    <p className="text-2xl font-black text-emerald-600">{activeCount}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <Package className="h-4 w-4 text-blue-500" />
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Assets Linked</span>
                    </div>
                    <p className="text-2xl font-black text-blue-600">{totalAssets}</p>
                </div>
                <div className="bg-[#FFF0E8] p-4 rounded-xl border border-[#FFD6C0] shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <Boxes className="h-4 w-4 text-[#FF5500]" />
                        <span className="text-[10px] font-bold text-[#662200] uppercase tracking-wide">Inventory Items</span>
                    </div>
                    <p className="text-2xl font-black text-[#FF5500]">{totalInventory}</p>
                </div>
            </div>

            {/* ── Search Bar ────────────────────────────────────────────────── */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, contact, or code..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
                    />
                </div>
            </div>

            {/* ── Suppliers Table ───────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100 text-xs">
                        <thead className="bg-[#F7F8FA]">
                            <tr>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wide">Code</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wide">Supplier Name</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wide">Contact Person</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wide">Phone / Email</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wide">Tax Number</th>
                                <th className="px-5 py-3 text-center font-bold text-gray-500 uppercase tracking-wide">Linked Items</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wide">Status</th>
                                <th className="px-5 py-3 text-right font-bold text-gray-500 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length > 0 ? (
                                filtered.map((supplier) => (
                                    <tr key={supplier.id} className="hover:bg-gray-50/70 transition-colors">
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <span className="font-mono font-bold text-[#FF5500] text-[11px] bg-[#FFF0E8] px-2 py-0.5 rounded">
                                                {supplier.code}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <p className="font-bold text-gray-900">{supplier.name}</p>
                                            {supplier.products_or_services && (
                                                <p className="text-[10px] text-gray-400 truncate max-w-[180px]">
                                                    {supplier.products_or_services}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-5 py-3 text-gray-700 font-medium">
                                            {supplier.contact_person || <span className="text-gray-400 italic">—</span>}
                                        </td>
                                        <td className="px-5 py-3">
                                            {supplier.phone && (
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <Phone className="h-3 w-3 text-gray-400" />
                                                    <span>{supplier.phone}</span>
                                                </div>
                                            )}
                                            {supplier.email && (
                                                <div className="flex items-center gap-1 text-gray-500 mt-0.5">
                                                    <Mail className="h-3 w-3 text-gray-400" />
                                                    <span className="truncate max-w-[150px]">{supplier.email}</span>
                                                </div>
                                            )}
                                            {!supplier.phone && !supplier.email && (
                                                <span className="text-gray-400 italic">—</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3 font-mono text-gray-600">
                                            {supplier.tax_number || <span className="text-gray-400 italic">—</span>}
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="inline-flex items-center gap-1 text-blue-600 font-bold">
                                                    <Package className="h-3 w-3" />
                                                    {supplier.assets_count ?? 0}
                                                </span>
                                                <span className="text-gray-300">|</span>
                                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                                    <Boxes className="h-3 w-3" />
                                                    {supplier.inventory_items_count ?? 0}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">{getStatusBadge(supplier.status)}</td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenDetail(supplier)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEdit(supplier)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:bg-[#FFF0E8] hover:text-[#FF5500] transition"
                                                    title="Edit Supplier"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-16">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-[#FFF0E8] flex items-center justify-center">
                                                <Building2 className="h-6 w-6 text-[#FF5500]" />
                                            </div>
                                            <p className="text-sm font-semibold text-gray-500">
                                                {search ? 'No suppliers match your search.' : 'No suppliers added yet.'}
                                            </p>
                                            {!search && (
                                                <button
                                                    onClick={handleOpenCreate}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5500] hover:underline"
                                                >
                                                    <Plus className="h-3.5 w-3.5" /> Add your first supplier
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={suppliers.links} />
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* Modal: Create Supplier                                          */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Add New Supplier">
                <SupplierForm
                    form={form}
                    onSubmit={handleCreate}
                    onCancel={() => setCreateModalOpen(false)}
                    submitLabel="Add Supplier"
                />
            </Modal>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* Modal: Edit Supplier                                            */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title={`Edit Supplier — ${selectedSupplier?.name ?? ''}`}>
                <SupplierForm
                    form={editForm}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditModalOpen(false)}
                    submitLabel="Save Changes"
                />
            </Modal>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* Modal: Supplier Details                                         */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {selectedSupplier && (
                <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Supplier Details">
                    <SupplierDetail supplier={selectedSupplier} onEdit={() => { setDetailModalOpen(false); handleOpenEdit(selectedSupplier); }} />
                </Modal>
            )}
        </AdminLayout>
    );
}

// ─── Supplier Form (shared by Create & Edit) ─────────────────────────────────

function SupplierForm({ form, onSubmit, onCancel, submitLabel }) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {/* Name */}
            <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                    Supplier Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    required
                    placeholder="e.g. Tech Solutions Pvt. Ltd."
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
                />
                {form.errors.name && <p className="mt-1 text-[10px] text-red-500">{form.errors.name}</p>}
            </div>

            {/* Contact Person & Tax Number */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Contact Person</label>
                    <input
                        type="text"
                        placeholder="Full name"
                        value={form.data.contact_person}
                        onChange={(e) => form.setData('contact_person', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Tax Number (PAN/VAT)</label>
                    <input
                        type="text"
                        placeholder="e.g. 600123456"
                        value={form.data.tax_number}
                        onChange={(e) => form.setData('tax_number', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5500] font-mono"
                    />
                </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        placeholder="vendor@company.com"
                        value={form.data.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                    <input
                        type="text"
                        placeholder="+977-01-XXXXXXX"
                        value={form.data.phone}
                        onChange={(e) => form.setData('phone', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
                    />
                </div>
            </div>

            {/* Address */}
            <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Address</label>
                <textarea
                    rows={2}
                    placeholder="Street, City, District..."
                    value={form.data.address}
                    onChange={(e) => form.setData('address', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5500] resize-none"
                />
            </div>

            {/* Products/Services */}
            <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Products / Services Supplied</label>
                <textarea
                    rows={2}
                    placeholder="e.g. Laptops, Monitors, Networking Equipment..."
                    value={form.data.products_or_services}
                    onChange={(e) => form.setData('products_or_services', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5500] resize-none"
                />
            </div>

            {/* Notes */}
            <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Internal Notes</label>
                <textarea
                    rows={2}
                    placeholder="Any notes for internal reference..."
                    value={form.data.notes}
                    onChange={(e) => form.setData('notes', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5500] resize-none"
                />
            </div>

            {/* Status */}
            <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                <select
                    value={form.data.status}
                    onChange={(e) => form.setData('status', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={form.processing}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-sm disabled:opacity-60 transition"
                >
                    {form.processing ? 'Saving…' : submitLabel}
                </button>
            </div>
        </form>
    );
}

// ─── Supplier Detail Card ─────────────────────────────────────────────────────

function SupplierDetail({ supplier, onEdit }) {
    const DetailRow = ({ icon: Icon, label, value }) =>
        value ? (
            <div className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <Icon className="h-4 w-4 text-[#FF5500] mt-0.5 shrink-0" />
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
                    <p className="text-xs text-gray-800 font-medium mt-0.5">{value}</p>
                </div>
            </div>
        ) : null;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                    <p className="font-mono text-[11px] text-[#FF5500] font-bold">{supplier.code}</p>
                    <h2 className="text-lg font-black text-gray-900 mt-0.5">{supplier.name}</h2>
                </div>
                <div className="flex items-center gap-2">
                    {supplier.status === 'active' ? (
                        <Badge variant="success">Active</Badge>
                    ) : (
                        <Badge variant="default">Inactive</Badge>
                    )}
                </div>
            </div>

            {/* Details */}
            <div className="bg-[#F7F8FA] rounded-xl p-4 space-y-0.5">
                <DetailRow icon={Users} label="Contact Person" value={supplier.contact_person} />
                <DetailRow icon={Mail} label="Email" value={supplier.email} />
                <DetailRow icon={Phone} label="Phone" value={supplier.phone} />
                <DetailRow icon={MapPin} label="Address" value={supplier.address} />
                <DetailRow icon={Hash} label="Tax Number (PAN/VAT)" value={supplier.tax_number} />
                <DetailRow icon={ShoppingBag} label="Products / Services" value={supplier.products_or_services} />
                <DetailRow icon={StickyNote} label="Internal Notes" value={supplier.notes} />
            </div>

            {/* Linked items */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                    <Package className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-xl font-black text-blue-700">{supplier.assets_count ?? 0}</p>
                    <p className="text-[10px] font-bold text-blue-500 uppercase">Assets Linked</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                    <Boxes className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                    <p className="text-xl font-black text-emerald-700">{supplier.inventory_items_count ?? 0}</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase">Inventory Items</p>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg transition"
                >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit Supplier
                </button>
            </div>
        </div>
    );
}
