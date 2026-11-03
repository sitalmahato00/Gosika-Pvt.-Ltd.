<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryTransaction extends Model
{
    protected $fillable = [
        'inventory_item_id',
        'type',
        'quantity',
        'balance_after',
        'date',
        'reference_no',
        'notes',
        'logged_by',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'balance_after' => 'integer',
        'date' => 'date',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }

    public function logger(): BelongsTo
    {
        return $this->belongsTo(User::class, 'logged_by');
    }
}
