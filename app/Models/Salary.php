<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Salary extends Model
{
    protected $fillable = [
        'employee_id',
        'month',
        'year',
        'salary_period',
        'slip_number',
        'basic_salary',
        'allowances',
        'bonuses',
        'gross_salary',
        'tax_deduction',
        'provident_fund',
        'other_deductions',
        'total_deductions',
        'net_salary',
        'payment_date',
        'payment_method',
        'payment_reference',
        'status',
        'notes',
        'generated_by',
    ];

    protected $casts = [
        'month' => 'integer',
        'year' => 'integer',
        'payment_date' => 'date',
        'basic_salary' => 'decimal:2',
        'allowances' => 'decimal:2',
        'bonuses' => 'decimal:2',
        'gross_salary' => 'decimal:2',
        'tax_deduction' => 'decimal:2',
        'provident_fund' => 'decimal:2',
        'other_deductions' => 'decimal:2',
        'total_deductions' => 'decimal:2',
        'net_salary' => 'decimal:2',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function generatedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
