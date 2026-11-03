import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import Badge from '@/Components/Badge';
import Pagination from '@/Components/Pagination';
import {
    Boxes,
    Plus,
    Search,
    AlertTriangle,
    ArrowDown,
    ArrowUp,
    RefreshCw,
    History,
    Pencil
} from 'lucide-react';

export default function Index({ items, suppliers, stats, filters }) {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [adjustModalOpen, setAdjustModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [lowStock, setLowStock] = useState(filters.low_stock || false);

    const form = useForm({
        name: '',
        category: 'Stationery',
        quantity: 10,
        unit: 'pcs',
        min_stock_threshold: 5,
        unit_price: '',
        supplier_id: '',
        location: 'Storage Room A',
        notes: '',
        image: null,
    });

    const adjustForm = useForm({
        type: 'in', // in, out, adjustment
        quantity: 5,
        reference_no: '',
        notes: '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/inventory', {
            search,
            category,
            low_stock: lowStock ? 1 : undefined,
        }, { preserveState: true });
    };

    const handleOpenCreate = () => {
        setEditingItem(null);
        form.reset();
        form.clearErrors();
        setImagePreview(null);
        setCreateModalOpen(true);
    };

    const handleOpenEdit = (item) => {
        setEditingItem(item);
        form.setData({
            name: item.name || '',
            category: item.category || 'Stationery',
            quantity: item.quantity ?? 0,
            unit: item.unit || 'pcs',
            min_stock_threshold: item.min_stock_threshold ?? 1,
            unit_price: item.unit_price || '',
            supplier_id: item.supplier_id || '',
            location: item.location || '',
            notes: item.notes || '',
            image: null,
        });
        form.clearErrors();
        setImagePreview(item.image_url || null);
        setCreateModalOpen(true);
    };

    const handleCloseItemForm = () => {
        setCreateModalOpen(false);
        setEditingItem(null);
        setImagePreview(null);
        form.reset();
        form.clearErrors();
    };

    const handleSaveItem = (e) => {
        e.preventDefault();
        const options = {
            forceFormData: true,
            onSuccess: () => {
                form.reset();
                setImagePreview(null);
                setCreateModalOpen(false);
                setEditingItem(null);
            },
        };

        if (editingItem) {
            form.transform((data) => ({ ...data, _method: 'put' })).post(`/inventory/${editingItem.id}`, {
                ...options,
                onFinish: () => form.transform((data) => data),
            });
            return;
        }

        form.post('/inventory', options);
    };

    const handleOpenAdjust = (item) => {
        setSelectedItem(item);
        setAdjustModalOpen(true);
    };

    const handleAdjust = (e) => {
        e.preventDefault();
        adjustForm.post(`/inventory/${selectedItem.id}/adjust`, {
            onSuccess: () => {
                adjustForm.reset();
                setAdjustModalOpen(false);
            },
        });
    };

    return (
        <AdminLayout title="Inventory & Supplies">
            <Head title="Inventory & Consumables" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Office Inventory & Consumables
                    </h1>
                    <p className="text-xs text-[#6B7280]">
                        Manage stationeries, print media, ID card blanks, pantry provisions, and stock levels
                    </p>
                </div>
                <div>
                    <button
                        onClick={handleOpenCreate}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-xs transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Stock Item</span>
                    </button>
                </div>
            </div>

            {/* Low Stock Warning Banner if any items triggered threshold */}
            {stats.low_stock_count > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-6 flex items-center justify-between text-xs text-amber-800">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                        <span>
                            <strong>Low Stock Alert:</strong> {stats.low_stock_count} item(s) are below the minimum required threshold and require replenishment.
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            setLowStock(true);
                            router.get('/inventory', { low_stock: 1 });
                        }}
                        className="text-[11px] font-bold text-amber-900 underline"
                    >
                        Filter Low Stock Items
                    </button>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Inventory SKUs</span>
                    <p className="text-xl font-black text-gray-900 mt-0.5">{stats.total_items}</p>
                </div>
                <div className="bg-[#FFF0E8] p-4 rounded-xl border border-[#FFD6C0] shadow-2xs">
                    <span className="text-[10px] font-bold text-[#662200] uppercase">Stock Valuation (NPR)</span>
                    <p className="text-xl font-black text-[#FF5500] font-mono mt-0.5">
                        रू {stats.total_stock_value.toLocaleString()}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-amber-600 uppercase">Low Stock Threshold Warnings</span>
                    <p className="text-xl font-black text-amber-600 mt-0.5">{stats.low_stock_count}</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs mb-6">
                <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search item, SKU..."
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
                            <option value="Stationery">Stationery</option>
                            <option value="Printing">Printing Media</option>
                            <option value="Pantry">Pantry & Welfare</option>
                            <option value="Cleaning">Cleaning & Hygiene</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                            <input
                                type="checkbox"
                                checked={lowStock}
                                onChange={(e) => setLowStock(e.target.checked)}
                                className="h-4 w-4 text-[#FF5500] focus:ring-[#FF5500] rounded border-gray-300"
                            />
                            <span>Low Stock Only</span>
                        </label>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-1.5 text-xs font-bold text-white bg-[#202124] hover:bg-black rounded-lg transition"
                        >
                            Filter
                        </button>
                    </div>
                </form>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs">
                        <thead className="bg-[#F7F8FA]">
                            <tr>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Item SKU</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Item Name & Location</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Category</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Stock Level</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Unit Price</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Total Valuation</th>
                                <th className="px-5 py-3 text-right font-bold text-gray-500 uppercase">Stock Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.data.length > 0 ? (
                                items.data.map((item) => {
                                    const isLow = item.quantity <= item.min_stock_threshold;

                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50/70 transition">
                                            <td className="px-5 py-3 font-mono font-bold text-[#FF5500]">
                                                {item.item_code}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    {item.image_url ? (
                                                        <img
                                                            src={item.image_url}
                                                            alt={item.name}
                                                            className="h-9 w-9 rounded-lg object-cover border border-gray-200 shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                                                            <Boxes className="h-4 w-4" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-gray-900">{item.name}</p>
                                                        <p className="text-[10px] text-gray-400">Location: {item.location || 'Storage'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-gray-600">{item.category}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`font-bold font-mono text-sm ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                                                        {item.quantity} {item.unit}
                                                    </span>
                                                    {isLow && (
                                                        <Badge variant="danger" className="text-[9px] px-1.5 py-0">
                                                            LOW STOCK
                                                        </Badge>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-gray-400 block mt-0.5">
                                                    Min Alert: {item.min_stock_threshold} {item.unit}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 font-mono text-gray-700">
                                                रू {Number(item.unit_price).toLocaleString()}
                                            </td>
                                            <td className="px-5 py-3 font-mono font-bold text-gray-900">
                                                रू {(item.quantity * item.unit_price).toLocaleString()}
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEdit(item)}
                                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-gray-600 hover:text-[#FF5500] rounded-lg transition"
                                                        title={`Edit ${item.name}`}
                                                    >
                                                        <Pencil className="h-3 w-3" />
                                                        <span>Edit</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenAdjust(item)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#FF5500] bg-[#FFF0E8] hover:bg-orange-100 rounded-lg transition"
                                                    >
                                                        <RefreshCw className="h-3 w-3" />
                                                        <span>Stock In/Out</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-xs text-gray-400">
                                        No inventory records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={items.links} />
            </div>

            {/* Modal: Add Item */}
            <Modal
                isOpen={createModalOpen}
                onClose={handleCloseItemForm}
                title={editingItem ? `Edit Inventory Item: ${editingItem.item_code}` : 'Register Consumable Inventory Item'}
            >
                <form onSubmit={handleSaveItem} className="space-y-4">
                    {/* Item Image Upload */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className="h-14 w-14 rounded-lg bg-white border border-gray-200 flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-2xs">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded" />
                            ) : (
                                <Boxes className="h-6 w-6 text-gray-300" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Consumable / Item Photo
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
                        <label className="block text-xs font-bold text-gray-700 mb-1">Item Title *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. CR80 Blank PVC ID Card Stock (Pack of 100)"
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
                                <option value="Stationery">Stationery</option>
                                <option value="Printing">Printing Media</option>
                                <option value="Pantry">Pantry & Provisions</option>
                                <option value="Cleaning">Cleaning & Hygiene</option>
                                <option value="Electronics">Cables & Small Electronics</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Unit of Measurement *</label>
                            <select
                                value={form.data.unit}
                                onChange={(e) => form.setData('unit', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="pcs">Pieces (pcs)</option>
                                <option value="ream">Reams</option>
                                <option value="box">Boxes</option>
                                <option value="pack">Packs</option>
                                <option value="kg">Kilograms (kg)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Initial Quantity *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={form.data.quantity}
                                onChange={(e) => form.setData('quantity', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Min Alert Level *</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={form.data.min_stock_threshold}
                                onChange={(e) => form.setData('min_stock_threshold', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Unit Cost (NPR) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                placeholder="650"
                                value={form.data.unit_price}
                                onChange={(e) => form.setData('unit_price', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] font-mono font-bold"
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
                            <label className="block text-xs font-bold text-gray-700 mb-1">Storage Location</label>
                            <input
                                type="text"
                                placeholder="Shelf 2, Storage Room A"
                                value={form.data.location}
                                onChange={(e) => form.setData('location', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={handleCloseItemForm}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="px-5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-sm"
                        >
                            {editingItem ? 'Save Changes' : 'Save Item'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal: Stock Adjustment */}
            {selectedItem && (
                <Modal
                    isOpen={adjustModalOpen}
                    onClose={() => setAdjustModalOpen(false)}
                    title={`Stock Movement: ${selectedItem.name}`}
                >
                    <form onSubmit={handleAdjust} className="space-y-4">
                        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                            Current In-Stock Balance: <strong>{selectedItem.quantity} {selectedItem.unit}</strong>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Movement Type *</label>
                            <select
                                value={adjustForm.data.type}
                                onChange={(e) => adjustForm.setData('type', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="in">Stock IN (New Purchase / Restock)</option>
                                <option value="out">Stock OUT (Disbursed / Consumed by Staff)</option>
                                <option value="adjustment">Direct Balance Adjustment</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                {adjustForm.data.type === 'adjustment' ? 'New Exact Balance' : 'Quantity to Add / Deduct'} *
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={adjustForm.data.quantity}
                                onChange={(e) => adjustForm.setData('quantity', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500] font-mono font-bold"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Reason / Purpose</label>
                            <input
                                type="text"
                                placeholder="Restock batch, dispatches to Level 4 team, audit recount..."
                                value={adjustForm.data.notes}
                                onChange={(e) => adjustForm.setData('notes', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setAdjustModalOpen(false)}
                                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={adjustForm.processing}
                                className="px-5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-sm"
                            >
                                Commit Stock Transaction
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </AdminLayout>
    );
}
