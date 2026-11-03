import React, { useState } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    Save,
    RefreshCw,
    ShieldCheck,
    KeyRound,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';

export default function AdminProfile() {
    const { auth, flash } = usePage().props;
    const user = auth?.user ?? {};

    // Profile form — single PUT to /admin/profile (updateProfile)
    const profileForm = useForm({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        avatar: null,
    });

    const [avatarPreview, setAvatarPreview] = useState(
        user.avatar_url || (user.avatar ? `/storage/${user.avatar}` : null)
    );

    // Password form — PUT to /admin/password
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [profileSuccess, setProfileSuccess] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        router.post('/profile', {
            _method: 'put',
            ...profileForm.data,
        }, {
            forceFormData: true,
            onSuccess: () => {
                setProfileSuccess('Profile updated successfully.');
                setTimeout(() => setProfileSuccess(''), 4000);
            },
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.put('/profile', {
            onSuccess: () => {
                setPasswordSuccess('Password updated successfully.');
                passwordForm.reset();
                setTimeout(() => setPasswordSuccess(''), 4000);
            },
        });
    };

    const initials = user.name
        ? user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : 'A';

    const PasswordInput = ({ label, name, form, show, onToggle, placeholder, autoComplete }) => (
        <div>
            <label className="block text-xs font-semibold text-[#202124] mb-1">
                {label} <span className="text-[#FF5500]">*</span>
            </label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type={show ? 'text' : 'password'}
                    value={form.data[name]}
                    onChange={(e) => form.setData(name, e.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={`w-full pl-9 pr-10 py-2 text-xs border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500] transition ${
                        form.errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    tabIndex={-1}
                >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
            {form.errors[name] && (
                <p className="mt-1 text-[11px] text-red-500">{form.errors[name]}</p>
            )}
        </div>
    );

    return (
        <AdminLayout title="Admin Profile">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-xl font-black text-[#202124]">Administrator Account</h1>
                <p className="text-xs text-gray-500 mt-1">
                    Manage your login credentials and account information.
                </p>
            </div>

            {/* Avatar Banner */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex items-center gap-5">
                {avatarPreview ? (
                    <img
                        src={avatarPreview}
                        alt={user.name || 'Admin'}
                        className="h-16 w-16 rounded-2xl object-cover border-2 border-[#FF5500] shadow-md shrink-0"
                    />
                ) : (
                    <div className="h-16 w-16 rounded-2xl bg-[#FF5500] text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md">
                        {initials}
                    </div>
                )}
                <div>
                    <p className="text-base font-black text-[#202124]">{user.name || 'Administrator'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user.email || '—'}</p>
                    <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        <ShieldCheck className="h-3 w-3" />
                        System Administrator
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ─── Profile Information ─── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                        <div className="h-8 w-8 rounded-lg bg-[#FFF0E8] flex items-center justify-center shrink-0">
                            <User className="h-4 w-4 text-[#FF5500]" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-[#202124]">Profile Information</h2>
                            <p className="text-[11px] text-gray-500">Update your name, email and phone number</p>
                        </div>
                    </div>

                    {profileSuccess && (
                        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-700 text-xs font-semibold">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            {profileSuccess}
                        </div>
                    )}

                    {profileForm.errors.general && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-xs font-semibold">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {profileForm.errors.general}
                        </div>
                    )}

                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        {/* Profile Photo / Avatar Picker */}
                        <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-3">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Preview"
                                    className="h-12 w-12 rounded-xl object-cover border border-[#FF5500] shrink-0"
                                />
                            ) : (
                                <div className="h-12 w-12 rounded-xl bg-[#FFF0E8] border border-[#FFD6C0] text-[#FF5500] font-black flex items-center justify-center text-sm shrink-0">
                                    {initials}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                                    Profile Picture
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            profileForm.setData('avatar', file);
                                            setAvatarPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                    className="w-full text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[11px] file:font-bold file:bg-[#FFF0E8] file:text-[#FF5500] hover:file:bg-orange-100 cursor-pointer"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#202124] mb-1">
                                Full Name <span className="text-[#FF5500]">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={profileForm.data.name}
                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                    placeholder="Your full name"
                                    autoComplete="name"
                                    className={`w-full pl-9 pr-3 py-2 text-xs border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500] transition ${
                                        profileForm.errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'
                                    }`}
                                />
                            </div>
                            {profileForm.errors.name && (
                                <p className="mt-1 text-[11px] text-red-500">{profileForm.errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#202124] mb-1">
                                Email Address <span className="text-[#FF5500]">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={profileForm.data.email}
                                    onChange={(e) => profileForm.setData('email', e.target.value)}
                                    placeholder="admin@company.com"
                                    autoComplete="email"
                                    className={`w-full pl-9 pr-3 py-2 text-xs border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500] transition ${
                                        profileForm.errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'
                                    }`}
                                />
                            </div>
                            {profileForm.errors.email && (
                                <p className="mt-1 text-[11px] text-red-500">{profileForm.errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#202124] mb-1">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="tel"
                                    value={profileForm.data.phone}
                                    onChange={(e) => profileForm.setData('phone', e.target.value)}
                                    placeholder="+977-98XXXXXXXX"
                                    autoComplete="tel"
                                    className={`w-full pl-9 pr-3 py-2 text-xs border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500] transition ${
                                        profileForm.errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'
                                    }`}
                                />
                            </div>
                            {profileForm.errors.phone && (
                                <p className="mt-1 text-[11px] text-red-500">{profileForm.errors.phone}</p>
                            )}
                        </div>

                        <div className="pt-1">
                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#FF5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {profileForm.processing ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {profileForm.processing ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ─── Change Password ─── */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                            <div className="h-8 w-8 rounded-lg bg-[#FFF0E8] flex items-center justify-center shrink-0">
                                <KeyRound className="h-4 w-4 text-[#FF5500]" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-[#202124]">Change Password</h2>
                                <p className="text-[11px] text-gray-500">Update your login password</p>
                            </div>
                        </div>

                        {passwordSuccess && (
                            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-700 text-xs font-semibold">
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                                {passwordSuccess}
                            </div>
                        )}

                        {passwordForm.errors.general && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-xs font-semibold">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {passwordForm.errors.general}
                            </div>
                        )}

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <PasswordInput
                                label="Current Password"
                                name="current_password"
                                form={passwordForm}
                                show={showCurrent}
                                onToggle={() => setShowCurrent(!showCurrent)}
                                placeholder="Enter current password"
                                autoComplete="current-password"
                            />
                            <PasswordInput
                                label="New Password"
                                name="password"
                                form={passwordForm}
                                show={showNew}
                                onToggle={() => setShowNew(!showNew)}
                                placeholder="At least 8 characters"
                                autoComplete="new-password"
                            />
                            <PasswordInput
                                label="Confirm New Password"
                                name="password_confirmation"
                                form={passwordForm}
                                show={showConfirm}
                                onToggle={() => setShowConfirm(!showConfirm)}
                                placeholder="Re-enter new password"
                                autoComplete="new-password"
                            />

                            {/* Password strength hint */}
                            {passwordForm.data.password && (
                                <div className="space-y-1">
                                    {[
                                        { label: 'At least 8 characters', ok: passwordForm.data.password.length >= 8 },
                                        { label: 'Contains a number', ok: /\d/.test(passwordForm.data.password) },
                                        { label: 'Contains a letter', ok: /[a-zA-Z]/.test(passwordForm.data.password) },
                                    ].map((rule) => (
                                        <div key={rule.label} className="flex items-center gap-1.5">
                                            <div className={`h-1.5 w-1.5 rounded-full ${rule.ok ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                            <span className={`text-[10px] ${rule.ok ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                {rule.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="pt-1">
                                <button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#202124] hover:bg-[#303134] text-white text-xs font-bold rounded-xl shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {passwordForm.processing ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <KeyRound className="h-4 w-4" />
                                    )}
                                    {passwordForm.processing ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Security Note */}
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                        <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-amber-800 mb-1">Security Recommendations</p>
                            <ul className="space-y-1">
                                {[
                                    'Use a strong password with 12+ characters.',
                                    'Include uppercase, lowercase, numbers, and symbols.',
                                    'Never share your credentials with anyone.',
                                    'Change your password every 90 days.',
                                ].map((tip) => (
                                    <li key={tip} className="text-[11px] text-amber-700 flex items-start gap-1.5">
                                        <span className="mt-1 h-1 w-1 rounded-full bg-amber-500 shrink-0" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
