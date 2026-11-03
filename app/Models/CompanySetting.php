<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanySetting extends Model
{
    protected $fillable = [
        'company_name',
        'trading_name',
        'registration_no',
        'pan_vat_no',
        'email',
        'phone',
        'website',
        'address',
        'city',
        'country',
        'default_currency',
        'currency_symbol',
        'date_format',
        'fiscal_year',
        'logo_path',
        'stamp_signature_path',
        'id_card_template',
        'attendance_grace_minutes',
        'annual_leave_quota',
        'default_tax_rate',
        'default_provident_fund_rate',
    ];

    protected $casts = [
        'attendance_grace_minutes' => 'integer',
        'annual_leave_quota' => 'integer',
        'default_tax_rate' => 'decimal:2',
        'default_provident_fund_rate' => 'decimal:2',
    ];

    protected $appends = ['logo_url', 'stamp_signature_url'];

    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo_path ? asset('storage/' . $this->logo_path) : null;
    }

    public function getStampSignatureUrlAttribute(): ?string
    {
        return $this->stamp_signature_path ? asset('storage/' . $this->stamp_signature_path) : null;
    }

    public static function current(): self
    {
        return static::firstOrCreate([], [
            'company_name' => 'GOSIKA Pvt. Ltd.',
            'trading_name' => 'GOSIKA',
            'registration_no' => 'REG-284910/080/081',
            'pan_vat_no' => '612093845',
            'email' => 'office@gosika.com',
            'phone' => '+977-1-4567890',
            'website' => 'https://gosika.com',
            'address' => 'Corporate Tower, Tinkune',
            'city' => 'Kathmandu',
            'country' => 'Nepal',
            'default_currency' => 'NPR',
            'currency_symbol' => 'रू',
            'fiscal_year' => '2081/2082',
            'id_card_template' => 'corporate_modern',
        ]);
    }
}
