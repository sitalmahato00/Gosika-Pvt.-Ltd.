<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Meeting extends Model
{
    protected $fillable = [
        'title',
        'meeting_date',
        'start_time',
        'end_time',
        'location_or_link',
        'agenda',
        'minutes_of_meeting',
        'status',
        'created_by',
    ];

    protected $casts = [
        'meeting_date' => 'date',
    ];

    public function participants(): HasMany
    {
        return $this->hasMany(MeetingParticipant::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
