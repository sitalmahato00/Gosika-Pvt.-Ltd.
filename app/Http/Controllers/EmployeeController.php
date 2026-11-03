<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Department;
use App\Models\Designation;
use App\Models\EmployeeIdCard;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\Salary;
use App\Models\Document;
use App\Models\AuditLog;
use App\Services\ReportService;
use App\Services\IdCardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Carbon\Carbon;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with(['department', 'designation', 'latestIdCard']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('employee_code', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('employment_type')) {
            $query->where('employment_type', $request->employment_type);
        }

        $employees = $query->latest('id')->paginate(12)->withQueryString();
        $departments = Department::select('id', 'name')->get();

        return Inertia::render('HR/Employees/Index', [
            'employees' => $employees,
            'departments' => $departments,
            'filters' => $request->only(['search', 'department_id', 'status', 'employment_type']),
        ]);
    }

    public function create()
    {
        $departments = Department::with('designations')->get();
        return Inertia::render('HR/Employees/Create', [
            'departments' => $departments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', 'unique:employees,email'],
            'phone' => ['required', 'string', 'max:20'],
            'gender' => ['required', 'string', 'in:male,female,other'],
            'date_of_birth' => ['nullable', 'date'],
            'marital_status' => ['nullable', 'string', 'max:50'],
            'blood_group' => ['nullable', 'string', 'max:10'],
            'permanent_address' => ['nullable', 'string'],
            'current_address' => ['nullable', 'string'],
            'department_id' => ['required', 'exists:departments,id'],
            'designation_id' => ['required', 'exists:designations,id'],
            'employment_type' => ['required', 'string', 'in:full_time,part_time,contract,intern'],
            'joining_date' => ['required', 'date'],
            'basic_salary' => ['nullable', 'numeric', 'min:0'],
            'bank_name' => ['nullable', 'string', 'max:100'],
            'bank_account_no' => ['nullable', 'string', 'max:50'],
            'bank_branch' => ['nullable', 'string', 'max:100'],
            'emergency_contact_name' => ['nullable', 'string', 'max:100'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:20'],
            'emergency_contact_relation' => ['nullable', 'string', 'max:50'],
            'status' => ['required', 'string', 'in:active,on_leave,resigned,terminated'],
            'notes' => ['nullable', 'string'],
            'photo' => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo_path'] = $request->file('photo')->store('employees/photos', 'public');
        }

        $validated['full_name'] = trim($validated['first_name'] . ' ' . $validated['last_name']);
        $validated['qr_token'] = Str::random(32);

        $employee = Employee::create($validated);

        // Automatically create initial CR80 ID Card
        EmployeeIdCard::create([
            'employee_id' => $employee->id,
            'card_number' => 'GSK-IDC-' . substr($employee->employee_code, -4) . '-V1',
            'template' => 'corporate_modern',
            'issue_date' => $employee->joining_date,
            'expiry_date' => Carbon::parse($employee->joining_date)->addYears(2),
            'qr_verification_token' => $employee->qr_token,
            'print_count' => 1,
            'status' => 'active',
        ]);

        AuditLog::log('create', 'employees', $employee->id, "Registered new employee: {$employee->full_name} ({$employee->employee_code})");

        return redirect()->route('employees.show', $employee->id)->with('success', 'Employee registered successfully with generated CR80 ID Card.');
    }

    public function show(Employee $employee, Request $request, IdCardService $idCardService)
    {
        $employee->load(['department', 'designation', 'latestIdCard']);

        // Load profile tabs data
        $attendances = Attendance::where('employee_id', $employee->id)->latest('date')->limit(30)->get();
        $leaves = LeaveRequest::with('leaveType')->where('employee_id', $employee->id)->latest('start_date')->get();
        $salaries = Salary::where('employee_id', $employee->id)->latest('year')->latest('month')->get();
        $documents = Document::where('employee_id', $employee->id)->latest()->get();
        $idCards = EmployeeIdCard::where('employee_id', $employee->id)->latest()->get();
        $auditLogs = AuditLog::where('module', 'employees')->where('record_id', $employee->id)->latest()->get();

        $qrCodeUri = $idCardService->generateQrCodeDataUri($employee);

        return Inertia::render('HR/Employees/Show', [
            'employee' => $employee,
            'attendances' => $attendances,
            'leaves' => $leaves,
            'salaries' => $salaries,
            'documents' => $documents,
            'idCards' => $idCards,
            'auditLogs' => $auditLogs,
            'qrCodeUri' => $qrCodeUri,
            'tab' => $request->query('tab', 'personal'),
        ]);
    }

    public function edit(Employee $employee)
    {
        $departments = Department::with('designations')->get();
        return Inertia::render('HR/Employees/Edit', [
            'employee' => $employee,
            'departments' => $departments,
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', 'unique:employees,email,' . $employee->id],
            'phone' => ['required', 'string', 'max:20'],
            'gender' => ['required', 'string', 'in:male,female,other'],
            'date_of_birth' => ['nullable', 'date'],
            'marital_status' => ['nullable', 'string', 'max:50'],
            'blood_group' => ['nullable', 'string', 'max:10'],
            'permanent_address' => ['nullable', 'string'],
            'current_address' => ['nullable', 'string'],
            'department_id' => ['required', 'exists:departments,id'],
            'designation_id' => ['required', 'exists:designations,id'],
            'employment_type' => ['required', 'string', 'in:full_time,part_time,contract,intern'],
            'joining_date' => ['required', 'date'],
            'exit_date' => ['nullable', 'date'],
            'exit_reason' => ['nullable', 'string'],
            'basic_salary' => ['nullable', 'numeric', 'min:0'],
            'bank_name' => ['nullable', 'string', 'max:100'],
            'bank_account_no' => ['nullable', 'string', 'max:50'],
            'bank_branch' => ['nullable', 'string', 'max:100'],
            'emergency_contact_name' => ['nullable', 'string', 'max:100'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:20'],
            'emergency_contact_relation' => ['nullable', 'string', 'max:50'],
            'status' => ['required', 'string', 'in:active,on_leave,resigned,terminated'],
            'notes' => ['nullable', 'string'],
            'photo' => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('photo')) {
            if ($employee->photo_path) {
                Storage::disk('public')->delete($employee->photo_path);
            }
            $validated['photo_path'] = $request->file('photo')->store('employees/photos', 'public');
        }

        $validated['full_name'] = trim($validated['first_name'] . ' ' . $validated['last_name']);
        $employee->update($validated);

        AuditLog::log('update', 'employees', $employee->id, "Updated details for: {$employee->full_name}");

        return redirect()->route('employees.show', $employee->id)->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee)
    {
        $name = $employee->full_name;
        $code = $employee->employee_code;
        $employee->delete();

        AuditLog::log('delete', 'employees', $employee->id, "Deactivated/Soft-deleted employee: {$name} ({$code})");

        return redirect()->route('employees.index')->with('success', "Employee {$name} has been archived.");
    }

    public function exportCsv(Request $request, ReportService $reportService)
    {
        $employees = Employee::with(['department', 'designation'])->get();

        $headers = ['Employee Code', 'Full Name', 'Department', 'Designation', 'Email', 'Phone', 'Employment Type', 'Joining Date', 'Basic Salary (NPR)', 'Status'];
        $rows = [];

        foreach ($employees as $emp) {
            $rows[] = [
                $emp->employee_code,
                $emp->full_name,
                $emp->department->name ?? 'N/A',
                $emp->designation->title ?? 'N/A',
                $emp->email,
                $emp->phone,
                strtoupper(str_replace('_', ' ', $emp->employment_type)),
                $emp->joining_date ? $emp->joining_date->format('Y-m-d') : 'N/A',
                $emp->basic_salary === null ? 'N/A' : number_format((float) $emp->basic_salary, 2),
                strtoupper($emp->status),
            ];
        }

        AuditLog::log('export', 'employees', null, 'Exported employee directory to CSV');

        return $reportService->generateCsvResponse('gosika_employees_' . date('Y_m_d') . '.csv', $headers, $rows);
    }
}
