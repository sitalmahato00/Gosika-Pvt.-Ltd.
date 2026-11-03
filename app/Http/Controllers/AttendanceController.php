<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Department;
use App\Models\AuditLog;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $selectedDate = $request->input('date', Carbon::today()->format('Y-m-d'));
        $departmentId = $request->input('department_id');

        $employeesQuery = Employee::with(['department', 'designation'])
            ->where('status', 'active');

        if ($departmentId) {
            $employeesQuery->where('department_id', $departmentId);
        }

        $employees = $employeesQuery->orderBy('full_name')->get();

        // Get attendances for selected date
        $attendances = Attendance::where('date', $selectedDate)
            ->get()
            ->keyBy('employee_id');

        // Stats for selected date
        $totalActive = $employees->count();
        $present = $attendances->whereIn('status', ['present', 'late', 'half_day'])->count();
        $late = $attendances->where('status', 'late')->count();
        $halfDay = $attendances->where('status', 'half_day')->count();
        $absent = $attendances->where('status', 'absent')->count();
        $onLeave = $attendances->where('status', 'on_leave')->count();

        $departments = Department::select('id', 'name')->get();

        return Inertia::render('HR/Attendance/Index', [
            'selectedDate' => $selectedDate,
            'departmentId' => $departmentId,
            'employees' => $employees,
            'attendances' => $attendances,
            'departments' => $departments,
            'stats' => [
                'total' => $totalActive,
                'present' => $present,
                'late' => $late,
                'half_day' => $halfDay,
                'absent' => $absent,
                'on_leave' => $onLeave,
            ],
        ]);
    }

    public function markSingle(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
            'date' => ['required', 'date'],
            'status' => ['required', 'in:present,absent,late,half_day,holiday,on_leave'],
            'clock_in' => ['nullable', 'string'],
            'clock_out' => ['nullable', 'string'],
            'total_hours' => ['nullable', 'numeric'],
            'notes' => ['nullable', 'string'],
        ]);

        $attendance = Attendance::updateOrCreate(
            ['employee_id' => $validated['employee_id'], 'date' => $validated['date']],
            [
                'status' => $validated['status'],
                'clock_in' => $validated['clock_in'] ?? null,
                'clock_out' => $validated['clock_out'] ?? null,
                'total_hours' => $validated['total_hours'] ?? 8.0,
                'notes' => $validated['notes'] ?? null,
                'is_corrected' => true,
                'corrected_by' => auth()->id(),
            ]
        );

        AuditLog::log('update', 'attendance', $attendance->id, "Updated attendance for Employee ID {$attendance->employee_id} on {$attendance->date}");

        return back()->with('success', 'Attendance recorded successfully.');
    }

    public function markBatch(Request $request)
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'records' => ['required', 'array'],
            'records.*.employee_id' => ['required', 'exists:employees,id'],
            'records.*.status' => ['required', 'in:present,absent,late,half_day,holiday,on_leave'],
            'records.*.clock_in' => ['nullable', 'string'],
            'records.*.clock_out' => ['nullable', 'string'],
            'records.*.total_hours' => ['nullable', 'numeric'],
            'records.*.notes' => ['nullable', 'string'],
        ]);

        foreach ($validated['records'] as $rec) {
            Attendance::updateOrCreate(
                ['employee_id' => $rec['employee_id'], 'date' => $validated['date']],
                [
                    'status' => $rec['status'],
                    'clock_in' => $rec['clock_in'] ?? ($rec['status'] === 'present' ? '09:00:00' : null),
                    'clock_out' => $rec['clock_out'] ?? ($rec['status'] === 'present' ? '17:30:00' : null),
                    'total_hours' => $rec['total_hours'] ?? ($rec['status'] === 'present' ? 8.5 : 0),
                    'notes' => $rec['notes'] ?? null,
                ]
            );
        }

        AuditLog::log('create', 'attendance', null, "Batch marked attendance for " . count($validated['records']) . " employees on {$validated['date']}");

        return back()->with('success', 'Batch attendance saved successfully.');
    }

    public function calendar(Request $request)
    {
        $validated = $request->validate([
            'month' => ['nullable', 'integer', 'between:1,12'],
            'year' => ['nullable', 'integer', 'between:2000,2100'],
        ]);
        $month = (int) ($validated['month'] ?? Carbon::now()->month);
        $year = (int) ($validated['year'] ?? Carbon::now()->year);

        $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        $attendances = Attendance::whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->get(['date', 'status']);

        $daySummaries = [];
        foreach ($attendances as $attendance) {
            $date = $attendance->date->toDateString();
            $daySummaries[$date] ??= [
                'records' => 0,
                'present' => 0,
                'late' => 0,
                'half_day' => 0,
                'absent' => 0,
                'on_leave' => 0,
                'holiday' => 0,
            ];
            $daySummaries[$date]['records']++;
            $daySummaries[$date][$attendance->status]++;
        }

        return Inertia::render('HR/Attendance/Calendar', [
            'month' => $month,
            'year' => $year,
            'monthName' => $startDate->format('F Y'),
            'daySummaries' => $daySummaries,
            'daysInMonth' => $startDate->daysInMonth,
            'leadingDays' => $startDate->dayOfWeek,
        ]);
    }

    public function history(Request $request)
    {
        $validated = $request->validate([
            'date' => ['required', 'date_format:Y-m-d'],
        ]);
        $date = $validated['date'];
        $selectedDate = Carbon::createFromFormat('Y-m-d', $date);
        $attendances = Attendance::with(['employee.department', 'correctedByUser:id,name'])
            ->whereDate('date', $date)
            ->join('employees', 'attendances.employee_id', '=', 'employees.id')
            ->orderBy('employees.full_name')
            ->select('attendances.*')
            ->get();

        return Inertia::render('HR/Attendance/History', [
            'selectedDate' => $date,
            'dateLabel' => $selectedDate->format('l, F j, Y'),
            'attendances' => $attendances,
            'stats' => [
                'records' => $attendances->count(),
                'present' => $attendances->where('status', 'present')->count(),
                'late' => $attendances->where('status', 'late')->count(),
                'half_day' => $attendances->where('status', 'half_day')->count(),
                'absent' => $attendances->where('status', 'absent')->count(),
                'on_leave' => $attendances->where('status', 'on_leave')->count(),
                'holiday' => $attendances->where('status', 'holiday')->count(),
            ],
        ]);
    }

    public function update(Request $request, Attendance $attendance)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:present,absent,late,half_day,holiday,on_leave'],
            'clock_in' => ['nullable', 'date_format:H:i'],
            'clock_out' => ['nullable', 'date_format:H:i'],
            'total_hours' => ['required', 'numeric', 'min:0', 'max:24'],
            'notes' => ['nullable', 'string'],
        ]);

        $attendance->update([
            ...$validated,
            'is_corrected' => true,
            'corrected_by' => auth()->id(),
        ]);

        AuditLog::log(
            'update',
            'attendance',
            $attendance->id,
            "Corrected attendance for Employee ID {$attendance->employee_id} on {$attendance->date->toDateString()}"
        );

        return back()->with('success', 'Attendance history updated successfully.');
    }

    public function exportCsv(Request $request, ReportService $reportService)
    {
        $month = (int) $request->input('month', Carbon::now()->month);
        $year = (int) $request->input('year', Carbon::now()->year);
        $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        $employees = Employee::with('department')->where('status', 'active')->get();
        $attendances = Attendance::whereBetween('date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])->get();

        $headers = ['Employee Code', 'Full Name', 'Department', 'Present Days', 'Late Days', 'Half Days', 'Absent/Leave', 'Total Hours'];
        $rows = [];

        foreach ($employees as $emp) {
            $empAtt = $attendances->where('employee_id', $emp->id);
            $present = $empAtt->where('status', 'present')->count();
            $late = $empAtt->where('status', 'late')->count();
            $half = $empAtt->where('status', 'half_day')->count();
            $absent = $empAtt->whereIn('status', ['absent', 'on_leave'])->count();
            $hours = $empAtt->sum('total_hours');

            $rows[] = [
                $emp->employee_code,
                $emp->full_name,
                $emp->department->name ?? 'General',
                $present,
                $late,
                $half,
                $absent,
                number_format($hours, 1),
            ];
        }

        AuditLog::log('export', 'attendance', null, "Exported monthly attendance summary for {$startDate->format('F Y')}");

        return $reportService->generateCsvResponse("gosika_attendance_{$year}_{$month}.csv", $headers, $rows);
    }
}
