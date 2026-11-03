<?php

namespace App\Http\Controllers;

use App\Models\CompanySetting;
use App\Models\AuditLog;
use App\Services\BackupService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CompanySettingController extends Controller
{
    public function index()
    {
        $setting = CompanySetting::current();

        // Check existing backups
        $backupFiles = [];
        if (Storage::disk('local')->exists('backups')) {
            $files = Storage::disk('local')->files('backups');
            foreach ($files as $f) {
                $backupFiles[] = [
                    'name' => basename($f),
                    'path' => $f,
                    'size_kb' => round(Storage::disk('local')->size($f) / 1024),
                    'created_at' => date('Y-m-d H:i:s', Storage::disk('local')->lastModified($f)),
                ];
            }
        }

        return Inertia::render('System/CompanySettings', [
            'settings' => $setting,
            'backups' => $backupFiles,
        ]);
    }

    public function update(Request $request)
    {
        $setting = CompanySetting::current();

        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'trading_name' => ['required', 'string', 'max:100'],
            'registration_no' => ['nullable', 'string', 'max:100'],
            'pan_vat_no' => ['nullable', 'string', 'max:50'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'website' => ['nullable', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'city' => ['required', 'string', 'max:100'],
            'country' => ['required', 'string', 'max:100'],
            'default_currency' => ['required', 'string', 'max:10'],
            'currency_symbol' => ['required', 'string', 'max:10'],
            'fiscal_year' => ['required', 'string', 'max:50'],
            'id_card_template' => ['required', 'string'],
            'attendance_grace_minutes' => ['required', 'integer', 'min:0'],
            'annual_leave_quota' => ['required', 'integer', 'min:1'],
            'default_tax_rate' => ['required', 'numeric', 'min:0', 'max:50'],
            'default_provident_fund_rate' => ['required', 'numeric', 'min:0', 'max:50'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,svg,webp', 'max:2048'],
            'stamp_signature' => ['nullable', 'image', 'mimes:jpeg,png,jpg,svg,webp', 'max:2048'],
        ]);

        if ($request->hasFile('logo')) {
            if ($setting->logo_path && Storage::disk('public')->exists($setting->logo_path)) {
                Storage::disk('public')->delete($setting->logo_path);
            }
            $validated['logo_path'] = $request->file('logo')->store('company', 'public');
        }

        if ($request->hasFile('stamp_signature')) {
            if ($setting->stamp_signature_path && Storage::disk('public')->exists($setting->stamp_signature_path)) {
                Storage::disk('public')->delete($setting->stamp_signature_path);
            }
            $validated['stamp_signature_path'] = $request->file('stamp_signature')->store('company', 'public');
        }

        $setting->update($validated);
        AuditLog::log('update', 'company_settings', $setting->id, 'Updated company profile and settings');

        return back()->with('success', 'Company settings updated successfully.');
    }

    public function createBackup(BackupService $backupService)
    {
        $filePath = $backupService->createSqlBackup();
        AuditLog::log('backup', 'system', null, "Created manual SQL database backup: {$filePath}");

        return back()->with('success', 'Database backup archive created successfully.');
    }

    public function downloadBackup(string $filename)
    {
        $path = "backups/{$filename}";
        if (!Storage::disk('local')->exists($path)) {
            return back()->with('error', 'Backup file not found.');
        }

        AuditLog::log('export', 'system', null, "Downloaded database backup archive: {$filename}");
        return Storage::disk('local')->download($path);
    }
}
