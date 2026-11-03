<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingParticipant;
use App\Models\Employee;
use App\Models\Holiday;
use App\Models\LeaveRequest;
use App\Models\Project;
use App\Models\Task;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class MeetingController extends Controller
{
    public function index(Request $request)
    {
        $meetings = Meeting::with(['participants.employee.department', 'creator'])
            ->latest('meeting_date')
            ->paginate(10);

        $employees = Employee::where('status', 'active')->select('id', 'full_name', 'employee_code')->get();

        return Inertia::render('Operations/Meetings/Index', [
            'meetings' => $meetings,
            'employees' => $employees,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'meeting_date' => ['required', 'date'],
            'start_time' => ['required'],
            'end_time' => ['nullable'],
            'location_or_link' => ['required', 'string', 'max:255'],
            'agenda' => ['nullable', 'string'],
            'status' => ['required', 'in:scheduled,in_progress,completed,cancelled'],
            'participant_ids' => ['nullable', 'array'],
            'participant_ids.*' => ['exists:employees,id'],
        ]);

        $validated['created_by'] = auth()->id();
        $meeting = Meeting::create($validated);

        if (!empty($validated['participant_ids'])) {
            foreach ($validated['participant_ids'] as $empId) {
                MeetingParticipant::create([
                    'meeting_id' => $meeting->id,
                    'employee_id' => $empId,
                    'status' => 'invited',
                ]);
            }
        }

        AuditLog::log('create', 'meetings', $meeting->id, "Scheduled meeting: {$meeting->title} on {$meeting->meeting_date}");

        return back()->with('success', 'Meeting scheduled successfully.');
    }

    public function update(Request $request, Meeting $meeting)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'meeting_date' => ['required', 'date'],
            'start_time' => ['required'],
            'end_time' => ['nullable'],
            'location_or_link' => ['required', 'string', 'max:255'],
            'agenda' => ['nullable', 'string'],
            'minutes_of_meeting' => ['nullable', 'string'],
            'status' => ['required', 'in:scheduled,in_progress,completed,cancelled'],
        ]);

        $meeting->update($validated);
        AuditLog::log('update', 'meetings', $meeting->id, "Updated meeting: {$meeting->title}");

        return back()->with('success', 'Meeting updated.');
    }

    public function masterCalendar(Request $request)
    {
        $month = (int) $request->input('month', Carbon::now()->month);
        $year = (int) $request->input('year', Carbon::now()->year);

        $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        // 1. Meetings
        $meetings = Meeting::whereBetween('meeting_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->get()
            ->map(fn($m) => [
                'id' => 'm_' . $m->id,
                'type' => 'meeting',
                'title' => $m->title,
                'date' => $m->meeting_date->format('Y-m-d'),
                'time' => $m->start_time,
                'location' => $m->location_or_link,
            ]);

        // 2. Holidays
        $holidays = Holiday::where('start_date', '<=', $endDate->format('Y-m-d'))
            ->where('end_date', '>=', $startDate->format('Y-m-d'))
            ->get()
            ->map(fn($h) => [
                'id' => 'h_' . $h->id,
                'type' => 'holiday',
                'title' => $h->title,
                'date' => $h->start_date->format('Y-m-d'),
                'endDate' => $h->end_date->format('Y-m-d'),
            ]);

        // 3. Leaves
        $leaves = LeaveRequest::with('employee')
            ->where('status', 'approved')
            ->where('start_date', '<=', $endDate->format('Y-m-d'))
            ->where('end_date', '>=', $startDate->format('Y-m-d'))
            ->get()
            ->map(fn($l) => [
                'id' => 'l_' . $l->id,
                'type' => 'leave',
                'title' => ($l->employee->full_name ?? 'Staff') . ' (On Leave)',
                'date' => $l->start_date->format('Y-m-d'),
                'endDate' => $l->end_date->format('Y-m-d'),
            ]);

        // 4. Task deadlines
        $tasks = Task::whereBetween('due_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->get()
            ->map(fn($t) => [
                'id' => 't_' . $t->id,
                'type' => 'task',
                'title' => 'Deadline: ' . $t->title,
                'date' => $t->due_date->format('Y-m-d'),
                'priority' => $t->priority,
            ]);

        $events = collect([...$meetings, ...$holidays, ...$leaves, ...$tasks]);

        return Inertia::render('Operations/Calendar/Index', [
            'month' => $month,
            'year' => $year,
            'monthName' => $startDate->format('F Y'),
            'events' => $events,
            'daysInMonth' => $startDate->daysInMonth,
        ]);
    }
}
