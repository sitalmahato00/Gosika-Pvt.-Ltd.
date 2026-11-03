<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetMaintenance extends Model
{
    protected $fillable = [
        'asset_id',
        'maintenance_date',
        'cost',
        'description',
        'service_provider',
        'next_service_date',
        'status',
    ];

    protected $casts = [
        'maintenance_date' => 'date',
        'next_service_date' => 'date',
        'cost' => 'decimal:2',
    ];

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }
}
