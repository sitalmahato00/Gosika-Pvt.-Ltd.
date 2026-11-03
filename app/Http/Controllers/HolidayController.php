<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class HolidayController extends Controller
{
    public function index()
    {
        $holidays = Holiday::orderBy('start_date')->get();

        return Inertia::render('HR/Holidays/Index', [
            'holidays' => $holidays,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'type' => ['required', 'in:public,company,festival'],
            'description' => ['nullable', 'string'],
            'is_recurring' => ['boolean'],
        ]);

        $start = Carbon::parse($validated['start_date']);
        $end = Carbon::parse($validated['end_date']);
        $validated['total_days'] = $start->diffInDays($end) + 1;

        $holiday = Holiday::create($validated);
        AuditLog::log('create', 'holidays', $holiday->id, "Created holiday: {$holiday->title}");

        return back()->with('success', 'Holiday added successfully.');
    }

    public function destroy(Holiday $holiday)
    {
        $title = $holiday->title;
        $holiday->delete();
        AuditLog::log('delete', 'holidays', null, "Deleted holiday: {$title}");

        return back()->with('success', 'Holiday removed.');
    }
}
