import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import Badge from '@/Components/Badge';
import Pagination from '@/Components/Pagination';
import {
    Package,
    Plus,
    Search,
    Wrench,
    Calendar,
    User,
    ShieldAlert,
    Cpu,
    CheckCircle2,
    Pencil
} from 'lucide-react';

export default function Index({ assets, suppliers, employees, stats, filters }) {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [editingAsset, setEditingAsset] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [status, setStatus] = useState(filters.status || '');

    const form = useForm({
        name: '',
        category: 'IT Equipment',
        serial_number: '',
        supplier_id: '',
        purchase_date: new Date().toISOString().split('T')[0],
        purchase_cost: '',
        warranty_expiry: '',
        condition: 'good',
        assigned_employee_id: '',
        status: 'in_use',
        notes: '',
        image: null,
    });

    const maintenanceForm = useForm({
        maintenance_date: new Date().toISOString().split('T')[0],
        cost: '',
        description: '',
        service_provider: '',
        next_service_date: '',
        status: 'completed',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/assets', { search, category, status }, { preserveState: true });
    };

    const handleOpenCreate = () => {
        setEditingAsset(null);
        form.reset();
        form.clearErrors();
        setImagePreview(null);
        setCreateModalOpen(true);
    };

    const handleOpenEdit = (asset) => {
        setEditingAsset(asset);
        form.setData({
            name: asset.name || '',
            category: asset.category || 'IT Equipment',
            serial_number: asset.serial_number || '',
            supplier_id: asset.supplier_id || '',
            purchase_date: asset.purchase_date?.slice(0, 10) || '',
            purchase_cost: asset.purchase_cost || '',
            warranty_expiry: asset.warranty_expiry?.slice(0, 10) || '',
            condition: asset.condition || 'good',
            assigned_employee_id: asset.assigned_employee_id || '',
            status: asset.status || 'in_use',
            notes: asset.notes || '',
            image: null,
        });
        form.clearErrors();
        setImagePreview(asset.image_url || null);
        setCreateModalOpen(true);
    };

    const handleCloseAssetForm = () => {
        setCreateModalOpen(false);
        setEditingAsset(null);
        setImagePreview(null);
        form.reset();
        form.clearErrors();
    };

    const handleSaveAsset = (e) => {
        e.preventDefault();
        const options = {
            forceFormData: true,
            onSuccess: () => {
                form.reset();
                setImagePreview(null);
                setCreateModalOpen(false);
                setEditingAsset(null);
            },
        };

        if (editingAsset) {
            form.transform((data) => ({ ...data, _method: 'put' })).post(`/assets/${editingAsset.id}`, {
                ...options,
                onFinish: () => form.transform((data) => data),
            });
            return;
        }

        form.post('/assets', options);
    };

    const handleOpenMaintenance = (ast) => {
        setSelectedAsset(ast);
        setMaintenanceModalOpen(true);
    };

    const handleSaveMaintenance = (e) => {
        e.preventDefault();
        maintenanceForm.post(`/assets/${selectedAsset.id}/maintenance`, {
            onSuccess: () => {
                maintenanceForm.reset();
                setMaintenanceModalOpen(false);
            },
        });
    };

    return (
        <AdminLayout title="Company Assets">
            <Head title="Office Assets Register" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Fixed Assets & Hardware Register
                    </h1>
                    <p className="text-xs text-[#6B7280]">
                        Manage laptops, displays, networking infrastructure, office furniture, and maintenance logs
                    </p>
                </div>
                <div>
                    <button
                        onClick={handleOpenCreate}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-xs transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Register Asset</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Registered Assets</span>
                    <p className="text-xl font-black text-gray-900 mt-0.5">{stats.total}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Currently In Use</span>
                    <p className="text-xl font-black text-emerald-600 mt-0.5">{stats.in_use}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Available in Pool</span>
                    <p className="text-xl font-black text-blue-600 mt-0.5">{stats.available}</p>
                </div>
                <div className="bg-[#FFF0E8] p-4 rounded-xl border border-[#FFD6C0] shadow-2xs">
                    <span className="text-[10px] font-bold text-[#662200] uppercase">Asset Valuation (NPR)</span>
                    <p className="text-xl font-black text-[#FF5500] font-mono mt-0.5">
                        रू {stats.total_valuation.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs mb-6">
                <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search name, code, serial..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>
                    <div>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        >
                            <option value="">All Categories</option>
                            <option value="IT Equipment">IT Equipment</option>
                            <option value="Networking">Networking</option>
                            <option value="Office Electronics">Office Electronics</option>
                            <option value="Furniture">Furniture</option>
                        </select>
                    </div>
                    <div>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        >
                            <option value="">All Statuses</option>
                            <option value="in_use">In Use</option>
                            <option value="available">Available</option>
                            <option value="under_maintenance">Under Maintenance</option>
                            <option value="retired">Retired</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            className="w-full px-4 py-1.5 text-xs font-bold text-white bg-[#202124] hover:bg-black rounded-lg transition"
                        >
                            Filter
                        </button>
                    </div>
                </form>
            </div>

            {/* Assets Table */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs">
                        <thead className="bg-[#F7F8FA]">
                            <tr>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Asset Tag</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Equipment Name & Serial</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Category</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Assigned To</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Cost (NPR)</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Warranty Expiry</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-5 py-3 text-right font-bold text-gray-500 uppercase">Maintenance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {assets.data.length > 0 ? (
                                assets.data.map((ast) => (
                                    <tr key={ast.id} className="hover:bg-gray-50/70 transition">
                                        <td className="px-5 py-3 whitespace-nowrap font-mono font-bold text-[#FF5500]">
                                            {ast.asset_code}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                {ast.image_url ? (
                                                    <img
                                                        src={ast.image_url}
                                                        alt={ast.name}
                                                        className="h-9 w-9 rounded-lg object-cover border border-gray-200 shrink-0"
                                                    />
                                                ) : (
                                                    <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                                                        <Package className="h-4 w-4" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-gray-900">{ast.name}</p>
                                                    <p className="text-[10px] font-mono text-gray-400">S/N: {ast.serial_number || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-gray-600">{ast.category}</td>
                                        <td className="px-5 py-3 text-gray-800 font-medium">
                                            {ast.assigned_employee?.full_name || (
                                                <span className="text-gray-400 italic">Unassigned (Pool)</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3 font-mono font-bold text-gray-900">
                                            NPR {Number(ast.purchase_cost).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3 font-mono text-gray-600">
                                            {ast.warranty_expiry || 'N/A'}
                                        </td>
                                        <td className="px-5 py-3">
                                            <Badge variant={ast.status === 'in_use' ? 'success' : ast.status === 'available' ? 'info' : 'warning'}>
                                                {ast.status?.replace('_', ' ').toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="inline-flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEdit(ast)}
                                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 hover:text-[#FF5500]"
                                                    title={`Edit ${ast.name}`}
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                    <span>Edit</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenMaintenance(ast)}
                                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5500] hover:underline"
                                                >
                                                    <Wrench className="h-3.5 w-3.5" />
                                                    <span>Log Service</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-10 text-xs text-gray-400">
                                        No assets found matching filter parameters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={assets.links} />
            </div>

            {/* Modal: Register Asset */}
            <Modal
                isOpen={createModalOpen}
                onClose={handleCloseAssetForm}
                title={editingAsset ? `Edit Asset: ${editingAsset.asset_code}` : 'Register Company Fixed Asset'}
            >
                <form onSubmit={handleSaveAsset} className="space-y-4">
                    {/* Asset Image Upload */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className="h-14 w-14 rounded-lg bg-white border border-gray-200 flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-2xs">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded" />
                            ) : (
                                <Package className="h-6 w-6 text-gray-300" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Asset Photograph
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        form.setData('image', file);
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }}
                                className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#FFF0E8] file:text-[#FF5500] hover:file:bg-orange-100 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Equipment Name *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Dell XPS 15 9530 (i7 / 32GB / 1TB SSD)"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                            <select
                                value={form.data.category}
                                onChange={(e) => form.setData('category', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="IT Equipment">IT Equipment</option>
                                <option value="Networking">Networking</option>
                                <option value="Office Electronics">Office Electronics</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Vehicles">Vehicles</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Serial Number / Asset Tag</label>
                            <input
                                type="text"
                                placeholder="DELL-SN-88912"
                                value={form.data.serial_number}
                                onChange={(e) => form.setData('serial_number', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] font-mono"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Purchase Cost (NPR) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                placeholder="185000"
                                value={form.data.purchase_cost}
                                onChange={(e) => form.setData('purchase_cost', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] font-mono font-bold"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Purchase Date</label>
                            <input
                                type="date"
                                value={form.data.purchase_date}
                                onChange={(e) => form.setData('purchase_date', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Warranty Expiry</label>
                            <input
                                type="date"
                                value={form.data.warranty_expiry}
                                onChange={(e) => form.setData('warranty_expiry', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Supplier</label>
                            <select
                                value={form.data.supplier_id}
                                onChange={(e) => form.setData('supplier_id', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="">No Supplier</option>
                                {suppliers.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Assign to Employee</label>
                            <select
                                value={form.data.assigned_employee_id}
                                onChange={(e) => form.setData('assigned_employee_id', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="">Unassigned (Office Pool)</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={handleCloseAssetForm}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="px-5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-sm"
                        >
                            {editingAsset ? 'Save Changes' : 'Register Asset'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal: Log Maintenance */}
            {selectedAsset && (
                <Modal
                    isOpen={maintenanceModalOpen}
                    onClose={() => setMaintenanceModalOpen(false)}
                    title={`Log Maintenance for ${selectedAsset.name} (${selectedAsset.asset_code})`}
                >
                    <form onSubmit={handleSaveMaintenance} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Service Date *</label>
                                <input
                                    type="date"
                                    required
                                    value={maintenanceForm.data.maintenance_date}
                                    onChange={(e) => maintenanceForm.setData('maintenance_date', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Service Cost (NPR) *</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={maintenanceForm.data.cost}
                                    onChange={(e) => maintenanceForm.setData('cost', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] font-mono font-bold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Service Center / Technician</label>
                            <input
                                type="text"
                                placeholder="e.g. Authorized Dell Service Center"
                                value={maintenanceForm.data.service_provider}
                                onChange={(e) => maintenanceForm.setData('service_provider', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Maintenance Description *</label>
                            <textarea
                                rows={3}
                                required
                                placeholder="Parts replaced, thermal paste servicing, screen repair..."
                                value={maintenanceForm.data.description}
                                onChange={(e) => maintenanceForm.setData('description', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setMaintenanceModalOpen(false)}
                                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={maintenanceForm.processing}
                                className="px-5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-sm"
                            >
                                Save Maintenance Record
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </AdminLayout>
    );
}
