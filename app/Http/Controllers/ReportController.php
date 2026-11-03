<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Department;
use App\Models\Attendance;
use App\Models\Salary;
use App\Models\Income;
use App\Models\Expense;
use App\Models\Project;
use App\Models\Asset;
use App\Models\InventoryItem;
use App\Models\AuditLog;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/Index', [
            'metrics' => [
                'employees_count' => Employee::count(),
                'monthly_payroll' => (float) Salary::where('month', Carbon::now()->month)->where('year', Carbon::now()->year)->sum('net_salary'),
                'total_income' => (float) Income::where('status', 'completed')->sum('amount'),
                'total_expense' => (float) Expense::where('status', 'paid')->sum('amount'),
                'assets_valuation' => (float) Asset::sum('purchase_cost'),
                'inventory_valuation' => (float) InventoryItem::selectRaw('SUM(quantity * unit_price) as total')->value('total'),
            ],
        ]);
    }

    public function downloadPdf(string $type, Request $request, ReportService $reportService)
    {
        switch ($type) {
            case 'hr_directory':
                $employees = Employee::with(['department', 'designation'])->get();
                $pdf = $reportService->generateReportPdf('hr_directory', [
                    'employees' => $employees,
                ], 'landscape');
                $filename = 'GOSIKA_Employee_Directory.pdf';
                break;

            case 'attendance_summary':
                $month = (int) $request->input('month', Carbon::now()->month);
                $year = (int) $request->input('year', Carbon::now()->year);
                $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
                $endDate = $startDate->copy()->endOfMonth();

                $employees = Employee::with('department')->where('status', 'active')->get();
                $attendances = Attendance::whereBetween('date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])->get();

                $summary = [];
                foreach ($employees as $emp) {
                    $att = $attendances->where('employee_id', $emp->id);
                    $summary[] = [
                        'employee' => $emp,
                        'present' => $att->where('status', 'present')->count(),
                        'late' => $att->where('status', 'late')->count(),
                        'half_day' => $att->where('status', 'half_day')->count(),
                        'absent_leave' => $att->whereIn('status', ['absent', 'on_leave'])->count(),
                        'total_hours' => $att->sum('total_hours'),
                    ];
                }

                $pdf = $reportService->generateReportPdf('attendance_summary', [
                    'summary' => $summary,
                    'monthName' => $startDate->format('F Y'),
                ], 'landscape');
                $filename = "GOSIKA_Attendance_Report_{$year}_{$month}.pdf";
                break;

            case 'expense_audit':
                $expenses = Expense::with('category')->latest('date')->get();
                $pdf = $reportService->generateReportPdf('expense_report', [
                    'expenses' => $expenses,
                    'totalAmount' => $expenses->sum('amount'),
                    'dateRange' => 'Full Historical Log',
                    'categorySummary' => $expenses->groupBy('category.name'),
                ], 'portrait');
                $filename = 'GOSIKA_Expense_Audit_Report.pdf';
                break;

            default:
                return back()->with('error', 'Unknown report type requested.');
        }

        AuditLog::log('export', 'reports', null, "Exported PDF Report: {$type}");

        return $pdf->download($filename);
    }
}
