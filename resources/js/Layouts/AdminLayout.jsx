import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    Building2,
    CalendarCheck,
    Clock,
    Palmtree,
    Banknote,
    CreditCard,
    Briefcase,
    CheckSquare,
    Video,
    CalendarDays,
    Megaphone,
    PieChart,
    ArrowDownRight,
    ArrowUpRight,
    FolderTree,
    FileSpreadsheet,
    Package,
    Boxes,
    Truck,
    FolderLock,
    BarChart3,
    Settings,
    Bell,
    Database,
    History,
    UserCircle,
    LogOut,
    Menu,
    ChevronDown,
    ChevronRight,
    Search,
    AlertCircle,
    CheckCircle2,
    X
} from 'lucide-react';

export default function AdminLayout({ children, title = 'Dashboard' }) {
    const { auth, company, flash, notifications } = usePage().props;
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const currentUrl = window.location.pathname;
    const companyLocation = [company?.city, company?.country].filter(Boolean).join(', ') || 'Location not set';

    const navGroups = [
        {
            title: 'DASHBOARD',
            items: [
                { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
            ],
        },
        {
            title: 'HUMAN RESOURCES',
            items: [
                { name: 'Employees', href: '/employees', icon: Users },
                { name: 'Departments', href: '/departments', icon: Building2 },
                { name: 'Attendance', href: '/attendance', icon: CalendarCheck },
                { name: 'Leave Management', href: '/leave-management', icon: Clock },
                { name: 'Holidays', href: '/holidays', icon: Palmtree },
                { name: 'Payroll', href: '/payroll', icon: Banknote },
                { name: 'Employee ID Cards', href: '/employee-id-cards', icon: CreditCard },
            ],
        },
        {
            title: 'OPERATIONS',
            items: [
                { name: 'Projects', href: '/projects', icon: Briefcase },
                { name: 'Tasks (Kanban)', href: '/tasks/kanban', icon: CheckSquare },
                { name: 'Meetings', href: '/meetings', icon: Video },
                { name: 'Master Calendar', href: '/calendar', icon: CalendarDays },
                { name: 'Announcements', href: '/announcements', icon: Megaphone },
            ],
        },
        {
            title: 'FINANCE',
            items: [
                { name: 'Finance Dashboard', href: '/finance', icon: PieChart },
                { name: 'Corporate Income', href: '/finance/income', icon: ArrowDownRight },
                { name: 'Office Expenses', href: '/finance/expenses', icon: ArrowUpRight },
                { name: 'Expense Categories', href: '/finance/categories', icon: FolderTree },
                { name: 'Financial Statements', href: '/finance/statements', icon: FileSpreadsheet },
            ],
        },
        {
            title: 'OFFICE MANAGEMENT',
            items: [
                { name: 'Company Assets', href: '/assets', icon: Package },
                { name: 'Inventory & Supplies', href: '/inventory', icon: Boxes },
                { name: 'Suppliers Directory', href: '/suppliers', icon: Truck },
            ],
        },
        {
            title: 'DOCUMENTS',
            items: [
                { name: 'Document Vault', href: '/documents', icon: FolderLock },
            ],
        },
        {
            title: 'REPORTS',
            items: [
                { name: 'Reports Hub', href: '/reports', icon: BarChart3 },
            ],
        },
        {
            title: 'SYSTEM',
            items: [
                { name: 'Company Settings', href: '/company-settings', icon: Settings },
                { name: 'Notifications', href: '/notifications', icon: Bell },
                { name: 'Audit Logs', href: '/audit-logs', icon: History },
                { name: 'Admin Account', href: '/profile', icon: UserCircle },
            ],
        },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        router.get(`/employees?search=${encodeURIComponent(searchQuery)}`);
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const currentDateFormatted = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date());

    return (
        <div className="min-h-screen bg-[#F7F8FA] flex">
            {/* Mobile backdrop */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-[#E5E7EB] transition-all duration-300 ease-in-out ${
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}
            >
                {/* Brand Logo Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-[#E5E7EB] bg-white">
                    <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
                        {company?.logo_url ? (
                            <img src={company.logo_url} alt={company.name || 'GOSIKA'} className="h-9 max-w-[150px] object-contain" />
                        ) : (
                            <>
                                <img src="/gosika-icon.svg" alt="GOSIKA" className="h-9 w-9 shrink-0" />
                                {!sidebarCollapsed && (
                                    <div className="flex flex-col">
                                        <span className="text-lg font-black tracking-tight text-[#202124] leading-tight">
                                            GOSIKA <span className="text-[#FF5500]">OFFICE</span>
                                        </span>
                                        <span className="text-[10px] font-semibold text-[#6B7280] tracking-wider uppercase">
                                            Management Suite
                                        </span>
                                    </div>
                                )}
                            </>
                        )}
                    </Link>
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation Scrollable Body */}
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
                    {navGroups.map((group, gIdx) => (
                        <div key={gIdx} className="space-y-1">
                            {!sidebarCollapsed ? (
                                <p className="px-3 text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                                    {group.title}
                                </p>
                            ) : (
                                <div className="border-t border-gray-100 my-2" />
                            )}
                            {group.items.map((item, idx) => {
                                const Icon = item.icon;
                                const isActive = currentUrl === item.href || (item.href !== '/dashboard' && currentUrl.startsWith(item.href));

                                return (
                                    <Link
                                        key={idx}
                                        href={item.href}
                                        title={sidebarCollapsed ? item.name : undefined}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                                            isActive
                                                ? 'bg-[#FFF0E8] text-[#FF5500]'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-[#202124]'
                                        }`}
                                    >
                                        <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#FF5500]' : 'text-gray-400'}`} />
                                        {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Sidebar Footer User info */}
                <div className="p-3 border-t border-[#E5E7EB] bg-gray-50/50">
                    <div className="flex items-center gap-3 p-1">
                        <div className="h-8 w-8 rounded-full bg-[#FFF0E8] text-[#FF5500] font-bold flex items-center justify-center shrink-0 border border-[#FFD6C0]">
                            {auth?.user?.name ? auth.user.name.charAt(0) : 'A'}
                        </div>
                        {!sidebarCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-900 truncate">{auth?.user?.name || 'Administrator'}</p>
                                <p className="text-[10px] text-gray-500 truncate">{auth?.user?.email || 'Administrator'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
                {/* Sticky Header */}
                <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 sm:px-6 shadow-xs">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="relative hidden md:block w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search employees, documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#FF5500] focus:border-[#FF5500] transition"
                            />
                        </form>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Current Date & Time Display */}
                        <div className="hidden sm:flex flex-col text-right">
                            <span className="text-xs font-bold text-gray-800">{currentDateFormatted}</span>
                            <span className="text-[10px] text-gray-400">{companyLocation}</span>
                        </div>

                        <div className="h-6 w-px bg-gray-200 hidden sm:block" />

                        {/* Notifications Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setNotificationsOpen(!notificationsOpen);
                                    setUserDropdownOpen(false);
                                }}
                                className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
                                title="Notifications"
                            >
                                <Bell className="h-5 w-5" />
                                {notifications?.unread_count > 0 && (
                                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#FF5500] ring-2 ring-white" />
                                )}
                            </button>

                            {notificationsOpen && (
                                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-xl border border-gray-100 py-2 z-50">
                                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                                        <span className="text-xs font-bold text-gray-900">Notifications</span>
                                        <Link href="/notifications" className="text-[11px] font-semibold text-[#FF5500] hover:underline">
                                            View All
                                        </Link>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                                        {notifications?.recent && notifications.recent.length > 0 ? (
                                            notifications.recent.map((n) => (
                                                <Link
                                                    key={n.id}
                                                    href={n.link || '/notifications'}
                                                    className="block px-4 py-2.5 hover:bg-gray-50 transition"
                                                    onClick={() => setNotificationsOpen(false)}
                                                >
                                                    <p className="text-xs font-semibold text-gray-800">{n.title}</p>
                                                    <p className="text-[11px] text-gray-500 truncate mt-0.5">{n.message}</p>
                                                </Link>
                                            ))
                                        ) : (
                                            <p className="px-4 py-4 text-xs text-gray-400 text-center">No unread notifications</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setUserDropdownOpen(!userDropdownOpen);
                                    setNotificationsOpen(false);
                                }}
                                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition"
                            >
                                {auth?.user?.avatar_url || auth?.user?.avatar ? (
                                    <img
                                        src={auth?.user?.avatar_url || `/storage/${auth?.user?.avatar}`}
                                        alt={auth?.user?.name || 'Admin'}
                                        className="h-8 w-8 rounded-full object-cover border border-[#FF5500] shadow-2xs"
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-[#FF5500] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                                        {auth?.user?.name ? auth.user.name.charAt(0) : 'A'}
                                    </div>
                                )}
                                <span className="hidden md:block text-xs font-bold text-gray-800">
                                    {auth?.user?.name?.split(' ')[0] || 'Admin'}
                                </span>
                                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                            </button>

                            {userDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl border border-gray-100 py-1.5 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-xs font-bold text-gray-900">{auth?.user?.name}</p>
                                        <p className="text-[10px] text-gray-500 truncate">{auth?.user?.email}</p>
                                    </div>
                                    <Link
                                        href="/profile"
                                        onClick={() => setUserDropdownOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition font-medium"
                                    >
                                        <UserCircle className="h-4 w-4 text-gray-400" />
                                        Admin Account
                                    </Link>
                                    <Link
                                        href="/company-settings"
                                        onClick={() => setUserDropdownOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition font-medium"
                                    >
                                        <Settings className="h-4 w-4 text-gray-400" />
                                        Company Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition font-medium border-t border-gray-100"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mx-4 sm:mx-6 mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span>{flash.success}</span>
                        </div>
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-4 sm:mx-6 mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                            <span>{flash.error}</span>
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>

                {/* Footer */}
                <footer className="h-12 border-t border-[#E5E7EB] bg-white px-4 sm:px-6 flex items-center justify-between text-[11px] text-gray-400">
                    <div>
                        &copy; {new Date().getFullYear()} <strong>{company?.name || 'GOSIKA Pvt. Ltd.'}</strong> &bull; All Rights Reserved.
                    </div>
                    <div>
                        Office Suite v2.0 &bull; Currency: <strong>{company?.currency || 'NPR'}</strong>
                    </div>
                </footer>
            </div>
        </div>
    );
}
