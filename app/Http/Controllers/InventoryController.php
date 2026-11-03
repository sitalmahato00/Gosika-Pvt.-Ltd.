<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\InventoryTransaction;
use App\Models\Supplier;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Carbon\Carbon;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->input('category');
        $lowStockOnly = $request->boolean('low_stock');
        $search = $request->input('search');

        $query = InventoryItem::with(['supplier', 'transactions' => fn($q) => $q->latest()->limit(5)]);

        if ($category) {
            $query->where('category', $category);
        }
        if ($lowStockOnly) {
            $query->whereColumn('quantity', '<=', 'min_stock_threshold');
        }
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('item_code', 'like', "%{$search}%");
            });
        }

        $items = $query->latest('id')->paginate(10)->withQueryString();
        $suppliers = Supplier::where('status', 'active')->select('id', 'name')->get();

        $stats = [
            'total_items' => InventoryItem::count(),
            'total_stock_value' => (float) InventoryItem::selectRaw('SUM(quantity * unit_price) as total')->value('total'),
            'low_stock_count' => InventoryItem::whereColumn('quantity', '<=', 'min_stock_threshold')->count(),
        ];

        return Inertia::render('Office/Inventory/Index', [
            'items' => $items,
            'suppliers' => $suppliers,
            'stats' => $stats,
            'filters' => $request->only(['category', 'low_stock', 'search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'quantity' => ['required', 'integer', 'min:0'],
            'unit' => ['required', 'string', 'max:20'],
            'min_stock_threshold' => ['required', 'integer', 'min:1'],
            'unit_price' => ['required', 'numeric', 'min:0'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'location' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:3072'],
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('inventory', 'public');
        }

        $lastId = InventoryItem::max('id') ?? 0;
        $validated['item_code'] = 'GSK-INV-' . str_pad($lastId + 101, 3, '0', STR_PAD_LEFT);

        $item = InventoryItem::create($validated);

        if ($item->quantity > 0) {
            InventoryTransaction::create([
                'inventory_item_id' => $item->id,
                'type' => 'in',
                'quantity' => $item->quantity,
                'balance_after' => $item->quantity,
                'date' => Carbon::today()->format('Y-m-d'),
                'notes' => 'Opening stock initialization',
                'logged_by' => auth()->id(),
            ]);
        }

        AuditLog::log('create', 'inventory', $item->id, "Created inventory item: {$item->name} ({$item->item_code})");

        return back()->with('success', 'Inventory item added successfully.');
    }

    public function stockAdjustment(Request $request, InventoryItem $inventoryItem)
    {
        $validated = $request->validate([
            'type' => ['required', 'in:in,out,adjustment'],
            'quantity' => ['required', 'integer', 'min:1'],
            'notes' => ['nullable', 'string'],
            'reference_no' => ['nullable', 'string'],
        ]);

        $currentQty = $inventoryItem->quantity;
        if ($validated['type'] === 'in') {
            $newQty = $currentQty + $validated['quantity'];
        } elseif ($validated['type'] === 'out') {
            if ($currentQty < $validated['quantity']) {
                return back()->with('error', 'Cannot deduct more than available inventory.');
            }
            $newQty = $currentQty - $validated['quantity'];
        } else {
            // direct adjustment
            $newQty = $validated['quantity'];
        }

        $inventoryItem->update(['quantity' => $newQty]);

        InventoryTransaction::create([
            'inventory_item_id' => $inventoryItem->id,
            'type' => $validated['type'],
            'quantity' => $validated['quantity'],
            'balance_after' => $newQty,
            'date' => Carbon::today()->format('Y-m-d'),
            'reference_no' => $validated['reference_no'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'logged_by' => auth()->id(),
        ]);

        AuditLog::log('update', 'inventory', $inventoryItem->id, "Adjusted inventory for {$inventoryItem->name} (New Balance: {$newQty})");

        return back()->with('success', "Stock updated. New balance: {$newQty} {$inventoryItem->unit}");
    }
}
