import React, { useState } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Bell,
    Info,
    CheckCircle2,
    AlertTriangle,
    AlertCircle,
    BellOff,
    CheckCheck,
    Clock,
} from 'lucide-react';

/**
 * Returns a human-readable "time ago" string.
 */
function timeAgo(dateStr) {
    if (!dateStr) return '—';
    const now = new Date();
    const past = new Date(dateStr);
    const diffMs = now - past;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
    if (weeks < 5) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    return `${months} month${months !== 1 ? 's' : ''} ago`;
}

const TYPE_CONFIG = {
    info: {
        Icon: Info,
        iconClass: 'text-blue-500',
        bgClass: 'bg-blue-50',
        dotClass: 'bg-blue-500',
    },
    success: {
        Icon: CheckCircle2,
        iconClass: 'text-emerald-500',
        bgClass: 'bg-emerald-50',
        dotClass: 'bg-emerald-500',
    },
    warning: {
        Icon: AlertTriangle,
        iconClass: 'text-amber-500',
        bgClass: 'bg-amber-50',
        dotClass: 'bg-amber-500',
    },
    danger: {
        Icon: AlertCircle,
        iconClass: 'text-red-500',
        bgClass: 'bg-red-50',
        dotClass: 'bg-red-500',
    },
};

export default function Notifications({ notifications }) {
    const [activeTab, setActiveTab] = useState('all');

    const allItems = notifications?.data ?? [];

    const filtered = allItems.filter((n) => {
        if (activeTab === 'unread') return !n.is_read;
        if (activeTab === 'read') return n.is_read;
        return true;
    });

    const unreadCount = allItems.filter((n) => !n.is_read).length;

    const handleMarkRead = (id) => {
        router.post(`/notifications/${id}/mark-read`, {}, {
            preserveScroll: true,
        });
    };

    const handleMarkAllRead = () => {
        router.post('/notifications/mark-all-read', {}, {
            preserveScroll: true,
        });
    };

    const tabs = [
        { key: 'all', label: 'All', count: allItems.length },
        { key: 'unread', label: 'Unread', count: unreadCount },
        { key: 'read', label: 'Read', count: allItems.length - unreadCount },
    ];

    const paginationLinks = notifications?.links ?? [];
    const hasPagination = notifications?.last_page > 1;

    return (
        <AdminLayout title="Notifications">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-xl font-black text-[#202124]">Notifications</h1>
                    <p className="text-xs text-gray-500 mt-1">
                        {unreadCount > 0
                            ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}.`
                            : 'All notifications are read.'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-2 px-4 py-2 bg-[#FF5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl shadow-sm transition self-start sm:self-auto"
                    >
                        <CheckCheck className="h-4 w-4" />
                        Mark All as Read
                    </button>
                )}
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Filter Tabs */}
                <div className="flex border-b border-gray-100 px-2 pt-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-t-lg transition ${
                                activeTab === tab.key
                                    ? 'text-[#FF5500] border-b-2 border-[#FF5500] bg-[#FFF0E8]'
                                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                            }`}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span
                                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                                        activeTab === tab.key
                                            ? 'bg-[#FF5500] text-white'
                                            : 'bg-gray-100 text-gray-500'
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                            <BellOff className="h-7 w-7 text-gray-300" />
                        </div>
                        <p className="text-sm font-bold text-gray-400">No notifications</p>
                        <p className="text-xs text-gray-300 mt-1">
                            {activeTab === 'unread'
                                ? 'All caught up! No unread notifications.'
                                : activeTab === 'read'
                                ? 'No read notifications yet.'
                                : 'You have no notifications at this time.'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filtered.map((notification) => {
                            const typeKey = notification.type in TYPE_CONFIG ? notification.type : 'info';
                            const { Icon, iconClass, bgClass, dotClass } = TYPE_CONFIG[typeKey];

                            return (
                                <div
                                    key={notification.id}
                                    className={`flex items-start gap-4 px-5 py-4 transition ${
                                        !notification.is_read ? 'bg-[#FFF0E8]' : 'bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    {/* Type Icon */}
                                    <div
                                        className={`h-9 w-9 rounded-xl ${bgClass} flex items-center justify-center shrink-0 mt-0.5`}
                                    >
                                        <Icon className={`h-4.5 w-4.5 ${iconClass}`} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-[#202124] leading-snug">
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                            </div>
                                            {/* Unread dot */}
                                            {!notification.is_read && (
                                                <span
                                                    className={`h-2 w-2 rounded-full ${dotClass} shrink-0 mt-1`}
                                                    title="Unread"
                                                />
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="flex items-center gap-1 text-[11px] text-gray-400">
                                                <Clock className="h-3 w-3" />
                                                {timeAgo(notification.created_at)}
                                            </span>
                                            {!notification.is_read && (
                                                <button
                                                    onClick={() => handleMarkRead(notification.id)}
                                                    className="flex items-center gap-1 text-[11px] font-semibold text-[#FF5500] hover:text-[#e04a00] transition"
                                                >
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Mark as Read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {hasPagination && (
                    <div className="flex items-center justify-center gap-1 py-4 border-t border-gray-100 px-4">
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
                )}
            </div>
        </AdminLayout>
    );
}
