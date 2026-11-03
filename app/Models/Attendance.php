<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    protected $fillable = [
        'employee_id',
        'date',
        'clock_in',
        'clock_out',
        'total_hours',
        'status',
        'notes',
        'is_corrected',
        'corrected_by',
    ];

    protected $casts = [
        'date' => 'date',
        'total_hours' => 'decimal:2',
        'is_corrected' => 'boolean',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function correctedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'corrected_by');
    }
}
