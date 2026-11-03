<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\EmployeeIdCard;
use App\Models\CompanySetting;
use App\Models\AuditLog;
use App\Services\IdCardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class IdCardController extends Controller
{
    public function index(Request $request, IdCardService $idCardService)
    {
        $selectedEmployeeId = $request->input('employee_id');
        $template = $request->input('template', 'corporate_modern');

        $employees = Employee::with(['department', 'designation', 'latestIdCard'])
            ->where('status', 'active')
            ->orderBy('full_name')
            ->get();

        $selectedEmployee = $selectedEmployeeId
            ? $employees->firstWhere('id', $selectedEmployeeId)
            : $employees->first();

        $qrCodeUri = $selectedEmployee ? $idCardService->generateQrCodeDataUri($selectedEmployee) : null;
        $company = CompanySetting::current();

        $idCardHistory = EmployeeIdCard::with('employee')
            ->latest('id')
            ->limit(10)
            ->get();

        return Inertia::render('HR/IdCards/Index', [
            'employees' => $employees,
            'selectedEmployee' => $selectedEmployee,
            'qrCodeUri' => $qrCodeUri,
            'currentTemplate' => $template,
            'company' => $company,
            'idCardHistory' => $idCardHistory,
        ]);
    }

    public function downloadSinglePdf(Employee $employee, Request $request, IdCardService $idCardService)
    {
        $template = $request->input('template', 'corporate_modern');
        $pdf = $idCardService->generateSinglePdf($employee, $template);

        // Track print count and history
        $idCard = EmployeeIdCard::where('employee_id', $employee->id)->latest()->first();
        if ($idCard) {
            $idCard->increment('print_count');
        }

        AuditLog::log('id_card_generate', 'employee_id_cards', $employee->id, "Downloaded CR80 PDF ID Card for {$employee->full_name}");

        return $pdf->download("ID_CARD_{$employee->employee_code}.pdf");
    }

    public function downloadBulkSheetPdf(Request $request, IdCardService $idCardService)
    {
        $template = $request->input('template', 'corporate_modern');
        $employees = Employee::with(['department', 'designation'])
            ->where('status', 'active')
            ->get();

        $pdf = $idCardService->generateA4SheetPdf($employees, $template);
        AuditLog::log('id_card_generate', 'employee_id_cards', null, "Downloaded A4 Bulk ID Card Sheet (" . $employees->count() . " cards)");

        return $pdf->download("GOSIKA_ID_Cards_A4_Sheet.pdf");
    }

    public function reissue(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'template' => ['required', 'string'],
            'reason' => ['required', 'string', 'max:255'],
        ]);

        // Revoke existing cards
        EmployeeIdCard::where('employee_id', $employee->id)->update(['status' => 'reissued']);

        $version = EmployeeIdCard::where('employee_id', $employee->id)->count() + 1;
        $cardNumber = 'GSK-IDC-' . substr($employee->employee_code, -4) . "-V{$version}";

        $newCard = EmployeeIdCard::create([
            'employee_id' => $employee->id,
            'card_number' => $cardNumber,
            'template' => $validated['template'],
            'issue_date' => Carbon::today(),
            'expiry_date' => Carbon::today()->addYears(2),
            'qr_verification_token' => $employee->qr_token,
            'print_count' => 1,
            'status' => 'active',
            'reissue_reason' => $validated['reason'],
        ]);

        AuditLog::log('id_card_generate', 'employee_id_cards', $newCard->id, "Reissued ID Card for {$employee->full_name}: {$cardNumber}");

        return back()->with('success', "Card successfully reissued: {$cardNumber}");
    }
}
