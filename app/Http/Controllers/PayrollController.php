<?php

namespace App\Http\Controllers;

use App\Models\Salary;
use App\Models\Employee;
use App\Models\CompanySetting;
use App\Models\AuditLog;
use App\Services\SalarySlipService;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PayrollController extends Controller
{
    public function index(Request $request)
    {
        $month = (int) $request->input('month', Carbon::now()->month);
        $year = (int) $request->input('year', Carbon::now()->year);

        $salaries = Salary::with(['employee.department', 'employee.designation'])
            ->where('month', $month)
            ->where('year', $year)
            ->get();

        $activeEmployees = Employee::where('status', 'active')->count();
        $totalDisbursed = $salaries->where('status', 'paid')->sum('net_salary');
        $totalGross = $salaries->sum('gross_salary');
        $totalDeductions = $salaries->sum('total_deductions');

        $company = CompanySetting::current();

        return Inertia::render('HR/Payroll/Index', [
            'month' => $month,
            'year' => $year,
            'periodName' => Carbon::createFromDate($year, $month, 1)->format('F Y'),
            'salaries' => $salaries,
            'stats' => [
                'active_employees' => $activeEmployees,
                'generated_count' => $salaries->count(),
                'total_gross' => (float) $totalGross,
                'total_deductions' => (float) $totalDeductions,
                'total_disbursed' => (float) $totalDisbursed,
            ],
            'rates' => [
                'tax_rate' => $company->default_tax_rate,
                'pf_rate' => $company->default_provident_fund_rate,
            ],
        ]);
    }

    public function generateMonthly(Request $request)
    {
        $validated = $request->validate([
            'month' => ['required', 'integer', 'between:1,12'],
            'year' => ['required', 'integer', 'min:2020'],
            'tax_rate' => ['required', 'numeric', 'min:0', 'max:50'],
            'pf_rate' => ['required', 'numeric', 'min:0', 'max:50'],
            'allowance_percentage' => ['required', 'numeric', 'min:0', 'max:100'],
        ]);

        $month = $validated['month'];
        $year = $validated['year'];
        $periodName = Carbon::createFromDate($year, $month, 1)->format('F Y');

        $employees = Employee::where('status', 'active')
            ->whereNotNull('basic_salary')
            ->get();
        $generatedCount = 0;

        DB::transaction(function () use ($employees, $month, $year, $periodName, $validated, &$generatedCount) {
            foreach ($employees as $emp) {
                $basic = $emp->basic_salary;
                $allowance = round($basic * ($validated['allowance_percentage'] / 100), 2);
                $bonus = 0.00;
                $gross = $basic + $allowance + $bonus;

                $tax = round($gross * ($validated['tax_rate'] / 100), 2);
                $pf = round($basic * ($validated['pf_rate'] / 100), 2);
                $totalDeductions = $tax + $pf;
                $net = $gross - $totalDeductions;

                $slipNumber = 'GSK-SLP-' . sprintf('%04d-%02d', $year, $month) . '-' . substr($emp->employee_code, -4);

                Salary::updateOrCreate(
                    ['employee_id' => $emp->id, 'month' => $month, 'year' => $year],
                    [
                        'salary_period' => $periodName,
                        'slip_number' => $slipNumber,
                        'basic_salary' => $basic,
                        'allowances' => $allowance,
                        'bonuses' => $bonus,
                        'gross_salary' => $gross,
                        'tax_deduction' => $tax,
                        'provident_fund' => $pf,
                        'other_deductions' => 0.00,
                        'total_deductions' => $totalDeductions,
                        'net_salary' => $net,
                        'payment_date' => Carbon::createFromDate($year, $month, 1)->endOfMonth()->format('Y-m-d'),
                        'payment_method' => 'bank_transfer',
                        'payment_reference' => 'ACH-' . rand(100000, 999999),
                        'status' => 'paid',
                        'generated_by' => auth()->id(),
                    ]
                );

                $generatedCount++;
            }
        });

        AuditLog::log('create', 'payroll', null, "Batch generated payroll for {$periodName} ({$generatedCount} employees)");

        return back()->with('success', "Payroll generated successfully for {$generatedCount} employees.");
    }

    public function downloadSlipPdf(Salary $salary, SalarySlipService $salarySlipService)
    {
        $pdf = $salarySlipService->generateSlipPdf($salary);
        AuditLog::log('export', 'payroll', $salary->id, "Downloaded PDF salary slip: {$salary->slip_number}");

        return $pdf->download("{$salary->slip_number}.pdf");
    }

    public function downloadBulkPdf(Request $request, SalarySlipService $salarySlipService)
    {
        $month = (int) $request->input('month', Carbon::now()->month);
        $year = (int) $request->input('year', Carbon::now()->year);
        $period = Carbon::createFromDate($year, $month, 1)->format('F Y');

        $salaries = Salary::with(['employee.department', 'employee.designation'])
            ->where('month', $month)
            ->where('year', $year)
            ->get();

        if ($salaries->isEmpty()) {
            return back()->with('error', 'No payroll records found for the selected period.');
        }

        $pdf = $salarySlipService->generateBulkPayrollPdf($salaries, $period);
        AuditLog::log('export', 'payroll', null, "Downloaded bulk salary slips PDF for {$period}");

        return $pdf->download("GOSIKA_Payroll_Slips_{$year}_{$month}.pdf");
    }

    public function exportCsv(Request $request, ReportService $reportService)
    {
        $month = (int) $request->input('month', Carbon::now()->month);
        $year = (int) $request->input('year', Carbon::now()->year);

        $salaries = Salary::with(['employee.department', 'employee.designation'])
            ->where('month', $month)
            ->where('year', $year)
            ->get();

        $headers = ['Slip Number', 'Employee Code', 'Employee Name', 'Department', 'Bank Account', 'Basic Salary (NPR)', 'Allowances', 'Gross Salary', 'Tax TDS', 'Provident Fund', 'Total Deductions', 'Net Salary Payable', 'Status'];
        $rows = [];

        foreach ($salaries as $sal) {
            $rows[] = [
                $sal->slip_number,
                $sal->employee->employee_code,
                $sal->employee->full_name,
                $sal->employee->department->name ?? 'General',
                $sal->employee->bank_account_no ?? 'N/A',
                number_format($sal->basic_salary, 2),
                number_format($sal->allowances, 2),
                number_format($sal->gross_salary, 2),
                number_format($sal->tax_deduction, 2),
                number_format($sal->provident_fund, 2),
                number_format($sal->total_deductions, 2),
                number_format($sal->net_salary, 2),
                strtoupper($sal->status),
            ];
        }

        AuditLog::log('export', 'payroll', null, "Exported payroll ledger to CSV for {$year}-{$month}");

        return $reportService->generateCsvResponse("gosika_payroll_{$year}_{$month}.csv", $headers, $rows);
    }
}
