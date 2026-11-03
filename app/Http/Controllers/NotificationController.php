<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::latest()->paginate(15);
        return Inertia::render('System/Notifications', [
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead(Notification $notification)
    {
        $notification->update(['is_read' => true]);
        return back();
    }

    public function markAllAsRead()
    {
        Notification::where('is_read', false)->update(['is_read' => true]);
        return back()->with('success', 'All notifications marked as read.');
    }
}
