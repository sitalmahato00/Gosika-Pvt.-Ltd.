<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeaveType extends Model
{
    protected $fillable = [
        'name',
        'code',
        'max_days_per_year',
        'is_paid',
        'description',
    ];

    protected $casts = [
        'max_days_per_year' => 'integer',
        'is_paid' => 'boolean',
    ];

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }
}
