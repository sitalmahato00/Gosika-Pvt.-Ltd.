<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Asset extends Model
{
    protected $fillable = [
        'asset_code',
        'name',
        'category',
        'serial_number',
        'supplier_id',
        'purchase_date',
        'purchase_cost',
        'warranty_expiry',
        'condition',
        'image_path',
        'assigned_employee_id',
        'status',
        'notes',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? asset('storage/' . $this->image_path) : null;
    }

    protected $casts = [
        'purchase_date' => 'date',
        'warranty_expiry' => 'date',
        'purchase_cost' => 'decimal:2',
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function assignedEmployee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'assigned_employee_id');
    }

    public function maintenances(): HasMany
    {
        return $this->hasMany(AssetMaintenance::class);
    }
}
