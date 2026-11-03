<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::with('user');

        if ($request->filled('module')) {
            $query->where('module', $request->module);
        }
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where('description', 'like', "%{$s}%");
        }

        $logs = $query->latest()->paginate(20)->withQueryString();
        $modules = AuditLog::select('module')->distinct()->pluck('module');

        return Inertia::render('System/AuditLogs', [
            'logs' => $logs,
            'modules' => $modules,
            'filters' => $request->only(['module', 'action', 'search']),
        ]);
    }
}
