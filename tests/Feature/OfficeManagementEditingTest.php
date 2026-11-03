<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\InventoryItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OfficeManagementEditingTest extends TestCase
{
    use RefreshDatabase;

    public function test_asset_details_can_be_updated(): void
    {
        $user = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $asset = Asset::create([
            'asset_code' => 'GSK-AST-0001',
            'name' => 'Old Asset Name',
            'category' => 'IT Equipment',
            'purchase_cost' => 500,
            'condition' => 'good',
            'status' => 'in_use',
        ]);

        $response = $this->actingAs($user)->put(route('assets.update', $asset), [
            'name' => 'Corrected Asset Name',
            'category' => 'Office Electronics',
            'serial_number' => 'SERIAL-123',
            'supplier_id' => null,
            'purchase_date' => null,
            'purchase_cost' => 750,
            'warranty_expiry' => null,
            'condition' => 'new',
            'assigned_employee_id' => null,
            'status' => 'available',
            'notes' => 'Corrected entry',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('assets', [
            'id' => $asset->id,
            'name' => 'Corrected Asset Name',
            'category' => 'Office Electronics',
            'purchase_cost' => 750,
            'status' => 'available',
        ]);
    }

    public function test_inventory_details_can_be_updated_and_quantity_corrections_are_recorded(): void
    {
        $user = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $item = InventoryItem::create([
            'item_code' => 'GSK-INV-101',
            'name' => 'Old Item Name',
            'category' => 'Stationery',
            'quantity' => 8,
            'unit' => 'pcs',
            'min_stock_threshold' => 2,
            'unit_price' => 10,
        ]);

        $response = $this->actingAs($user)->post(route('inventory.update', $item), [
            '_method' => 'PUT',
            'name' => 'Corrected Item Name',
            'category' => 'Printing',
            'quantity' => 12,
            'unit' => 'pack',
            'min_stock_threshold' => 3,
            'unit_price' => 15,
            'supplier_id' => null,
            'location' => 'Main Storage',
            'notes' => 'Corrected entry',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('inventory_items', [
            'id' => $item->id,
            'name' => 'Corrected Item Name',
            'quantity' => 12,
            'unit_price' => 15,
            'location' => 'Main Storage',
        ]);
        $this->assertDatabaseHas('inventory_transactions', [
            'inventory_item_id' => $item->id,
            'type' => 'adjustment',
            'quantity' => 12,
            'balance_after' => 12,
            'logged_by' => $user->id,
        ]);
    }
}
