<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\Employee;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->input('status');
        $query = Project::withCount('tasks')->with('creator');

        if ($status) {
            $query->where('status', $status);
        }

        $projects = $query->latest('id')->paginate(9)->withQueryString();

        $stats = [
            'total' => Project::count(),
            'active' => Project::where('status', 'active')->count(),
            'completed' => Project::where('status', 'completed')->count(),
            'planning' => Project::where('status', 'planning')->count(),
        ];

        return Inertia::render('Operations/Projects/Index', [
            'projects' => $projects,
            'stats' => $stats,
            'statusFilter' => $status,
        ]);
    }

    public function storeProject(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'client_name' => ['nullable', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'budget' => ['required', 'numeric', 'min:0'],
            'priority' => ['required', 'in:low,medium,high,urgent'],
            'status' => ['required', 'in:planning,active,on_hold,completed,cancelled'],
            'description' => ['nullable', 'string'],
        ]);

        $lastId = Project::max('id') ?? 0;
        $validated['code'] = 'GSK-PRJ-' . str_pad($lastId + 1, 2, '0', STR_PAD_LEFT);
        $validated['created_by'] = auth()->id();

        $project = Project::create($validated);
        AuditLog::log('create', 'projects', $project->id, "Created project: {$project->name} ({$project->code})");

        return back()->with('success', 'Project created successfully.');
    }

    public function showProject(Project $project)
    {
        $project->load(['tasks.assignedEmployee', 'creator']);
        $employees = Employee::where('status', 'active')->select('id', 'full_name', 'employee_code')->get();

        return Inertia::render('Operations/Projects/Show', [
            'project' => $project,
            'employees' => $employees,
        ]);
    }

    public function updateProject(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'client_name' => ['nullable', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date'],
            'budget' => ['required', 'numeric'],
            'status' => ['required', 'in:planning,active,on_hold,completed,cancelled'],
            'priority' => ['required', 'in:low,medium,high,urgent'],
            'progress_percentage' => ['required', 'integer', 'min:0', 'max:100'],
            'description' => ['nullable', 'string'],
        ]);

        $project->update($validated);
        AuditLog::log('update', 'projects', $project->id, "Updated project details: {$project->name}");

        return back()->with('success', 'Project updated successfully.');
    }

    public function kanban(Request $request)
    {
        $projectId = $request->input('project_id');
        $query = Task::with(['project', 'assignedEmployee']);

        if ($projectId) {
            $query->where('project_id', $projectId);
        }

        $tasks = $query->orderByRaw("FIELD(priority, 'urgent', 'high', 'medium', 'low')")->get();
        $projects = Project::select('id', 'name', 'code')->get();
        $employees = Employee::where('status', 'active')->select('id', 'full_name', 'employee_code')->get();

        return Inertia::render('Operations/Tasks/Kanban', [
            'tasks' => $tasks,
            'projects' => $projects,
            'employees' => $employees,
            'selectedProjectId' => $projectId,
        ]);
    }

    public function storeTask(Request $request)
    {
        $validated = $request->validate([
            'project_id' => ['nullable', 'exists:projects,id'],
            'assigned_to' => ['nullable', 'exists:employees,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_date' => ['nullable', 'date'],
            'due_date' => ['required', 'date'],
            'priority' => ['required', 'in:low,medium,high,urgent'],
            'status' => ['required', 'in:todo,in_progress,review,completed'],
            'progress_percentage' => ['nullable', 'integer', 'min:0', 'max:100'],
            'notes' => ['nullable', 'string'],
        ]);

        $validated['created_by'] = auth()->id();
        $task = Task::create($validated);

        AuditLog::log('create', 'tasks', $task->id, "Created task: {$task->title}");

        return back()->with('success', 'Task added successfully.');
    }

    public function updateTaskStatus(Request $request, Task $task)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:todo,in_progress,review,completed'],
            'progress_percentage' => ['nullable', 'integer', 'between:0,100'],
        ]);

        if (!isset($validated['progress_percentage'])) {
            if ($validated['status'] === 'completed') {
                $validated['progress_percentage'] = 100;
            } elseif ($validated['status'] === 'todo') {
                $validated['progress_percentage'] = 0;
            }
        }

        $task->update($validated);
        AuditLog::log('update', 'tasks', $task->id, "Moved task '{$task->title}' to status: {$validated['status']}");

        return back()->with('success', 'Task updated.');
    }
}
