import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import Badge from '@/Components/Badge';
import {
    CreditCard,
    Download,
    Printer,
    RefreshCw,
    QrCode,
    Sparkles,
    ShieldCheck,
    History,
    Check,
    Layers
} from 'lucide-react';

export default function Index({
    employees,
    selectedEmployee,
    qrCodeUri,
    currentTemplate,
    company,
    idCardHistory
}) {
    const [side, setSide] = useState('front'); // front or back
    const [template, setTemplate] = useState(currentTemplate || 'corporate_modern');
    const [reissueModalOpen, setReissueModalOpen] = useState(false);
    const companyLocation = [company?.address, company?.city, company?.country].filter(Boolean).join(', ');

    const reissueForm = useForm({
        template: template,
        reason: '',
    });

    const handleSelectEmployee = (empId) => {
        router.get('/employee-id-cards', {
            employee_id: empId,
            template,
        }, { preserveState: true });
    };

    const handleSelectTemplate = (tpl) => {
        setTemplate(tpl);
        if (selectedEmployee) {
            router.get('/employee-id-cards', {
                employee_id: selectedEmployee.id,
                template: tpl,
            }, { preserveState: true });
        }
    };

    const handleReissue = (e) => {
        e.preventDefault();
        reissueForm.post(`/employee-id-cards/${selectedEmployee.id}/reissue`, {
            onSuccess: () => {
                reissueForm.reset();
                setReissueModalOpen(false);
            },
        });
    };

    return (
        <AdminLayout title="Employee ID Card Studio">
            <Head title="Employee ID Card Studio" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Employee ID Card Studio & Generator
                    </h1>
                    <p className="text-xs text-[#6B7280]">
                        Standard CR80 dimensions (85.60 mm &times; 53.98 mm) with dynamic QR tokens & high-res print sheets
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <a
                        href={`/employee-id-cards/bulk-sheet/pdf?template=${template}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#FF5500] bg-[#FFF0E8] border border-[#FFD6C0] hover:bg-orange-100 rounded-lg shadow-2xs transition"
                    >
                        <Printer className="h-4 w-4" />
                        <span>Print A4 Multi-Card Sheet</span>
                    </a>
                    {selectedEmployee && (
                        <a
                            href={`/employee-id-cards/${selectedEmployee.id}/pdf?template=${template}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-xs transition"
                        >
                            <Download className="h-4 w-4" />
                            <span>Download CR80 PDF</span>
                        </a>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                {/* Left Controls: Employee Selection & Template Switcher */}
                <div className="lg:col-span-4 space-y-5">
                    {/* Select Employee */}
                    <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Select Employee Record
                        </label>
                        <select
                            value={selectedEmployee?.id || ''}
                            onChange={(e) => handleSelectEmployee(e.target.value)}
                            className="w-full px-3 py-2 text-xs font-bold border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#FF5500]"
                        >
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.full_name} ({emp.employee_code})
                                </option>
                            ))}
                        </select>

                        {selectedEmployee && (
                            <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1.5">
                                <p className="font-bold text-gray-900">{selectedEmployee.full_name}</p>
                                <p className="text-gray-500">{selectedEmployee.designation?.title} &bull; {selectedEmployee.department?.name}</p>
                                <p className="font-mono text-gray-400 text-[10px]">{selectedEmployee.employee_code}</p>
                                <div className="pt-2 flex items-center justify-between">
                                    <span className="text-[10px] text-gray-400">Card Status:</span>
                                    <Badge variant="success">ACTIVE CR80</Badge>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Template Selection */}
                    <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                            Design Template
                        </label>
                        <div className="space-y-2.5">
                            {[
                                { id: 'corporate_modern', name: 'Corporate Modern', desc: 'White card, orange accent, high contrast' },
                                { id: 'orange_executive', name: 'Executive Orange', desc: 'Bold brand orange badge header' },
                                { id: 'minimal_clean', name: 'Minimal Clean', desc: 'Subtle gray border, minimalist typography' },
                            ].map((tpl) => (
                                <button
                                    key={tpl.id}
                                    type="button"
                                    onClick={() => handleSelectTemplate(tpl.id)}
                                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                                        template === tpl.id
                                            ? 'border-[#FF5500] bg-[#FFF0E8]/50 ring-1 ring-[#FF5500]'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">{tpl.name}</p>
                                        <p className="text-[10px] text-gray-500 mt-0.5">{tpl.desc}</p>
                                    </div>
                                    {template === tpl.id && <Check className="h-4 w-4 text-[#FF5500]" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    {selectedEmployee && (
                        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Card Operations
                            </label>
                            <button
                                type="button"
                                onClick={() => setReissueModalOpen(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition"
                            >
                                <RefreshCw className="h-4 w-4 text-[#FF5500]" />
                                <span>Reissue / Replace Card</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Interactive Visual Card Mockup (Exact CR80 Aspect Ratio) */}
                <div className="lg:col-span-8 flex flex-col items-center justify-center bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center gap-2 mb-6">
                        <button
                            type="button"
                            onClick={() => setSide('front')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                                side === 'front'
                                    ? 'bg-[#FF5500] text-white shadow-2xs'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Front Side View
                        </button>
                        <button
                            type="button"
                            onClick={() => setSide('back')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                                side === 'back'
                                    ? 'bg-[#FF5500] text-white shadow-2xs'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Back Side View
                        </button>
                    </div>

                    {selectedEmployee ? (
                        <div className="relative">
                            {/* Realistic physical CR80 Portrait Card Frame (Width: 280px, Height: 444px) */}
                            <div className="w-[280px] h-[444px] bg-white rounded-2xl shadow-2xl border border-gray-200 relative overflow-hidden flex flex-col justify-between p-4 select-none transition-all duration-300">
                                {/* Top Brand Stripe */}
                                <div className={`absolute top-0 left-0 right-0 ${template === 'orange_executive' ? 'h-3 bg-[#FF5500]' : 'h-2 bg-[#FF5500]'}`} />

                                {side === 'front' ? (
                                    <>
                                        {/* Front Top / Lanyard & Logo */}
                                        <div className="pt-2 text-center">
                                            <div className="w-12 h-1.5 mx-auto bg-gray-200 rounded-full border border-dashed border-gray-400 mb-2" />
                                            {company?.logo_url ? (
                                                <img src={company.logo_url} alt="Logo" className="h-6 max-w-[120px] mx-auto object-contain" />
                                            ) : (
                                                <div>
                                                    <span className="text-xs font-black text-gray-900 tracking-tight block">
                                                        GOSIKA <span className="text-[#FF5500]">OFFICE</span>
                                                    </span>
                                                    <span className="text-[7.5px] font-bold text-gray-400 tracking-widest uppercase">
                                                        {company?.company_name || 'GOSIKA PVT. LTD.'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Centered Photo */}
                                        <div className="text-center my-1">
                                            {selectedEmployee.photo_path ? (
                                                <img
                                                    src={`/storage/${selectedEmployee.photo_path}`}
                                                    alt={selectedEmployee.full_name}
                                                    className="h-24 w-20 mx-auto rounded-xl object-cover border-2 border-[#FF5500] shadow-sm"
                                                />
                                            ) : (
                                                <div className="h-24 w-20 mx-auto rounded-xl bg-[#FFF0E8] border-2 border-[#FFD6C0] text-[#FF5500] font-black flex items-center justify-center text-xl shadow-xs">
                                                    {selectedEmployee.first_name.charAt(0)}{selectedEmployee.last_name.charAt(0)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Name & Department */}
                                        <div className="text-center space-y-0.5">
                                            <p className="text-sm font-black text-gray-900 leading-tight">
                                                {selectedEmployee.full_name}
                                            </p>
                                            <p className="text-[11px] font-bold text-[#FF5500]">
                                                {selectedEmployee.designation?.title || 'Staff Member'}
                                            </p>
                                            <span className="inline-block text-[8px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full uppercase">
                                                {selectedEmployee.department?.name || 'General'}
                                            </span>
                                        </div>

                                        {/* Compact Info List */}
                                        <div className="bg-gray-50 rounded-lg p-2 text-[9px] space-y-0.5 border border-gray-100">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500 font-bold">EMP ID:</span>
                                                <span className="font-mono font-black text-gray-900">{selectedEmployee.employee_code}</span>
                                            </div>
                                            {selectedEmployee.blood_group && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500 font-bold">BLOOD:</span>
                                                    <span className="font-bold text-gray-800">{selectedEmployee.blood_group}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="text-gray-500 font-bold">JOINED:</span>
                                                <span className="text-gray-700">{selectedEmployee.joining_date || 'N/A'}</span>
                                            </div>
                                        </div>

                                        {/* QR Code */}
                                        {qrCodeUri && (
                                            <div className="text-center">
                                                <img
                                                    src={qrCodeUri}
                                                    alt="Verifiable QR Token"
                                                    className="h-12 w-12 mx-auto p-0.5 bg-white border border-gray-200 rounded shadow-2xs"
                                                />
                                                <span className="text-[6.5px] text-gray-400 block mt-0.5 uppercase tracking-wider">Scan to Verify</span>
                                            </div>
                                        )}

                                        {/* Front Bottom Bar */}
                                        <div className="bg-[#202124] -mx-4 -mb-4 px-3 py-1 flex items-center justify-between text-[7px] text-gray-300">
                                            <span>{company?.website || 'gosika.com'}</span>
                                            <span className="text-[#FF5500] font-bold">AUTHORIZED BADGE</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Back Top */}
                                        <div className="pt-2 text-center">
                                            <div className="w-12 h-1.5 mx-auto bg-gray-200 rounded-full border border-dashed border-gray-400 mb-2" />
                                            <span className="text-[9px] font-black text-gray-900 uppercase tracking-wider block">
                                                Property of {company?.trading_name || 'GOSIKA'}
                                            </span>
                                            <span className="text-[7.5px] text-gray-500">Please return if found</span>
                                        </div>

                                        {/* Back Terms */}
                                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-2 text-[7.5px] text-gray-600 leading-tight space-y-1">
                                            <p>&bull; This badge is non-transferable and remains company property.</p>
                                            <p>&bull; Must be worn visibly at all times within company premises.</p>
                                            <p>&bull; If found, return to HR or corporate headquarters.</p>
                                        </div>

                                        {/* Back Address & Emergency */}
                                        <div className="text-center text-[7.5px] text-gray-600 leading-tight">
                                            <p className="font-bold text-gray-900">{company?.company_name || 'GOSIKA Pvt. Ltd.'}</p>
                                            {companyLocation && <p>{companyLocation}</p>}
                                            {company?.phone && <p>Tel: <span className="font-bold text-gray-800">{company.phone}</span></p>}
                                            <p>Emergency: <span className="font-bold text-[#FF5500]">{selectedEmployee.emergency_contact_phone || company?.phone || '—'}</span></p>
                                        </div>

                                        {/* Back Sign & Footer */}
                                        <div className="text-center pt-2 border-t border-gray-100">
                                            <div className="w-24 border-t border-gray-400 mx-auto mb-0.5" />
                                            <span className="text-[7px] font-bold text-gray-600 uppercase block">Authorized Signatory</span>
                                            <span className="text-[6.5px] font-mono text-gray-400 mt-1 block">
                                                Card No: {selectedEmployee.latest_id_card?.card_number || 'GSK-CR80-STD'}
                                            </span>
                                        </div>

                                        <div className="bg-[#FF5500] -mx-4 -mb-4 px-3 py-1 text-center text-[7px] text-white font-bold uppercase tracking-wider">
                                            OFFICIAL CORPORATE RECORD
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400">No active employee record selected</p>
                    )}
                </div>
            </div>

            {/* ID Card Generation & Print History */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <History className="h-4 w-4 text-[#FF5500]" />
                        <h2 className="text-sm font-bold text-[#202124]">ID Card Generation & Reissue Audit Trail</h2>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs">
                        <thead className="bg-[#F7F8FA]">
                            <tr>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Card Serial</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Employee</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Template</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Issue Date</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-5 py-3 text-left font-bold text-gray-500 uppercase">Print Count</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {idCardHistory.map((card) => (
                                <tr key={card.id} className="hover:bg-gray-50/70 transition">
                                    <td className="px-5 py-3 font-mono font-bold text-gray-900">{card.card_number}</td>
                                    <td className="px-5 py-3 font-bold text-gray-800">{card.employee?.full_name}</td>
                                    <td className="px-5 py-3 capitalize text-gray-600">{card.template?.replace('_', ' ')}</td>
                                    <td className="px-5 py-3 text-gray-600">{card.issue_date}</td>
                                    <td className="px-5 py-3">
                                        <Badge variant={card.status === 'active' ? 'success' : 'default'}>
                                            {card.status?.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-3 font-mono font-bold text-gray-800">{card.print_count}x</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal: Reissue Card */}
            {selectedEmployee && (
                <Modal
                    isOpen={reissueModalOpen}
                    onClose={() => setReissueModalOpen(false)}
                    title={`Reissue ID Card: ${selectedEmployee.full_name}`}
                >
                    <form onSubmit={handleReissue} className="space-y-4">
                        <p className="text-xs text-gray-500">
                            Reissuing an ID badge revokes the current serial number, generates a new incremented card version, and records the reason in the audit trail.
                        </p>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Select Design Template</label>
                            <select
                                value={reissueForm.data.template}
                                onChange={(e) => reissueForm.setData('template', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            >
                                <option value="corporate_modern">Corporate Modern</option>
                                <option value="orange_executive">Executive Orange</option>
                                <option value="minimal_clean">Minimal Clean</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Reason for Reissue *</label>
                            <textarea
                                rows={3}
                                required
                                placeholder="Lost card, role promotion, physical damage, photo update..."
                                value={reissueForm.data.reason}
                                onChange={(e) => reissueForm.setData('reason', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF5500]"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setReissueModalOpen(false)}
                                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={reissueForm.processing}
                                className="px-5 py-2 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-sm"
                            >
                                Issue Replacement Badge
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </AdminLayout>
    );
}
