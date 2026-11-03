<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $suppliers = Supplier::withCount(['assets', 'inventoryItems'])
            ->latest('id')
            ->paginate(10);

        return Inertia::render('Office/Suppliers/Index', [
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'contact_person' => ['nullable', 'string', 'max:100'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'tax_number' => ['nullable', 'string', 'max:50'],
            'products_or_services' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        $lastId = Supplier::max('id') ?? 0;
        $validated['code'] = 'GSK-SPL-' . str_pad($lastId + 1, 2, '0', STR_PAD_LEFT);

        $supplier = Supplier::create($validated);
        AuditLog::log('create', 'suppliers', $supplier->id, "Added supplier: {$supplier->name} ({$supplier->code})");

        return back()->with('success', 'Supplier registered successfully.');
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'contact_person' => ['nullable', 'string', 'max:100'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'tax_number' => ['nullable', 'string', 'max:50'],
            'products_or_services' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        $supplier->update($validated);
        AuditLog::log('update', 'suppliers', $supplier->id, "Updated supplier: {$supplier->name}");

        return back()->with('success', 'Supplier updated successfully.');
    }
}
