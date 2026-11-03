<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::latest('start_date')->paginate(10);

        return Inertia::render('Operations/Announcements/Index', [
            'announcements' => $announcements,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'priority' => ['required', 'in:normal,important,urgent'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date'],
            'is_active' => ['boolean'],
        ]);

        $validated['created_by'] = auth()->id();
        $announcement = Announcement::create($validated);

        AuditLog::log('create', 'announcements', $announcement->id, "Published announcement: {$announcement->title}");

        return back()->with('success', 'Announcement published successfully.');
    }

    public function destroy(Announcement $announcement)
    {
        $title = $announcement->title;
        $announcement->delete();
        AuditLog::log('delete', 'announcements', null, "Deleted announcement: {$title}");

        return back()->with('success', 'Announcement deleted.');
    }
}
