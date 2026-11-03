import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/Badge';
import {
    Users,
    UserCheck,
    UserX,
    Clock,
    Briefcase,
    CheckSquare,
    TrendingUp,
    TrendingDown,
    Wallet,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    AlertCircle,
    ChevronRight,
    MapPin,
    Video,
    History
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard({
    metrics,
    financialChart,
    deptDistribution,
    recentExpenses,
    upcomingMeetings,
    urgentTasks,
    upcomingHolidays,
    recentActivities,
    notifications
}) {
    // Chart.js data configuration for Income vs Expenses
    const chartLabels = financialChart.map((item) => item.month);
    const incomeData = financialChart.map((item) => item.income);
    const expenseData = financialChart.map((item) => item.expense);

    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Income (NPR)',
                data: incomeData,
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                fill: true,
                tension: 0.35,
                borderWidth: 2,
                pointBackgroundColor: '#10B981',
                pointRadius: 4,
            },
            {
                label: 'Expenses (NPR)',
                data: expenseData,
                borderColor: '#FF5500',
                backgroundColor: 'rgba(255, 85, 0, 0.08)',
                fill: true,
                tension: 0.35,
                borderWidth: 2,
                pointBackgroundColor: '#FF5500',
                pointRadius: 4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    boxWidth: 12,
                    boxHeight: 12,
                    font: { size: 11, weight: '600' },
                    color: '#6B7280',
                },
            },
            tooltip: {
                backgroundColor: '#202124',
                titleFont: { size: 12, weight: 'bold' },
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: NPR ${context.parsed.y.toLocaleString()}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 }, color: '#9CA3AF' },
            },
            y: {
                grid: { color: '#F3F4F6' },
                ticks: {
                    font: { size: 11 },
                    color: '#9CA3AF',
                    callback: function (val) {
                        return val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val;
                    },
                },
            },
        },
    };

    return (
        <AdminLayout title="Overview Dashboard">
            <Head title="Executive Dashboard" />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Executive Company Overview
                    </h1>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                        Live real-time operational status, HR metrics, and corporate finances
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <Link
                        href="/employees/create"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#FF5500] hover:bg-[#E04B00] rounded-lg shadow-xs transition"
                    >
                        <span>+ Add Employee</span>
                    </Link>
                    <Link
                        href="/reports"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-xs transition"
                    >
                        <span>Reports Hub</span>
                    </Link>
                </div>
            </div>

            {/* 9 Core KPI Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 gap-3 sm:gap-4 mb-6">
                {/* Total Employees */}
                <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] shadow-2xs">
                    <div className="flex items-center justify-between text-gray-400 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Staff</span>
                        <Users className="h-4 w-4 text-[#FF5500]" />
                    </div>
                    <p className="text-lg font-black text-[#202124]">{metrics.total_employees}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Active Workforce</p>
                </div>

                {/* Present Today */}
                <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] shadow-2xs">
                    <div className="flex items-center justify-between text-gray-400 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Present</span>
                        <UserCheck className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="text-lg font-black text-emerald-600">{metrics.present_today}</p>
                    <p className="text-[10px] text-emerald-700 mt-0.5 font-medium">Checked in today</p>
                </div>

                {/* Absent Today */}
                <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] shadow-2xs">
                    <div className="flex items-center justify-between text-gray-400 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Absent</span>
                        <UserX className="h-4 w-4 text-red-500" />
                    </div>
                    <p className="text-lg font-black text-red-600">{metrics.absent_today}</p>
                    <p className="text-[10px] text-red-700 mt-0.5 font-medium">Not checked in</p>
                </div>

                {/* Pending Leaves */}
                <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] shadow-2xs">
                    <div className="flex items-center justify-between text-gray-400 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Leaves</span>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="text-lg font-black text-amber-600">{metrics.pending_leaves}</p>
                    <Link href="/leave-management" className="text-[10px] text-amber-700 hover:underline mt-0.5 block font-medium">
                        Review pending
                    </Link>
                </div>

                {/* Active Projects */}
                <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] shadow-2xs">
                    <div className="flex items-center justify-between text-gray-400 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Projects</span>
                        <Briefcase className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-lg font-black text-[#202124]">{metrics.active_projects}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">In execution</p>
                </div>

                {/* Pending Tasks */}
                <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] shadow-2xs">
                    <div className="flex items-center justify-between text-gray-400 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Tasks</span>
                        <CheckSquare className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-lg font-black text-[#202124]">{metrics.pending_tasks}</p>
                    <Link href="/tasks/kanban" className="text-[10px] text-purple-700 hover:underline mt-0.5 block font-medium">
                        Kanban board
                    </Link>
                </div>

                {/* Monthly Income */}
                <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] shadow-2xs">
                    <div className="flex items-center justify-between text-gray-400 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Income</span>
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="text-sm font-black text-emerald-600 truncate">
                        रू {metrics.monthly_income >= 1000 ? `${(metrics.monthly_income / 1000).toFixed(0)}k` : metrics.monthly_income}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">This Month</p>
                </div>

                {/* Monthly Expenses */}
                <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] shadow-2xs">
                    <div className="flex items-center justify-between text-gray-400 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Expense</span>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </div>
                    <p className="text-sm font-black text-red-600 truncate">
                        रू {metrics.monthly_expenses >= 1000 ? `${(metrics.monthly_expenses / 1000).toFixed(0)}k` : metrics.monthly_expenses}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">This Month</p>
                </div>

                {/* Available Balance */}
                <div className="bg-[#FFF0E8] p-3.5 rounded-xl border border-[#FFD6C0] shadow-2xs">
                    <div className="flex items-center justify-between text-[#662200] mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Balance</span>
                        <Wallet className="h-4 w-4 text-[#FF5500]" />
                    </div>
                    <p className="text-sm font-black text-[#FF5500] truncate">
                        रू {metrics.available_balance >= 1000 ? `${(metrics.available_balance / 1000).toFixed(0)}k` : metrics.available_balance}
                    </p>
                    <p className="text-[10px] text-[#8C2E00] mt-0.5 font-medium">Net Corporate</p>
                </div>
            </div>

            {/* Middle Section: Financial Trajectory Chart & Department Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Income vs Expenses Chart */}
                <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-sm font-bold text-[#202124]">Monthly Financial Cash Flow</h2>
                            <p className="text-xs text-gray-500">Income vs Operating Expenses (Last 6 Months)</p>
                        </div>
                        <Link href="/finance/statements" className="text-xs font-semibold text-[#FF5500] hover:underline flex items-center gap-1">
                            <span>Full Statement</span>
                            <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="h-64">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Department Distribution */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-[#202124]">Department Distribution</h2>
                            <Link href="/departments" className="text-xs font-semibold text-[#FF5500] hover:underline">
                                View
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {deptDistribution.map((dept) => {
                                const percentage = metrics.total_employees > 0
                                    ? Math.round((dept.count / metrics.total_employees) * 100)
                                    : 0;

                                return (
                                    <div key={dept.id}>
                                        <div className="flex justify-between text-xs font-semibold mb-1">
                                            <span className="text-gray-700">{dept.name}</span>
                                            <span className="text-gray-500">{dept.count} staff ({percentage}%)</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#FF5500] rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <span>Total Active Departments:</span>
                        <span className="font-bold text-gray-800">{deptDistribution.length}</span>
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Recent Expenses, Upcoming Meetings, Urgent Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Recent Office Expenses */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-[#202124]">Recent Operating Expenses</h2>
                        <Link href="/finance/expenses" className="text-xs font-semibold text-[#FF5500] hover:underline">
                            All Expenses
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentExpenses.length > 0 ? (
                            recentExpenses.map((exp) => (
                                <div key={exp.id} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/70 border border-gray-100">
                                    <div className="min-w-0 pr-2">
                                        <p className="text-xs font-bold text-gray-900 truncate">{exp.title}</p>
                                        <p className="text-[10px] text-gray-500">{exp.category?.name} &bull; {exp.date}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xs font-black text-red-600 font-mono">
                                            रू {Number(exp.amount).toLocaleString()}
                                        </p>
                                        <Badge variant="default" className="text-[9px] px-1.5 py-0">
                                            {exp.payee}
                                        </Badge>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-400 text-center py-4">No recent expenses logged</p>
                        )}
                    </div>
                </div>

                {/* Upcoming Meetings */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-[#202124]">Upcoming Meetings</h2>
                        <Link href="/meetings" className="text-xs font-semibold text-[#FF5500] hover:underline">
                            Schedule
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {upcomingMeetings.length > 0 ? (
                            upcomingMeetings.map((m) => (
                                <div key={m.id} className="p-2.5 rounded-xl border border-gray-100 bg-[#F7F8FA]/80">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-xs font-bold text-gray-900 truncate">{m.title}</p>
                                        <span className="text-[10px] font-semibold text-[#FF5500] bg-[#FFF0E8] px-1.5 py-0.5 rounded">
                                            {m.start_time.substring(0, 5)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                        <Calendar className="h-3 w-3" />
                                        <span>{m.meeting_date}</span>
                                        <span>&bull;</span>
                                        <MapPin className="h-3 w-3" />
                                        <span className="truncate">{m.location_or_link}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-400 text-center py-4">No upcoming meetings scheduled</p>
                        )}
                    </div>
                </div>

                {/* Urgent Pending Tasks */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-[#202124]">High Priority Tasks</h2>
                        <Link href="/tasks/kanban" className="text-xs font-semibold text-[#FF5500] hover:underline">
                            Kanban
                        </Link>
                    </div>
                    <div className="space-y-2.5">
                        {urgentTasks.length > 0 ? (
                            urgentTasks.map((t) => (
                                <div key={t.id} className="p-2.5 rounded-xl border border-gray-100 bg-white hover:border-[#FFD6C0] transition">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold text-gray-900 truncate">{t.title}</p>
                                        <Badge variant={t.priority === 'urgent' ? 'danger' : 'warning'}>
                                            {t.priority}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                                        <span>Assignee: {t.assigned_employee?.full_name || 'Unassigned'}</span>
                                        <span>Due: {t.due_date}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-400 text-center py-4">All high-priority tasks completed</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Upcoming Holidays & Recent Activity Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Holidays */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-[#202124]">Official Holidays</h2>
                        <Link href="/holidays" className="text-xs font-semibold text-[#FF5500] hover:underline">
                            Calendar
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {upcomingHolidays.map((h) => (
                            <div key={h.id} className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50/50 border border-orange-100">
                                <div>
                                    <p className="text-xs font-bold text-gray-900">{h.title}</p>
                                    <p className="text-[10px] text-gray-500">{h.start_date} to {h.end_date}</p>
                                </div>
                                <span className="text-xs font-bold text-[#FF5500]">{h.total_days} day(s)</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Audit & Activity Logs */}
                <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <History className="h-4 w-4 text-[#FF5500]" />
                            <h2 className="text-sm font-bold text-[#202124]">Recent System Audit Trail</h2>
                        </div>
                        <Link href="/audit-logs" className="text-xs font-semibold text-[#FF5500] hover:underline">
                            Full Audit Log
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentActivities.map((act) => (
                            <div key={act.id} className="py-2.5 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2.5 min-w-0 pr-4">
                                    <Badge variant={act.action === 'login' ? 'info' : act.action === 'delete' ? 'danger' : 'primary'}>
                                        {act.action.toUpperCase()}
                                    </Badge>
                                    <span className="text-gray-700 truncate">{act.description}</span>
                                </div>
                                <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                                    {act.created_at ? new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
