<?php

namespace App\Http\Middleware;

use App\Models\CompanySetting;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $unreadCount = $user ? Notification::where('is_read', false)->count() : 0;
        $recentNotifications = $user ? Notification::latest()->limit(5)->get() : [];

        $company = CompanySetting::first();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'avatar' => $user->avatar,
                    'avatar_url' => $user->avatar_url,
                    'phone' => $user->phone,
                ] : null,
            ],
            'company' => $company ? [
                'name' => $company->company_name,
                'trading_name' => $company->trading_name,
                'email' => $company->email,
                'phone' => $company->phone,
                'address' => $company->address,
                'city' => $company->city,
                'country' => $company->country,
                'currency' => $company->default_currency,
                'currency_symbol' => $company->currency_symbol,
                'fiscal_year' => $company->fiscal_year,
                'logo_path' => $company->logo_path,
                'logo_url' => $company->logo_url,
                'stamp_signature_url' => $company->stamp_signature_url,
            ] : null,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
            'notifications' => [
                'unread_count' => $unreadCount,
                'recent' => $recentNotifications,
            ],
        ];
    }
}
