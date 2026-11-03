<?php

namespace App\Services;

use App\Models\Salary;
use App\Models\CompanySetting;

class SalarySlipService
{
    public function __construct(private PdfDocumentService $documents)
    {
    }

    public function generateSlipPdf(Salary $salary)
    {
        $salary->load(['employee.department', 'employee.designation']);
        $company = CompanySetting::current();

        return $this->documents->render('pdf.salary_slip', [
            'salary' => $salary,
            'company' => $company,
        ], 'a4', 'landscape');
    }

    public function generateBulkPayrollPdf($salaries, string $period)
    {
        $company = CompanySetting::current();

        return $this->documents->render('pdf.bulk_payroll_slips', [
            'salaries' => $salaries,
            'company' => $company,
            'period' => $period,
        ], 'a4', 'landscape');
    }
}
