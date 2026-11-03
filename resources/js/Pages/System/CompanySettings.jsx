import React, { useState } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Building2,
    Globe,
    Mail,
    Phone,
    MapPin,
    DollarSign,
    Calendar,
    Users,
    CreditCard,
    Database,
    Download,
    Save,
    RefreshCw,
    FileText,
    Clock,
    Percent,
    Hash,
} from 'lucide-react';

export default function CompanySettings({ settings, backups }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        company_name: settings?.company_name ?? '',
        trading_name: settings?.trading_name ?? '',
        registration_no: settings?.registration_no ?? '',
        pan_vat_no: settings?.pan_vat_no ?? '',
        email: settings?.email ?? '',
        phone: settings?.phone ?? '',
        website: settings?.website ?? '',
        address: settings?.address ?? '',
        city: settings?.city ?? '',
        country: settings?.country ?? '',
        default_currency: settings?.default_currency ?? '',
        currency_symbol: settings?.currency_symbol ?? '',
        fiscal_year: settings?.fiscal_year ?? '',
        attendance_grace_minutes: settings?.attendance_grace_minutes ?? '',
        annual_leave_quota: settings?.annual_leave_quota ?? '',
        default_tax_rate: settings?.default_tax_rate ?? '',
        default_provident_fund_rate: settings?.default_provident_fund_rate ?? '',
        id_card_template: settings?.id_card_template ?? 'gosika_orange',
        logo: null,
        stamp_signature: null,
    });

    const [logoPreview, setLogoPreview] = useState(
        settings?.logo_url || (settings?.logo_path ? `/storage/${settings.logo_path}` : null)
    );
    const [stampPreview, setStampPreview] = useState(
        settings?.stamp_signature_url || (settings?.stamp_signature_path ? `/storage/${settings.stamp_signature_path}` : null)
    );

    const { post: postBackup, processing: backupProcessing } = useForm();

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/company-settings', {
            forceFormData: true,
        });
    };

    const handleBackup = (e) => {
        e.preventDefault();
        router.post('/company-settings/backup');
    };

    const formatBytes = (kb) => {
        if (!kb) return '—';
        if (kb < 1024) return `${kb} KB`;
        return `${(kb / 1024).toFixed(2)} MB`;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(dateStr));
    };

    const InputField = ({ label, name, type = 'text', required, icon: Icon, placeholder, className = '' }) => (
        <div className={className}>
            <label className="block text-xs font-semibold text-[#202124] mb-1">
                {label} {required && <span className="text-[#FF5500]">*</span>}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon className="h-4 w-4" />
                    </div>
                )}
                <input
                    type={type}
                    value={data[name]}
                    onChange={(e) => setData(name, e.target.value)}
                    placeholder={placeholder}
                    className={`w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2 text-xs border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500] transition ${
                        errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                />
            </div>
            {errors[name] && <p className="mt-1 text-[11px] text-red-500">{errors[name]}</p>}
        </div>
    );

    const SectionTitle = ({ icon: Icon, title, description }) => (
        <div className="flex items-start gap-3 mb-4 pb-3 border-b border-gray-100">
            <div className="h-8 w-8 rounded-lg bg-[#FFF0E8] flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-[#FF5500]" />
            </div>
            <div>
                <h3 className="text-sm font-bold text-[#202124]">{title}</h3>
                {description && <p className="text-[11px] text-gray-500 mt-0.5">{description}</p>}
            </div>
        </div>
    );

    return (
        <AdminLayout title="Company Settings">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-xl font-black text-[#202124]">Company Profile &amp; Settings</h1>
                <p className="text-xs text-gray-500 mt-1">
                    Manage your organization's core information, financial defaults, and HR configuration.
                </p>
            </div>

            <div className="flex flex-col xl:flex-row gap-6">
                {/* ─── LEFT: Main Settings Form ─── */}
                <div className="flex-1 min-w-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Company Identity */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <SectionTitle
                                icon={Building2}
                                title="Company Identity"
                                description="Legal and public-facing details of your organization"
                            />

                            {/* Logos & Stamp Brand Assets */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 p-4 bg-[#F7F8FA] border border-gray-200 rounded-xl">
                                {/* Company Logo */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        Official Company Logo
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <div className="h-14 w-24 rounded-lg bg-white border border-gray-200 flex items-center justify-center p-1.5 shrink-0 shadow-2xs overflow-hidden">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Logo" className="max-h-full max-w-full object-contain" />
                                            ) : (
                                                <span className="text-[10px] text-gray-400 font-bold">No Logo</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setData('logo', file);
                                                        setLogoPreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                                className="w-full text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[11px] file:font-bold file:bg-[#FFF0E8] file:text-[#FF5500] hover:file:bg-orange-100 cursor-pointer"
                                            />
                                            <p className="text-[9.5px] text-gray-400 mt-1">Used on ID cards, reports & header</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stamp / Signature */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        Official Stamp & Signature
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <div className="h-14 w-24 rounded-lg bg-white border border-gray-200 flex items-center justify-center p-1.5 shrink-0 shadow-2xs overflow-hidden">
                                            {stampPreview ? (
                                                <img src={stampPreview} alt="Stamp" className="max-h-full max-w-full object-contain" />
                                            ) : (
                                                <span className="text-[10px] text-gray-400 font-bold">No Stamp</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setData('stamp_signature', file);
                                                        setStampPreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                                className="w-full text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[11px] file:font-bold file:bg-[#FFF0E8] file:text-[#FF5500] hover:file:bg-orange-100 cursor-pointer"
                                            />
                                            <p className="text-[9.5px] text-gray-400 mt-1">Used on ID card back & salary slips</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField
                                    label="Company Name"
                                    name="company_name"
                                    required
                                    icon={Building2}
                                    placeholder="GOSIKA Pvt. Ltd."
                                />
                                <InputField
                                    label="Trading Name"
                                    name="trading_name"
                                    required
                                    icon={FileText}
                                    placeholder="GOSIKA"
                                />
                                <InputField
                                    label="Registration No."
                                    name="registration_no"
                                    icon={Hash}
                                    placeholder="123456/077/078"
                                />
                                <InputField
                                    label="PAN / VAT Number"
                                    name="pan_vat_no"
                                    icon={Hash}
                                    placeholder="000000000"
                                />
                                <InputField
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    required
                                    icon={Mail}
                                    placeholder="info@gosika.com"
                                />
                                <InputField
                                    label="Phone Number"
                                    name="phone"
                                    type="tel"
                                    required
                                    icon={Phone}
                                    placeholder="+977-1-XXXXXXX"
                                />
                                <InputField
                                    label="Website"
                                    name="website"
                                    type="url"
                                    icon={Globe}
                                    placeholder="https://gosika.com"
                                />
                                <div>
                                    <label className="block text-xs font-semibold text-[#202124] mb-1">
                                        Address <span className="text-[#FF5500]">*</span>
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <textarea
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            rows={2}
                                            placeholder="Street address..."
                                            className={`w-full pl-9 pr-3 py-2 text-xs border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500] transition resize-none ${
                                                errors.address ? 'border-red-400 bg-red-50' : 'border-gray-200'
                                            }`}
                                        />
                                    </div>
                                    {errors.address && <p className="mt-1 text-[11px] text-red-500">{errors.address}</p>}
                                </div>
                                <InputField
                                    label="City"
                                    name="city"
                                    required
                                    icon={MapPin}
                                    placeholder="Kathmandu"
                                />
                                <InputField
                                    label="Country"
                                    name="country"
                                    required
                                    icon={Globe}
                                    placeholder="Nepal"
                                />
                            </div>
                        </div>

                        {/* Financial Settings */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <SectionTitle
                                icon={DollarSign}
                                title="Financial Settings"
                                description="Default currency and fiscal year for your accounting"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <InputField
                                    label="Default Currency"
                                    name="default_currency"
                                    required
                                    icon={DollarSign}
                                    placeholder="NPR"
                                />
                                <InputField
                                    label="Currency Symbol"
                                    name="currency_symbol"
                                    required
                                    icon={DollarSign}
                                    placeholder="रू"
                                />
                                <InputField
                                    label="Fiscal Year"
                                    name="fiscal_year"
                                    required
                                    icon={Calendar}
                                    placeholder="2080-2081"
                                />
                            </div>
                        </div>

                        {/* HR Settings */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <SectionTitle
                                icon={Users}
                                title="HR Settings"
                                description="Human resources defaults applied system-wide"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[#202124] mb-1">
                                        Attendance Grace Period (minutes) <span className="text-[#FF5500]">*</span>
                                    </label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="number"
                                            min="0"
                                            max="120"
                                            value={data.attendance_grace_minutes}
                                            onChange={(e) => setData('attendance_grace_minutes', e.target.value)}
                                            placeholder="15"
                                            className={`w-full pl-9 pr-3 py-2 text-xs border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500] transition ${
                                                errors.attendance_grace_minutes ? 'border-red-400 bg-red-50' : 'border-gray-200'
                                            }`}
                                        />
                                    </div>
                                    {errors.attendance_grace_minutes && (
                                        <p className="mt-1 text-[11px] text-red-500">{errors.attendance_grace_minutes}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#202124] mb-1">
                                        Annual Leave Quota (days) <span className="text-[#FF5500]">*</span>
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.annual_leave_quota}
                                            onChange={(e) => setData('annual_leave_quota', e.target.value)}
                                            placeholder="18"
                                            className={`w-full pl-9 pr-3 py-2 text-xs border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500] transition ${
                                                errors.annual_leave_quota ? 'border-red-400 bg-red-50' : 'border-gray-200'
                                            }`}
                                        />
                                    </div>
                                    {errors.annual_leave_quota && (
                                        <p className="mt-1 text-[11px] text-red-500">{errors.annual_leave_quota}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#202124] mb-1">
                                        Default Tax Rate (%) <span className="text-[#FF5500]">*</span>
                                    </label>
                                    <div className="relative">
                                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={data.default_tax_rate}
                                            onChange={(e) => setData('default_tax_rate', e.target.value)}
                                            placeholder="13"
                                            className={`w-full pl-9 pr-3 py-2 text-xs border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500] transition ${
                                                errors.default_tax_rate ? 'border-red-400 bg-red-50' : 'border-gray-200'
                                            }`}
                                        />
                                    </div>
                                    {errors.default_tax_rate && (
                                        <p className="mt-1 text-[11px] text-red-500">{errors.default_tax_rate}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#202124] mb-1">
                                        Default Provident Fund Rate (%) <span className="text-[#FF5500]">*</span>
                                    </label>
                                    <div className="relative">
                                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={data.default_provident_fund_rate}
                                            onChange={(e) => setData('default_provident_fund_rate', e.target.value)}
                                            placeholder="10"
                                            className={`w-full pl-9 pr-3 py-2 text-xs border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500] transition ${
                                                errors.default_provident_fund_rate ? 'border-red-400 bg-red-50' : 'border-gray-200'
                                            }`}
                                        />
                                    </div>
                                    {errors.default_provident_fund_rate && (
                                        <p className="mt-1 text-[11px] text-red-500">{errors.default_provident_fund_rate}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ID Card Settings */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <SectionTitle
                                icon={CreditCard}
                                title="ID Card Settings"
                                description="Choose the design template used for employee ID cards"
                            />
                            <div>
                                <label className="block text-xs font-semibold text-[#202124] mb-2">
                                    ID Card Template
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {[
                                        { value: 'gosika_orange', label: 'GOSIKA Orange', desc: 'Vibrant brand orange theme', color: 'bg-[#FF5500]' },
                                        { value: 'gosika_minimal', label: 'GOSIKA Minimal', desc: 'Clean white & gray design', color: 'bg-gray-200' },
                                        { value: 'gosika_dark', label: 'GOSIKA Dark', desc: 'Professional dark navy theme', color: 'bg-gray-800' },
                                    ].map((tpl) => (
                                        <label
                                            key={tpl.value}
                                            className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                                                data.id_card_template === tpl.value
                                                    ? 'border-[#FF5500] bg-[#FFF0E8]'
                                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="id_card_template"
                                                value={tpl.value}
                                                checked={data.id_card_template === tpl.value}
                                                onChange={() => setData('id_card_template', tpl.value)}
                                                className="sr-only"
                                            />
                                            <div className={`h-10 w-7 rounded-md ${tpl.color} shrink-0 mt-0.5`} />
                                            <div>
                                                <p className="text-xs font-bold text-[#202124]">{tpl.label}</p>
                                                <p className="text-[11px] text-gray-500 mt-0.5">{tpl.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.id_card_template && (
                                    <p className="mt-1 text-[11px] text-red-500">{errors.id_card_template}</p>
                                )}
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#FF5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {processing ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ─── RIGHT: Backup Panel ─── */}
                <div className="w-full xl:w-80 shrink-0">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                        <div className="flex items-start gap-3 mb-4 pb-3 border-b border-gray-100">
                            <div className="h-8 w-8 rounded-lg bg-[#FFF0E8] flex items-center justify-center shrink-0">
                                <Database className="h-4 w-4 text-[#FF5500]" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-[#202124]">Database Backup</h3>
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                    Create a complete SQL backup of the gosika_office database
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleBackup} className="mb-5">
                            <button
                                type="submit"
                                disabled={backupProcessing}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#202124] hover:bg-[#303134] text-white text-xs font-bold rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {backupProcessing ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Database className="h-4 w-4" />
                                )}
                                {backupProcessing ? 'Generating...' : 'Generate Backup Now'}
                            </button>
                        </form>

                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                                Backup History
                            </p>

                            {backups && backups.length > 0 ? (
                                <div className="space-y-2">
                                    {backups.map((backup, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3 rounded-xl bg-[#F7F8FA] border border-gray-100 group"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[11px] font-bold text-[#202124] truncate">
                                                        {backup.name}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                                        {formatBytes(backup.size_kb)} &bull; {formatDate(backup.created_at)}
                                                    </p>
                                                </div>
                                                <a
                                                    href={`/company-settings/backup/download/${backup.name}`}
                                                    className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-semibold text-gray-600 hover:text-[#FF5500] hover:border-[#FF5500] transition shrink-0"
                                                    title="Download backup"
                                                >
                                                    <Download className="h-3 w-3" />
                                                    Download
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Database className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                                    <p className="text-xs text-gray-400 font-medium">No backups yet</p>
                                    <p className="text-[11px] text-gray-300 mt-0.5">
                                        Generate your first backup above
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
