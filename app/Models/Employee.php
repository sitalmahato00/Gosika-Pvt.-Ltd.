<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Employee extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'employee_code',
        'first_name',
        'last_name',
        'full_name',
        'email',
        'phone',
        'gender',
        'date_of_birth',
        'marital_status',
        'blood_group',
        'permanent_address',
        'current_address',
        'department_id',
        'designation_id',
        'employment_type',
        'joining_date',
        'exit_date',
        'exit_reason',
        'basic_salary',
        'bank_name',
        'bank_account_no',
        'bank_branch',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relation',
        'photo_path',
        'status',
        'qr_token',
        'notes',
    ];

    protected $appends = ['photo_url'];

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photo_path ? asset('storage/' . $this->photo_path) : null;
    }

    protected $casts = [
        'date_of_birth' => 'date',
        'joining_date' => 'date',
        'exit_date' => 'date',
        'basic_salary' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::creating(function ($employee) {
            if (empty($employee->employee_code)) {
                $lastId = static::withTrashed()->max('id') ?? 0;
                $employee->employee_code = 'GSK-EMP-' . str_pad($lastId + 1, 4, '0', STR_PAD_LEFT);
            }
            if (empty($employee->qr_token)) {
                $employee->qr_token = Str::random(32);
            }
            if (empty($employee->full_name)) {
                $employee->full_name = trim($employee->first_name . ' ' . $employee->last_name);
            }
        });
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function designation(): BelongsTo
    {
        return $this->belongsTo(Designation::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function salaries(): HasMany
    {
        return $this->hasMany(Salary::class);
    }

    public function idCards(): HasMany
    {
        return $this->hasMany(EmployeeIdCard::class);
    }

    public function latestIdCard()
    {
        return $this->hasOne(EmployeeIdCard::class)->latestOfMany();
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    public function assets(): HasMany
    {
        return $this->hasMany(Asset::class, 'assigned_employee_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}
