<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    protected $fillable = [
        'title',
        'start_date',
        'end_date',
        'total_days',
        'type',
        'description',
        'is_recurring',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'total_days' => 'integer',
        'is_recurring' => 'boolean',
    ];
}
