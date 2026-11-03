<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetMaintenance;
use App\Models\Supplier;
use App\Models\Employee;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AssetController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->input('category');
        $status = $request->input('status');
        $search = $request->input('search');

        $query = Asset::with(['supplier', 'assignedEmployee', 'maintenances']);

        if ($category) {
            $query->where('category', $category);
        }
        if ($status) {
            $query->where('status', $status);
        }
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('asset_code', 'like', "%{$search}%")
                  ->orWhere('serial_number', 'like', "%{$search}%");
            });
        }

        $assets = $query->latest('id')->paginate(10)->withQueryString();
        $suppliers = Supplier::where('status', 'active')->select('id', 'name')->get();
        $employees = Employee::where('status', 'active')->select('id', 'full_name', 'employee_code')->get();

        $stats = [
            'total' => Asset::count(),
            'total_valuation' => (float) Asset::sum('purchase_cost'),
            'in_use' => Asset::where('status', 'in_use')->count(),
            'available' => Asset::where('status', 'available')->count(),
            'maintenance' => Asset::where('status', 'under_maintenance')->count(),
        ];

        return Inertia::render('Office/Assets/Index', [
            'assets' => $assets,
            'suppliers' => $suppliers,
            'employees' => $employees,
            'stats' => $stats,
            'filters' => $request->only(['category', 'status', 'search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'serial_number' => ['nullable', 'string', 'max:100'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'purchase_date' => ['nullable', 'date'],
            'purchase_cost' => ['required', 'numeric', 'min:0'],
            'warranty_expiry' => ['nullable', 'date'],
            'condition' => ['required', 'in:new,good,fair,needs_repair,disposed'],
            'assigned_employee_id' => ['nullable', 'exists:employees,id'],
            'status' => ['required', 'in:in_use,available,under_maintenance,retired'],
            'notes' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:3072'],
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('assets', 'public');
        }

        $lastId = Asset::max('id') ?? 0;
        $validated['asset_code'] = 'GSK-AST-' . str_pad($lastId + 1, 4, '0', STR_PAD_LEFT);

        $asset = Asset::create($validated);
        AuditLog::log('create', 'assets', $asset->id, "Registered company asset: {$asset->name} ({$asset->asset_code})");

        return back()->with('success', 'Asset recorded successfully.');
    }

    public function update(Request $request, Asset $asset)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'serial_number' => ['nullable', 'string', 'max:100'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'purchase_date' => ['nullable', 'date'],
            'purchase_cost' => ['required', 'numeric', 'min:0'],
            'warranty_expiry' => ['nullable', 'date'],
            'condition' => ['required', 'in:new,good,fair,needs_repair,disposed'],
            'assigned_employee_id' => ['nullable', 'exists:employees,id'],
            'status' => ['required', 'in:in_use,available,under_maintenance,retired'],
            'notes' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:3072'],
        ]);

        if ($request->hasFile('image')) {
            if ($asset->image_path && Storage::disk('public')->exists($asset->image_path)) {
                Storage::disk('public')->delete($asset->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('assets', 'public');
        }

        $asset->update($validated);
        AuditLog::log('update', 'assets', $asset->id, "Updated asset: {$asset->name}");

        return back()->with('success', 'Asset updated successfully.');
    }

    public function storeMaintenance(Request $request, Asset $asset)
    {
        $validated = $request->validate([
            'maintenance_date' => ['required', 'date'],
            'cost' => ['required', 'numeric', 'min:0'],
            'description' => ['required', 'string'],
            'service_provider' => ['nullable', 'string', 'max:255'],
            'next_service_date' => ['nullable', 'date'],
            'status' => ['required', 'in:scheduled,in_progress,completed'],
        ]);

        $validated['asset_id'] = $asset->id;
        $maintenance = AssetMaintenance::create($validated);

        AuditLog::log('create', 'asset_maintenances', $maintenance->id, "Logged maintenance for asset {$asset->asset_code}");

        return back()->with('success', 'Maintenance record added.');
    }
}
