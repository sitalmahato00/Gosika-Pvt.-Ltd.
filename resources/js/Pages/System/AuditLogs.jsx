import React, { useState } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    History,
    Search,
    Filter,
    ChevronDown,
    User,
    Calendar,
    FileText,
    ShieldAlert,
    Info,
} from 'lucide-react';

const ACTION_BADGES = {
    create: { label: 'Create', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    update: { label: 'Update', class: 'bg-blue-100 text-blue-700 border-blue-200' },
    delete: { label: 'Delete', class: 'bg-red-100 text-red-700 border-red-200' },
    export: { label: 'Export', class: 'bg-purple-100 text-purple-700 border-purple-200' },
    backup: { label: 'Backup', class: 'bg-[#FFF0E8] text-[#FF5500] border-orange-200' },
    view:   { label: 'View',   class: 'bg-gray-100 text-gray-600 border-gray-200' },
    login:  { label: 'Login',  class: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    logout: { label: 'Logout', class: 'bg-slate-100 text-slate-600 border-slate-200' },
};

const ACTIONS = ['create', 'update', 'delete', 'export', 'backup', 'view'];

function formatModule(str) {
    if (!str) return '—';
    return str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDateTime(dateStr) {
    if (!dateStr) return { date: '—', time: '' };
    const d = new Date(dateStr);
    return {
        date: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(d),
        time: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(d),
    };
}

export default function AuditLogs({ logs, modules, filters }) {
    const [localFilters, setLocalFilters] = useState({
        module: filters?.module ?? '',
        action: filters?.action ?? '',
        search: filters?.search ?? '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(
            '/audit-logs',
            {
                module: localFilters.module || undefined,
                action: localFilters.action || undefined,
                search: localFilters.search || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleReset = () => {
        setLocalFilters({ module: '', action: '', search: '' });
        router.get('/audit-logs', {}, { replace: true });
    };

    const paginationLinks = logs?.links ?? [];
    const hasPagination = logs?.last_page > 1;
    const logItems = logs?.data ?? [];

    const hasActiveFilters = localFilters.module || localFilters.action || localFilters.search;

    return (
        <AdminLayout title="Audit Logs">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-xl font-black text-[#202124]">Audit Trail</h1>
                <p className="text-xs text-gray-500 mt-1">
                    Complete record of all administrative actions performed in the system.
                </p>
            </div>

            {/* Read-only notice */}
            <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-xl bg-amber-50 border border-amber-200">
                <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 font-medium">
                    Logs are <strong>read-only</strong> and cannot be modified or deleted. This ensures a
                    complete and tamper-proof audit trail.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
                <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-3 items-end">
                    {/* Module dropdown */}
                    <div className="flex-1 min-w-0">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                            Module
                        </label>
                        <div className="relative">
                            <select
                                value={localFilters.module}
                                onChange={(e) => setLocalFilters({ ...localFilters, module: e.target.value })}
                                className="w-full appearance-none pl-3 pr-8 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500] transition"
                            >
                                <option value="">All Modules</option>
                                {(modules ?? []).map((m) => (
                                    <option key={m} value={m}>
                                        {formatModule(m)}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Action dropdown */}
                    <div className="flex-1 min-w-0">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                            Action
                        </label>
                        <div className="relative">
                            <select
                                value={localFilters.action}
                                onChange={(e) => setLocalFilters({ ...localFilters, action: e.target.value })}
                                className="w-full appearance-none pl-3 pr-8 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500] transition"
                            >
                                <option value="">All Actions</option>
                                {ACTIONS.map((a) => (
                                    <option key={a} value={a}>
                                        {a.charAt(0).toUpperCase() + a.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Search input */}
                    <div className="flex-[2] min-w-0">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                            Search
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={localFilters.search}
                                onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                                placeholder="Search description, user, module..."
                                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500] transition"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 shrink-0">
                        <button
                            type="submit"
                            className="flex items-center gap-1.5 px-4 py-2 bg-[#FF5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-lg shadow-sm transition"
                        >
                            <Filter className="h-3.5 w-3.5" />
                            Apply Filters
                        </button>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-3 py-2 border border-gray-200 text-xs font-semibold text-gray-600 rounded-lg hover:bg-gray-50 transition"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Log Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {logItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                            <History className="h-7 w-7 text-gray-300" />
                        </div>
                        <p className="text-sm font-bold text-gray-400">No audit logs found</p>
                        <p className="text-xs text-gray-300 mt-1">
                            {hasActiveFilters
                                ? 'No logs match your current filters.'
                                : 'System actions will appear here as they occur.'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="bg-[#F7F8FA] border-b border-gray-100">
                                        <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                            Timestamp
                                        </th>
                                        <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            Action
                                        </th>
                                        <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            Module
                                        </th>
                                        <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                            Record ID
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logItems.map((log, idx) => {
                                        const { date, time } = formatDateTime(log.created_at);
                                        const actionCfg = ACTION_BADGES[log.action] ?? ACTION_BADGES.view;
                                        return (
                                            <tr
                                                key={log.id}
                                                className={`border-b border-gray-50 transition ${
                                                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                } hover:bg-[#FFF0E8]/40`}
                                            >
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <p className="font-semibold text-[#202124]">{date}</p>
                                                    <p className="text-[11px] text-gray-400">{time}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-6 w-6 rounded-full bg-[#FFF0E8] text-[#FF5500] font-bold text-[10px] flex items-center justify-center shrink-0">
                                                            {log.user?.name
                                                                ? log.user.name.charAt(0).toUpperCase()
                                                                : 'S'}
                                                        </div>
                                                        <span className="font-medium text-[#202124] whitespace-nowrap">
                                                            {log.user?.name ?? 'System'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${actionCfg.class}`}
                                                    >
                                                        {actionCfg.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="font-medium text-[#202124]">
                                                        {formatModule(log.module)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 max-w-xs">
                                                    <p className="text-gray-600 truncate" title={log.description}>
                                                        {log.description || '—'}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {log.record_id ? (
                                                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[10px]">
                                                            #{log.record_id}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-300">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-50">
                            {logItems.map((log, idx) => {
                                const { date, time } = formatDateTime(log.created_at);
                                const actionCfg = ACTION_BADGES[log.action] ?? ACTION_BADGES.view;
                                return (
                                    <div
                                        key={log.id}
                                        className={`p-4 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div>
                                                <p className="text-[11px] text-gray-400">
                                                    {date} &bull; {time}
                                                </p>
                                                <p className="text-xs font-bold text-[#202124] mt-0.5">
                                                    {log.user?.name ?? 'System'}
                                                </p>
                                            </div>
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${actionCfg.class}`}
                                            >
                                                {actionCfg.label}
                                            </span>
                                        </div>
                                        <p className="text-[11px] font-semibold text-gray-500 mb-1">
                                            {formatModule(log.module)}
                                            {log.record_id && (
                                                <span className="ml-1.5 font-mono text-gray-400">
                                                    #{log.record_id}
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-600">{log.description || '—'}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {hasPagination && (
                            <div className="flex items-center justify-between gap-3 py-4 border-t border-gray-100 px-4">
                                <p className="text-[11px] text-gray-400">
                                    Showing{' '}
                                    <strong className="text-gray-600">
                                        {logs?.from}–{logs?.to}
                                    </strong>{' '}
                                    of <strong className="text-gray-600">{logs?.total}</strong> entries
                                </p>
                                <div className="flex items-center gap-1">
                                    {paginationLinks.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url ?? '#'}
                                            preserveScroll
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                                link.active
                                                    ? 'bg-[#FF5500] text-white shadow-sm'
                                                    : link.url
                                                    ? 'text-gray-600 hover:bg-gray-100'
                                                    : 'text-gray-300 pointer-events-none'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
