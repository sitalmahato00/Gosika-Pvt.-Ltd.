import React from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    XCircle,
    ShieldCheck,
    Phone,
    Globe,
    MapPin,
    Calendar,
    Hash,
    CreditCard,
    User,
    Briefcase,
    Building2,
    Clock,
    AlertTriangle,
    ArrowLeft,
} from 'lucide-react';

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(dateStr));
}

function formatNow() {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: 'short',
    }).format(new Date());
}

const DetailRow = ({ icon: Icon, label, value, highlight }) => (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
        <div className="h-7 w-7 rounded-lg bg-[#FFF0E8] flex items-center justify-center shrink-0 mt-0.5">
            <Icon className="h-3.5 w-3.5 text-[#FF5500]" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
            {highlight ? (
                <div className="mt-0.5">{highlight}</div>
            ) : (
                <p className="text-sm font-semibold text-[#202124] mt-0.5">{value || '—'}</p>
            )}
        </div>
    </div>
);

export default function VerifyId({ isValid, employee, company }) {
    const companyLocation = [company?.address, company?.city, company?.country].filter(Boolean).join(', ');

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7F8FA] via-[#FFF0E8]/30 to-[#F7F8FA] flex flex-col">
            {/* Top bar */}
            <div className="w-full bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <img
                                src={company?.logo_url || '/gosika-icon.svg'}
                                alt={company?.trading_name || company?.name || 'GOSIKA'}
                                className="h-8 max-w-36 object-contain"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#FF5500]" />
                        Official ID Verification Portal
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-start justify-center py-10 px-4 sm:px-6">
                <div className="w-full max-w-xl">
                    {isValid ? (
                        /* ──────────────── VALID ──────────────── */
                        <>
                            {/* Result Banner */}
                            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-5 flex items-center gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-emerald-700">✓ Identity Verified</p>
                                    <p className="text-xs text-emerald-600 mt-0.5">
                                        This employee's identity has been successfully verified in GOSIKA's official
                                        records.
                                    </p>
                                </div>
                            </div>

                            {/* Employee Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden mb-5">
                                {/* Card Header */}
                                <div className="bg-[#FF5500] px-6 py-4 flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                                        <User className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-black text-lg leading-tight">
                                            {employee?.full_name ?? '—'}
                                        </p>
                                        <p className="text-orange-100 text-xs font-semibold mt-0.5">
                                            {employee?.designation ?? '—'}
                                        </p>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/20 border border-white/30 text-white text-[10px] font-bold tracking-wider">
                                            {employee?.employee_code ?? '—'}
                                        </span>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="px-6 py-2">
                                    <DetailRow
                                        icon={Building2}
                                        label="Department"
                                        value={employee?.department}
                                    />
                                    <DetailRow
                                        icon={Briefcase}
                                        label="Designation"
                                        value={employee?.designation}
                                    />
                                    <DetailRow
                                        icon={Calendar}
                                        label="Joining Date"
                                        value={formatDate(employee?.joining_date)}
                                    />
                                    <DetailRow
                                        icon={CreditCard}
                                        label="Card Number"
                                        value={employee?.card_number}
                                    />
                                    <DetailRow
                                        icon={Hash}
                                        label="Card Status"
                                        highlight={
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                                    employee?.card_status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        : 'bg-red-50 text-red-700 border-red-200'
                                                }`}
                                            >
                                                <span className={`h-1.5 w-1.5 rounded-full ${employee?.card_status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                {employee?.card_status === 'active' ? 'Active' : (employee?.card_status ?? 'Unknown')}
                                            </span>
                                        }
                                    />
                                    {employee?.expiry_date && (
                                        <DetailRow
                                            icon={Clock}
                                            label="Card Expiry"
                                            value={formatDate(employee?.expiry_date)}
                                        />
                                    )}
                                    <DetailRow
                                        icon={User}
                                        label="Employee Status"
                                        highlight={
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                                    employee?.status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        : 'bg-gray-100 text-gray-600 border-gray-200'
                                                }`}
                                            >
                                                <span className={`h-1.5 w-1.5 rounded-full ${employee?.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                                {employee?.status === 'active' ? 'Active Employee' : (employee?.status ?? 'Unknown')}
                                            </span>
                                        }
                                    />
                                </div>
                            </div>

                            {/* Verification timestamp */}
                            <div className="bg-[#FFF0E8] border border-orange-200 rounded-xl p-3.5 flex items-center gap-2.5 mb-5">
                                <Clock className="h-4 w-4 text-[#FF5500] shrink-0" />
                                <p className="text-xs text-[#FF5500] font-semibold">
                                    This verification was performed on{' '}
                                    <strong>{formatNow()}</strong>
                                </p>
                            </div>
                        </>
                    ) : (
                        /* ──────────────── INVALID ──────────────── */
                        <>
                            {/* Result Banner */}
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-5 flex items-center gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-red-100 border-2 border-red-200 flex items-center justify-center shrink-0">
                                    <XCircle className="h-8 w-8 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-red-700">✗ Verification Failed</p>
                                    <p className="text-xs text-red-600 mt-0.5">
                                        The ID card presented could not be verified in the GOSIKA system.
                                    </p>
                                </div>
                            </div>

                            {/* Reason Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 mb-5">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#202124]">Card Not Recognized</p>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                            The ID card presented could not be verified. This card may be:
                                        </p>
                                    </div>
                                </div>
                                <ul className="space-y-2 ml-11">
                                    {[
                                        'Invalid or counterfeit',
                                        'Expired or revoked',
                                        'Not registered in the system',
                                        'Belonging to a former employee',
                                    ].map((reason) => (
                                        <li key={reason} className="flex items-center gap-2 text-xs text-gray-600">
                                            <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                                            {reason}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                    <p className="text-xs font-bold text-amber-800 mb-1">Need Help?</p>
                                    <p className="text-xs text-amber-700 leading-relaxed">
                                        If you believe this is an error, please contact the GOSIKA HR department
                                        directly. Do not grant access to the individual until identity is confirmed
                                        through official channels.
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Company Contact Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                            {company?.name ?? 'GOSIKA Pvt. Ltd.'} &mdash; Contact Information
                        </p>
                        <div className="space-y-2">
                            {company?.phone && (
                                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                                    <Phone className="h-3.5 w-3.5 text-[#FF5500] shrink-0" />
                                    <span className="font-medium">{company.phone}</span>
                                </div>
                            )}
                            {company?.website && (
                                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                                    <Globe className="h-3.5 w-3.5 text-[#FF5500] shrink-0" />
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-[#FF5500] hover:underline"
                                    >
                                        {company.website}
                                    </a>
                                </div>
                            )}
                            {companyLocation && (
                                <div className="flex items-start gap-2.5 text-xs text-gray-600">
                                    <MapPin className="h-3.5 w-3.5 text-[#FF5500] shrink-0 mt-0.5" />
                                    <span className="font-medium">{companyLocation}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-100 bg-white py-4 px-4 text-center">
                <p className="text-[11px] text-gray-400">
                    &copy; {new Date().getFullYear()}{' '}
                    <strong className="text-[#202124]">{company?.name ?? 'GOSIKA Pvt. Ltd.'}</strong>
                    {' '}&bull; Official ID Verification Portal &bull; All Rights Reserved.
                </p>
                <p className="text-[10px] text-gray-300 mt-1">
                    Unauthorized use of this portal is strictly prohibited and may be subject to legal action.
                </p>
            </footer>
        </div>
    );
}
