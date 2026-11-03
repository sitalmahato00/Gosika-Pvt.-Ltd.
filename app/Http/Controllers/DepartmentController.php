<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Designation;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index()
    {
        $departments = Department::with(['head', 'designations'])
            ->withCount('employees')
            ->get();

        $designations = Designation::with('department')
            ->withCount('employees')
            ->get();

        return Inertia::render('HR/Departments/Index', [
            'departments' => $departments,
            'designations' => $designations,
        ]);
    }

    public function storeDepartment(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:10', 'unique:departments,code'],
            'description' => ['nullable', 'string'],
        ]);

        $dept = Department::create($validated);
        AuditLog::log('create', 'departments', $dept->id, "Created department: {$dept->name}");

        return back()->with('success', 'Department created successfully.');
    }

    public function storeDesignation(Request $request)
    {
        $validated = $request->validate([
            'department_id' => ['required', 'exists:departments,id'],
            'title' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:10', 'unique:designations,code'],
            'description' => ['nullable', 'string'],
        ]);

        $desig = Designation::create($validated);
        AuditLog::log('create', 'designations', $desig->id, "Created designation: {$desig->title}");

        return back()->with('success', 'Designation created successfully.');
    }

    public function destroyDepartment(Department $department)
    {
        if ($department->employees()->count() > 0) {
            return back()->with('error', 'Cannot delete department with active employees assigned.');
        }

        $name = $department->name;
        $department->delete();
        AuditLog::log('delete', 'departments', null, "Deleted department: {$name}");

        return back()->with('success', 'Department deleted successfully.');
    }

    public function destroyDesignation(Designation $designation)
    {
        if ($designation->employees()->count() > 0) {
            return back()->with('error', 'Cannot delete designation with active employees assigned.');
        }

        $title = $designation->title;
        $designation->delete();
        AuditLog::log('delete', 'designations', null, "Deleted designation: {$title}");

        return back()->with('success', 'Designation deleted successfully.');
    }
}
