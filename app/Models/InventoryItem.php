<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryItem extends Model
{
    protected $fillable = [
        'item_code',
        'name',
        'category',
        'quantity',
        'unit',
        'min_stock_threshold',
        'unit_price',
        'supplier_id',
        'location',
        'image_path',
        'notes',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? asset('storage/' . $this->image_path) : null;
    }

    protected $casts = [
        'quantity' => 'integer',
        'min_stock_threshold' => 'integer',
        'unit_price' => 'decimal:2',
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(InventoryTransaction::class);
    }

    public function isLowStock(): bool
    {
        return $this->quantity <= $this->min_stock_threshold;
    }
}
