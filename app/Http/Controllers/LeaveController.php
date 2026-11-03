<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class LeaveController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->input('status');
        $query = LeaveRequest::with(['employee.department', 'leaveType', 'reviewer']);

        if ($status) {
            $query->where('status', $status);
        }

        $leaveRequests = $query->latest('id')->paginate(15)->withQueryString();
        $leaveTypes = LeaveType::withCount('leaveRequests')->get();
        $employees = Employee::where('status', 'active')->select('id', 'full_name', 'employee_code')->get();

        // Calculate leave balances
        $leaveBalances = $employees->map(function ($emp) use ($leaveTypes) {
            $approvedDays = LeaveRequest::where('employee_id', $emp->id)
                ->where('status', 'approved')
                ->whereYear('start_date', Carbon::now()->year)
                ->sum('total_days');

            $annualQuota = 18; // Standard annual quota
            return [
                'employee' => $emp,
                'used_days' => (float) $approvedDays,
                'remaining_days' => max(0, $annualQuota - (float) $approvedDays),
            ];
        });

        return Inertia::render('HR/Leave/Index', [
            'leaveRequests' => $leaveRequests,
            'leaveTypes' => $leaveTypes,
            'employees' => $employees,
            'leaveBalances' => $leaveBalances,
            'statusFilter' => $status,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
            'leave_type_id' => ['required', 'exists:leave_types,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['required', 'string'],
            'status' => ['required', 'in:pending,approved,rejected'],
            'admin_remarks' => ['nullable', 'string'],
            'attachment' => ['nullable', 'file', 'max:4096'],
        ]);

        $start = Carbon::parse($validated['start_date']);
        $end = Carbon::parse($validated['end_date']);
        $totalDays = $start->diffInDays($end) + 1;

        if ($request->hasFile('attachment')) {
            $validated['attachment_path'] = $request->file('attachment')->store('leave_attachments', 'public');
        }

        $validated['total_days'] = $totalDays;
        if ($validated['status'] === 'approved') {
            $validated['reviewed_by'] = auth()->id();
            $validated['reviewed_at'] = Carbon::now();
        }

        $leave = LeaveRequest::create($validated);

        // If approved immediately, automatically mark attendances as on_leave
        if ($validated['status'] === 'approved') {
            for ($d = $start->copy(); $d->lte($end); $d->addDay()) {
                if ($d->dayOfWeek !== Carbon::SATURDAY) {
                    Attendance::updateOrCreate(
                        ['employee_id' => $validated['employee_id'], 'date' => $d->format('Y-m-d')],
                        ['status' => 'on_leave', 'notes' => 'Approved leave: ' . $leave->reason]
                    );
                }
            }
        }

        AuditLog::log('create', 'leave_requests', $leave->id, "Recorded leave request for Employee ID {$leave->employee_id} ({$totalDays} days)");

        return back()->with('success', 'Leave record created successfully.');
    }

    public function updateStatus(Request $request, LeaveRequest $leaveRequest)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:approved,rejected,pending'],
            'admin_remarks' => ['nullable', 'string'],
        ]);

        $leaveRequest->update([
            'status' => $validated['status'],
            'admin_remarks' => $validated['admin_remarks'] ?? null,
            'reviewed_by' => auth()->id(),
            'reviewed_at' => Carbon::now(),
        ]);

        if ($validated['status'] === 'approved') {
            $start = Carbon::parse($leaveRequest->start_date);
            $end = Carbon::parse($leaveRequest->end_date);
            for ($d = $start->copy(); $d->lte($end); $d->addDay()) {
                if ($d->dayOfWeek !== Carbon::SATURDAY) {
                    Attendance::updateOrCreate(
                        ['employee_id' => $leaveRequest->employee_id, 'date' => $d->format('Y-m-d')],
                        ['status' => 'on_leave', 'notes' => 'Approved leave: ' . $leaveRequest->reason]
                    );
                }
            }
        }

        AuditLog::log('update', 'leave_requests', $leaveRequest->id, "Updated leave request status to: {$validated['status']}");

        return back()->with('success', "Leave request has been marked as {$validated['status']}.");
    }

    public function storeType(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'code' => ['required', 'string', 'max:10', 'unique:leave_types,code'],
            'max_days_per_year' => ['required', 'integer', 'min:1'],
            'is_paid' => ['required', 'boolean'],
            'description' => ['nullable', 'string'],
        ]);

        $type = LeaveType::create($validated);
        AuditLog::log('create', 'leave_types', $type->id, "Created leave type: {$type->name}");

        return back()->with('success', 'Leave category added.');
    }
}
