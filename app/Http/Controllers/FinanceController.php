<?php

namespace App\Http\Controllers;

use App\Models\Income;
use App\Models\Expense;
use App\Models\IncomeCategory;
use App\Models\ExpenseCategory;
use App\Models\CompanySetting;
use App\Models\AuditLog;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class FinanceController extends Controller
{
    public function dashboard(Request $request)
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        $allIncome = (float) Income::where('status', 'completed')->sum('amount');
        $allExpenses = (float) Expense::where('status', 'paid')->sum('amount');
        $currentBalance = $allIncome - $allExpenses;

        $monthlyIncome = (float) Income::whereBetween('date', [$startOfMonth, $endOfMonth])
            ->where('status', 'completed')
            ->sum('amount');

        $monthlyExpenses = (float) Expense::whereBetween('date', [$startOfMonth, $endOfMonth])
            ->where('status', 'paid')
            ->sum('amount');

        // Monthly cashflow trend (last 6 months)
        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $mStart = $month->copy()->startOfMonth();
            $mEnd = $month->copy()->endOfMonth();

            $inc = (float) Income::whereBetween('date', [$mStart, $mEnd])->where('status', 'completed')->sum('amount');
            $exp = (float) Expense::whereBetween('date', [$mStart, $mEnd])->where('status', 'paid')->sum('amount');

            $chartData[] = [
                'month' => $month->format('M Y'),
                'income' => $inc,
                'expense' => $exp,
                'net' => $inc - $exp,
            ];
        }

        // Category breakdown
        $expenseCategoryBreakdown = ExpenseCategory::withSum('expenses', 'amount')
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'budget' => (float) $c->monthly_budget,
                'spent' => (float) ($c->expenses_sum_amount ?? 0),
            ]);

        // Recent transactions
        $recentIncomes = Income::with('category')->latest('date')->limit(4)->get();
        $recentExpenses = Expense::with('category')->latest('date')->limit(4)->get();

        return Inertia::render('Finance/Dashboard', [
            'stats' => [
                'all_income' => $allIncome,
                'all_expenses' => $allExpenses,
                'current_balance' => $currentBalance,
                'monthly_income' => $monthlyIncome,
                'monthly_expenses' => $monthlyExpenses,
                'monthly_net' => $monthlyIncome - $monthlyExpenses,
            ],
            'chartData' => $chartData,
            'categoryBreakdown' => $expenseCategoryBreakdown,
            'recentIncomes' => $recentIncomes,
            'recentExpenses' => $recentExpenses,
        ]);
    }

    public function incomeIndex(Request $request)
    {
        $query = Income::with(['category', 'creator']);

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%{$s}%")
                  ->orWhere('income_number', 'like', "%{$s}%")
                  ->orWhere('payer', 'like', "%{$s}%");
            });
        }

        $incomes = $query->latest('date')->paginate(12)->withQueryString();
        $categories = IncomeCategory::all();

        return Inertia::render('Finance/Income/Index', [
            'incomes' => $incomes,
            'categories' => $categories,
            'filters' => $request->only(['category_id', 'search']),
        ]);
    }

    public function storeIncome(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:income_categories,id'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'date' => ['required', 'date'],
            'payment_method' => ['required', 'string'],
            'payer' => ['required', 'string', 'max:255'],
            'reference_no' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'receipt' => ['nullable', 'file', 'max:4096'],
        ]);

        $lastId = Income::max('id') ?? 0;
        $validated['income_number'] = 'GSK-INC-' . date('Y') . '-' . str_pad($lastId + 1, 4, '0', STR_PAD_LEFT);
        $validated['status'] = 'completed';
        $validated['created_by'] = auth()->id();

        if ($request->hasFile('receipt')) {
            $validated['receipt_path'] = $request->file('receipt')->store('finance/income_receipts', 'public');
        }

        $income = Income::create($validated);
        AuditLog::log('create', 'incomes', $income->id, "Recorded corporate income: {$income->title} (NPR {$income->amount})");

        return back()->with('success', 'Income transaction recorded successfully.');
    }

    public function expenseIndex(Request $request)
    {
        $query = Expense::with(['category', 'approver']);

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%{$s}%")
                  ->orWhere('expense_number', 'like', "%{$s}%")
                  ->orWhere('payee', 'like', "%{$s}%");
            });
        }
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        $expenses = $query->latest('date')->paginate(12)->withQueryString();
        $categories = ExpenseCategory::all();

        return Inertia::render('Finance/Expenses/Index', [
            'expenses' => $expenses,
            'categories' => $categories,
            'filters' => $request->only(['category_id', 'search', 'start_date', 'end_date']),
        ]);
    }

    public function storeExpense(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:expense_categories,id'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'date' => ['required', 'date'],
            'payee' => ['required', 'string', 'max:255'],
            'payment_method' => ['required', 'string'],
            'payment_reference' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'receipt' => ['nullable', 'file', 'max:4096'],
        ]);

        $lastId = Expense::max('id') ?? 0;
        $validated['expense_number'] = 'GSK-EXP-' . date('Y') . '-' . str_pad($lastId + 1, 4, '0', STR_PAD_LEFT);
        $validated['status'] = 'paid';
        $validated['approved_by'] = auth()->id();

        if ($request->hasFile('receipt')) {
            $validated['receipt_path'] = $request->file('receipt')->store('finance/expense_receipts', 'public');
        }

        $expense = Expense::create($validated);
        AuditLog::log('create', 'expenses', $expense->id, "Recorded corporate expense: {$expense->title} (NPR {$expense->amount})");

        return back()->with('success', 'Expense transaction logged successfully.');
    }

    public function downloadExpenseReportPdf(Request $request, ReportService $reportService)
    {
        $query = Expense::with('category');
        $dateRangeText = 'All Historical Dates';

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
            $dateRangeText = "{$request->start_date} to {$request->end_date}";
        }
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $expenses = $query->latest('date')->get();
        $totalAmount = $expenses->sum('amount');
        $categorySummary = $expenses->groupBy('category.name');

        $pdf = $reportService->generateReportPdf('expense_report', [
            'expenses' => $expenses,
            'totalAmount' => $totalAmount,
            'dateRange' => $dateRangeText,
            'categorySummary' => $categorySummary,
        ], 'portrait');

        AuditLog::log('export', 'expenses', null, "Exported Expense Audit Report PDF ({$dateRangeText})");

        return $pdf->download('GOSIKA_Expense_Audit_Report.pdf');
    }

    public function statements(Request $request)
    {
        $period = $request->input('period', 'monthly'); // monthly, quarterly, yearly
        $now = Carbon::now();

        if ($period === 'quarterly') {
            $startDate = $now->copy()->firstOfQuarter();
            $endDate = $now->copy()->lastOfQuarter();
            $periodLabel = "Quarter {$now->quarter} - " . $now->year;
        } elseif ($period === 'yearly') {
            $startDate = $now->copy()->startOfYear();
            $endDate = $now->copy()->endOfYear();
            $periodLabel = "Year " . $now->year;
        } else {
            $startDate = $now->copy()->startOfMonth();
            $endDate = $now->copy()->endOfMonth();
            $periodLabel = $now->format('F Y');
        }

        $incomes = Income::with('category')->whereBetween('date', [$startDate, $endDate])->get();
        $expenses = Expense::with('category')->whereBetween('date', [$startDate, $endDate])->get();

        $totalIncome = $incomes->sum('amount');
        $totalExpense = $expenses->sum('amount');
        $netCashFlow = $totalIncome - $totalExpense;

        $incomeCategories = IncomeCategory::withCount(['incomes' => fn($q) => $q->whereBetween('date', [$startDate, $endDate])])
            ->withSum(['incomes' => fn($q) => $q->whereBetween('date', [$startDate, $endDate])], 'amount')
            ->get();

        $expenseCategories = ExpenseCategory::withCount(['expenses' => fn($q) => $q->whereBetween('date', [$startDate, $endDate])])
            ->withSum(['expenses' => fn($q) => $q->whereBetween('date', [$startDate, $endDate])], 'amount')
            ->get();

        return Inertia::render('Finance/Statements', [
            'period' => $period,
            'periodLabel' => $periodLabel,
            'totalIncome' => (float) $totalIncome,
            'totalExpense' => (float) $totalExpense,
            'netCashFlow' => (float) $netCashFlow,
            'incomeCategories' => $incomeCategories,
            'expenseCategories' => $expenseCategories,
            'recentIncomes' => $incomes->take(6),
            'recentExpenses' => $expenses->take(6),
        ]);
    }

    public function downloadStatementPdf(Request $request, ReportService $reportService)
    {
        $period = $request->input('period', 'monthly');
        $now = Carbon::now();

        if ($period === 'quarterly') {
            $startDate = $now->copy()->firstOfQuarter();
            $endDate = $now->copy()->lastOfQuarter();
            $periodLabel = "Quarter {$now->quarter} - " . $now->year;
        } elseif ($period === 'yearly') {
            $startDate = $now->copy()->startOfYear();
            $endDate = $now->copy()->endOfYear();
            $periodLabel = "Year " . $now->year;
        } else {
            $startDate = $now->copy()->startOfMonth();
            $endDate = $now->copy()->endOfMonth();
            $periodLabel = $now->format('F Y');
        }

        $incomes = Income::with('category')->whereBetween('date', [$startDate, $endDate])->get();
        $expenses = Expense::with('category')->whereBetween('date', [$startDate, $endDate])->get();
        $totalIncome = $incomes->sum('amount');
        $totalExpense = $expenses->sum('amount');
        $transactions = $incomes->map(fn (Income $income) => [
            'type' => 'income',
            'ref' => $income->income_number,
            'date' => $income->date?->format('Y-m-d'),
            'title' => $income->title,
            'category' => $income->category->name ?? 'General',
            'amount' => $income->amount,
        ])->concat($expenses->map(fn (Expense $expense) => [
            'type' => 'expense',
            'ref' => $expense->expense_number,
            'date' => $expense->date?->format('Y-m-d'),
            'title' => $expense->title,
            'category' => $expense->category->name ?? 'General',
            'amount' => $expense->amount,
        ]))->sortBy('date')->values();

        $incomeCategories = IncomeCategory::withCount(['incomes' => fn($q) => $q->whereBetween('date', [$startDate, $endDate])])
            ->withSum(['incomes' => fn($q) => $q->whereBetween('date', [$startDate, $endDate])], 'amount')
            ->get();

        $expenseCategories = ExpenseCategory::withCount(['expenses' => fn($q) => $q->whereBetween('date', [$startDate, $endDate])])
            ->withSum(['expenses' => fn($q) => $q->whereBetween('date', [$startDate, $endDate])], 'amount')
            ->get();

        $pdf = $reportService->generateReportPdf('financial_statement', [
            'periodName' => $periodLabel,
            'totalIncome' => $totalIncome,
            'totalExpense' => $totalExpense,
            'transactions' => $transactions,
            'incomeCategories' => $incomeCategories,
            'expenseCategories' => $expenseCategories,
        ], 'portrait');

        AuditLog::log('export', 'finance', null, "Exported Financial Statement PDF ({$periodLabel})");

        return $pdf->download("GOSIKA_Financial_Statement_{$period}.pdf");
    }

    public function categories()
    {
        $incomeCategories = IncomeCategory::withCount('incomes')->get();
        $expenseCategories = ExpenseCategory::withCount('expenses')->get();

        return Inertia::render('Finance/Categories', [
            'incomeCategories' => $incomeCategories,
            'expenseCategories' => $expenseCategories,
        ]);
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'type' => ['required', 'in:income,expense'],
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:10'],
            'monthly_budget' => ['nullable', 'numeric'],
            'description' => ['nullable', 'string'],
        ]);

        if ($validated['type'] === 'income') {
            IncomeCategory::create([
                'name' => $validated['name'],
                'code' => $validated['code'],
                'description' => $validated['description'] ?? null,
            ]);
        } else {
            ExpenseCategory::create([
                'name' => $validated['name'],
                'code' => $validated['code'],
                'monthly_budget' => $validated['monthly_budget'] ?? 0,
                'description' => $validated['description'] ?? null,
            ]);
        }

        AuditLog::log('create', 'finance_categories', null, "Created {$validated['type']} category: {$validated['name']}");

        return back()->with('success', 'Category created successfully.');
    }
}
