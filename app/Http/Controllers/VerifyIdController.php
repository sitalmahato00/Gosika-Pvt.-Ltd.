<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\CompanySetting;
use Inertia\Inertia;

class VerifyIdController extends Controller
{
    public function verify(string $token)
    {
        $employee = Employee::with(['department', 'designation', 'latestIdCard'])
            ->where('qr_token', $token)
            ->first();

        $company = CompanySetting::current();

        return Inertia::render('Public/VerifyId', [
            'isValid' => (bool) $employee,
            'employee' => $employee ? [
                'employee_code' => $employee->employee_code,
                'full_name' => $employee->full_name,
                'department' => $employee->department->name ?? 'General',
                'designation' => $employee->designation->title ?? 'Staff',
                'joining_date' => $employee->joining_date ? $employee->joining_date->format('M d, Y') : null,
                'status' => $employee->status,
                'card_number' => $employee->latestIdCard->card_number ?? 'GSK-IDC-VALID',
                'card_status' => $employee->latestIdCard->status ?? 'active',
                'expiry_date' => $employee->latestIdCard?->expiry_date?->format('M d, Y'),
            ] : null,
            'company' => [
                'name' => $company->company_name,
                'trading_name' => $company->trading_name,
                'logo_url' => $company->logo_url,
                'phone' => $company->phone,
                'website' => $company->website,
                'address' => $company->address,
                'city' => $company->city,
                'country' => $company->country,
            ],
        ]);
    }
}
