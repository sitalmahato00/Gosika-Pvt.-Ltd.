<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\Project;
use App\Models\Task;
use App\Models\Income;
use App\Models\Expense;
use App\Models\Department;
use App\Models\Meeting;
use App\Models\Holiday;
use App\Models\Notification;
use App\Models\AuditLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        // 1. KPI Counts
        $totalEmployees = Employee::where('status', 'active')->count();
        $presentToday = Attendance::where('date', $today->format('Y-m-d'))
            ->whereIn('status', ['present', 'late', 'half_day'])
            ->count();
        $absentToday = $totalEmployees - $presentToday;
        if ($absentToday < 0) {
            $absentToday = 0;
        }

        $pendingLeaves = LeaveRequest::where('status', 'pending')->count();
        $activeProjects = Project::where('status', 'active')->count();
        $pendingTasks = Task::whereIn('status', ['todo', 'in_progress', 'review'])->count();

        // Financial figures for current month
        $monthlyIncome = (float) Income::whereBetween('date', [$startOfMonth, $endOfMonth])
            ->where('status', 'completed')
            ->sum('amount');

        $monthlyExpenses = (float) Expense::whereBetween('date', [$startOfMonth, $endOfMonth])
            ->where('status', 'paid')
            ->sum('amount');

        // All-time available balance
        $allIncome = (float) Income::where('status', 'completed')->sum('amount');
        $allExpenses = (float) Expense::where('status', 'paid')->sum('amount');
        $availableBalance = $allIncome - $allExpenses;

        // 2. Income vs Expenses monthly trajectory (last 6 months)
        $financialChart = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthDate = Carbon::now()->subMonths($i);
            $mStart = $monthDate->copy()->startOfMonth();
            $mEnd = $monthDate->copy()->endOfMonth();

            $inc = (float) Income::whereBetween('date', [$mStart, $mEnd])->where('status', 'completed')->sum('amount');
            $exp = (float) Expense::whereBetween('date', [$mStart, $mEnd])->where('status', 'paid')->sum('amount');

            $financialChart[] = [
                'month' => $monthDate->format('M Y'),
                'income' => $inc,
                'expense' => $exp,
                'net' => $inc - $exp,
            ];
        }

        // 3. Department distribution
        $deptDistribution = Department::withCount('employees')
            ->get()
            ->map(fn($d) => [
                'id' => $d->id,
                'name' => $d->name,
                'code' => $d->code,
                'count' => $d->employees_count,
            ]);

        // 4. Recent expenses
        $recentExpenses = Expense::with('category')
            ->latest('date')
            ->limit(5)
            ->get();

        // 5. Upcoming meetings
        $upcomingMeetings = Meeting::where('meeting_date', '>=', $today->format('Y-m-d'))
            ->where('status', 'scheduled')
            ->orderBy('meeting_date')
            ->orderBy('start_time')
            ->limit(4)
            ->get();

        // 6. Pending tasks
        $urgentTasks = Task::with(['assignedEmployee', 'project'])
            ->whereIn('status', ['todo', 'in_progress', 'review'])
            ->orderByRaw("FIELD(priority, 'urgent', 'high', 'medium', 'low')")
            ->orderBy('due_date')
            ->limit(5)
            ->get();

        // 7. Upcoming holidays
        $upcomingHolidays = Holiday::where('start_date', '>=', $today->format('Y-m-d'))
            ->orderBy('start_date')
            ->limit(3)
            ->get();

        // 8. Recent Activity Logs
        $recentActivities = AuditLog::latest()
            ->limit(6)
            ->get();

        // 9. Important Notifications
        $notifications = Notification::latest()
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard/Index', [
            'metrics' => [
                'total_employees' => $totalEmployees,
                'present_today' => $presentToday,
                'absent_today' => $absentToday,
                'pending_leaves' => $pendingLeaves,
                'active_projects' => $activeProjects,
                'pending_tasks' => $pendingTasks,
                'monthly_income' => $monthlyIncome,
                'monthly_expenses' => $monthlyExpenses,
                'available_balance' => $availableBalance,
            ],
            'financialChart' => $financialChart,
            'deptDistribution' => $deptDistribution,
            'recentExpenses' => $recentExpenses,
            'upcomingMeetings' => $upcomingMeetings,
            'urgentTasks' => $urgentTasks,
            'upcomingHolidays' => $upcomingHolidays,
            'recentActivities' => $recentActivities,
            'notifications' => $notifications,
        ]);
    }
}
