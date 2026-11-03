<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    protected $fillable = [
        'user_id',
        'user_name',
        'action',
        'module',
        'record_id',
        'description',
        'ip_address',
        'user_agent',
        'details',
    ];

    protected $casts = [
        'details' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function log(string $action, string $module, ?int $recordId, string $description, ?array $details = null): self
    {
        return static::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()?->name ?? 'Administrator',
            'action' => $action,
            'module' => $module,
            'record_id' => $recordId,
            'description' => $description,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'details' => $details,
        ]);
    }
}
