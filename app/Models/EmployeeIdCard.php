<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeIdCard extends Model
{
    protected $fillable = [
        'employee_id',
        'card_number',
        'template',
        'issue_date',
        'expiry_date',
        'qr_verification_token',
        'print_count',
        'status',
        'reissue_reason',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'print_count' => 'integer',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
