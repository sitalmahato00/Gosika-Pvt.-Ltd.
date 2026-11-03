<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-[#F7F8FA]">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('app.name', 'GOSIKA Office') }}</title>

    @php($companyLogoUrl = \App\Models\CompanySetting::first()?->logo_url)

    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

    <link rel="icon" href="{{ $companyLogoUrl ?: asset('gosika-icon.svg') }}">

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="h-full font-sans antialiased text-[#202124] bg-[#F7F8FA] selection:bg-[#FF5500] selection:text-white">
    @inertia
</body>
</html>
