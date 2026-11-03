import React from 'react';
import { useForm, Head, usePage } from '@inertiajs/react';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
    const { company } = usePage().props;
    const companyLocation = [company?.address, company?.city, company?.country]
        .filter(Boolean)
        .join(', ');
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen bg-[#F7F8FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Administrator Login" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="inline-flex items-center justify-center h-16 min-w-16 max-w-56 rounded-2xl bg-white shadow-lg border border-gray-100 p-2.5 mb-4">
                    <img
                        src={company?.logo_url || '/gosika-icon.svg'}
                        alt={company?.name || 'GOSIKA'}
                        className="h-full max-w-full object-contain"
                    />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-[#202124]">
                    {company?.trading_name || company?.name || 'GOSIKA'}{' '}
                    <span className="text-[#FF5500]">OFFICE</span>
                </h2>
                <p className="mt-1 text-xs font-semibold text-[#6B7280] tracking-wide uppercase">
                    Internal Company Administration System
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-xl shadow-gray-200/50 rounded-2xl sm:px-10 border border-[#E5E7EB]">
                    <div className="mb-6 pb-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Sign in to your account</h3>
                            <p className="text-xs text-gray-500">Authorized corporate administrator access only</p>
                        </div>
                        <ShieldCheck className="h-5 w-5 text-[#FF5500]" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Official Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="name@company.com"
                                    className="block w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#FF5500] focus:border-[#FF5500] transition"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••••••"
                                    className="block w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#FF5500] focus:border-[#FF5500] transition"
                                />
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-600 font-medium">{errors.password}</p>}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 text-[#FF5500] focus:ring-[#FF5500] border-gray-300 rounded"
                                />
                                <span className="ml-2 text-xs text-gray-600 font-medium">Keep me signed in</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5500] shadow-md transition disabled:opacity-50"
                        >
                            <span>{processing ? 'Authenticating...' : 'Sign In as Administrator'}</span>
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </form>

                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                    {company?.name || 'GOSIKA Pvt. Ltd.'} &bull; Secure Corporate Infrastructure
                    {companyLocation && <> &bull; {companyLocation}</>}
                </p>
            </div>
        </div>
    );
}
