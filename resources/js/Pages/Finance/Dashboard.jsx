import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/Badge';
import {
    PieChart,
    TrendingUp,
    TrendingDown,
    Wallet,
    ArrowDownRight,
    ArrowUpRight,
    FileSpreadsheet,
    FolderTree,
    Plus,
    Calendar,
    ChevronRight,
    Download
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
    stats,
    chartData,
    categoryBreakdown,
    recentIncomes,
    recentExpenses
}) {
    const months = chartData.map((d) => d.month);
    const incomes = chartData.map((d) => d.income);
    const expenses = chartData.map((d) => d.expense);

    const data = {
        labels: months,
        datasets: [
            {
                label: 'Inflow / Income',
                data: incomes,
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                fill: true,
                tension: 0.35,
                borderWidth: 2,
            },
            {
                label: 'Operating Expenses',
                data: expenses,
                borderColor: '#FF5500',
                backgroundColor: 'rgba(255, 85, 0, 0.08)',
                fill: true,
                tension: 0.35,
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: { boxWidth: 12, boxHeight: 12, font: { size: 11, weight: '600' } },
            },
        },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: '#F3F4F6' } },
        },
    };

    return (
        <AdminLayout title="Finance Dashboard">
            <Head title="Corporate Finance" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                        Company Office Finance Division
                    </h1>
                    <p className="text-xs text-[#6B7280]">
                        Internal corporate income, operational expenses, and liquidity (Independent from e-commerce marketplace)
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/finance/statements"
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-2xs transition"
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        <span>Financial Statements</span>
                    </Link>
                    <Link
                        href="/finance/expenses"
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition"
                    >
                        <ArrowUpRight className="h-4 w-4" />
                        <span>Log Expense</span>
                    </Link>
                    <Link
                        href="/finance/income"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition"
                    >
                        <ArrowDownRight className="h-4 w-4" />
                        <span>Record Income</span>
                    </Link>
                </div>
            </div>

            {/* 4 Summary Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Income (Cumulative)</span>
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="text-xl font-black text-emerald-600 font-mono">
                        NPR {stats.all_income.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">Confirmed office receipts</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Expenses</span>
                        <TrendingDown className="h-5 w-5 text-red-500" />
                    </div>
                    <p className="text-xl font-black text-red-600 font-mono">
                        NPR {stats.all_expenses.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">Disbursed company expenditures</p>
                </div>

                <div className="bg-[#FFF0E8] p-5 rounded-2xl border border-[#FFD6C0] shadow-xs">
                    <div className="flex items-center justify-between text-[#662200] mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Available Balance</span>
                        <Wallet className="h-5 w-5 text-[#FF5500]" />
                    </div>
                    <p className="text-xl font-black text-[#FF5500] font-mono">
                        NPR {stats.current_balance.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[#8C2E00] mt-1 font-semibold">Net Liquid Office Capital</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Monthly Net Flow</span>
                        <span className={`text-xs font-bold ${stats.monthly_net >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {stats.monthly_net >= 0 ? '+ Inflow' : '- Deficit'}
                        </span>
                    </div>
                    <p className={`text-xl font-black font-mono ${stats.monthly_net >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        NPR {stats.monthly_net.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">This Month Net Cash Flow</p>
                </div>
            </div>

            {/* Trajectory Chart & Categories Budget Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-sm font-bold text-[#202124]">Corporate Cash Flow Trajectory</h2>
                            <p className="text-xs text-gray-500">Monthly revenue vs operational burn</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <Line data={data} options={options} />
                    </div>
                </div>

                {/* Expense Categories Budget Utilization */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-[#202124]">Category Budget Burn</h2>
                            <Link href="/finance/categories" className="text-xs font-semibold text-[#FF5500] hover:underline">
                                Edit Budgets
                            </Link>
                        </div>
                        <div className="space-y-3.5">
                            {categoryBreakdown.map((cat) => {
                                const burnPercent = cat.budget > 0
                                    ? Math.min(100, Math.round((cat.spent / cat.budget) * 100))
                                    : 0;

                                return (
                                    <div key={cat.id}>
                                        <div className="flex justify-between text-xs font-semibold mb-1">
                                            <span className="text-gray-800">{cat.name}</span>
                                            <span className="font-mono text-gray-500">
                                                {burnPercent}% (रू {cat.spent.toLocaleString()})
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    burnPercent > 90 ? 'bg-red-500' : burnPercent > 70 ? 'bg-amber-500' : 'bg-[#FF5500]'
                                                }`}
                                                style={{ width: `${burnPercent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
                        Budgets refresh monthly per company fiscal calendar.
                    </div>
                </div>
            </div>

            {/* Recent Income & Expense Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Incomes */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <ArrowDownRight className="h-4 w-4 text-emerald-600" />
                            <h2 className="text-sm font-bold text-[#202124]">Recent Inflow Incomes</h2>
                        </div>
                        <Link href="/finance/income" className="text-xs font-semibold text-[#FF5500] hover:underline">
                            View All
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentIncomes.map((inc) => (
                            <div key={inc.id} className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-100 flex items-center justify-between text-xs">
                                <div>
                                    <p className="font-bold text-gray-900">{inc.title}</p>
                                    <p className="text-[10px] text-gray-500">{inc.payer} &bull; {inc.category?.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono font-black text-emerald-600 text-sm">
                                        + NPR {Number(inc.amount).toLocaleString()}
                                    </p>
                                    <span className="text-[10px] text-gray-400">{inc.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Expenses */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                            <h2 className="text-sm font-bold text-[#202124]">Recent Operating Expenses</h2>
                        </div>
                        <Link href="/finance/expenses" className="text-xs font-semibold text-[#FF5500] hover:underline">
                            View All
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentExpenses.map((exp) => (
                            <div key={exp.id} className="p-3 rounded-xl bg-red-50/40 border border-red-100 flex items-center justify-between text-xs">
                                <div>
                                    <p className="font-bold text-gray-900">{exp.title}</p>
                                    <p className="text-[10px] text-gray-500">Payee: {exp.payee} &bull; {exp.category?.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono font-black text-red-600 text-sm">
                                        - NPR {Number(exp.amount).toLocaleString()}
                                    </p>
                                    <span className="text-[10px] text-gray-400">{exp.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
