<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Employee Directory Report - {{ $company->trading_name ?? 'GOSIKA' }}</title>
    <style>
        @page {
            margin: 18mm 14mm 16mm 14mm;
            size: A4 landscape;
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }
        body {
            color: #202124;
            font-size: 8pt;
            background: #ffffff;
            -webkit-print-color-adjust: exact;
        }

        /* Formal Corporate Letterhead */
        .header-table {
            width: 100%;
            border-bottom: 3px solid #FF5500;
            padding-bottom: 10px;
            margin-bottom: 12px;
        }
        .header-logo-cell {
            width: 55%;
            vertical-align: middle;
        }
        .header-meta-cell {
            width: 45%;
            text-align: right;
            vertical-align: middle;
        }
        .logo-img {
            max-height: 38px;
            max-width: 160px;
            margin-bottom: 4px;
            display: block;
        }
        .brand-title {
            font-size: 16pt;
            font-weight: 900;
            color: #202124;
            letter-spacing: -0.5px;
            line-height: 1;
        }
        .brand-title span {
            color: #FF5500;
        }
        .company-legal {
            font-size: 7.5pt;
            color: #4B5563;
            margin-top: 3px;
            line-height: 1.35;
        }
        .report-badge {
            display: inline-block;
            background: #FFF0E8;
            color: #FF5500;
            border: 1px solid #FFD6C0;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 10pt;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
        }
        .report-meta {
            font-size: 7pt;
            color: #6B7280;
            line-height: 1.35;
        }

        /* KPI Banner */
        .kpi-table {
            width: 100%;
            margin-bottom: 12px;
            border-collapse: separate;
            border-spacing: 8px 0;
        }
        .kpi-card {
            background: #F9FAFB;
            border: 1px solid #E5E7EB;
            border-radius: 6px;
            padding: 6px 12px;
            text-align: center;
        }
        .kpi-val {
            font-size: 11pt;
            font-weight: 800;
            color: #202124;
        }
        .kpi-lbl {
            font-size: 6.5pt;
            color: #6B7280;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.3px;
        }

        /* Main Data Table */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }
        .data-table th {
            background: #202124;
            color: #ffffff;
            font-size: 7pt;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            padding: 6px 8px;
            text-align: left;
            border-top: 1px solid #202124;
            border-bottom: 1px solid #202124;
        }
        .data-table td {
            padding: 5px 8px;
            font-size: 7.5pt;
            border-bottom: 1px solid #E5E7EB;
            vertical-align: middle;
        }
        .data-table tr:nth-child(even) td {
            background-color: #F9FAFB;
        }
        .code-pill {
            font-family: monospace;
            font-weight: 700;
            color: #111827;
            background: #E5E7EB;
            padding: 1.5px 5px;
            border-radius: 3px;
            font-size: 7pt;
        }
        .emp-name {
            font-weight: 700;
            color: #111827;
        }
        .num-col {
            text-align: right;
            font-family: monospace;
            font-weight: 700;
        }

        /* Formal Signatory Block */
        .sign-table {
            width: 100%;
            margin-top: 24px;
            page-break-inside: avoid;
        }
        .sign-cell {
            width: 33.33%;
            text-align: center;
            vertical-align: bottom;
            padding: 0 16px;
        }
        .sign-line {
            border-top: 1px solid #9CA3AF;
            margin-top: 36px;
            margin-bottom: 4px;
        }
        .sign-title {
            font-size: 7.5pt;
            font-weight: 700;
            color: #374151;
            text-transform: uppercase;
        }
        .sign-sub {
            font-size: 6.5pt;
            color: #6B7280;
        }

        /* Disclaimer Footer */
        .footer-note {
            margin-top: 16px;
            padding-top: 8px;
            border-top: 1px dashed #D1D5DB;
            font-size: 6.5pt;
            color: #9CA3AF;
            display: table;
            width: 100%;
        }
        .footer-left {
            display: table-cell;
            text-align: left;
        }
        .footer-right {
            display: table-cell;
            text-align: right;
        }
        @include('pdf.partials.document_styles')
    </style>
</head>
<body>

    <!-- Corporate Letterhead Header -->
    <table class="header-table">
        <tr>
            <td class="header-logo-cell">
                @if(!empty($company->logo_path) && file_exists(public_path('storage/' . $company->logo_path)))
                    <img src="{{ public_path('storage/' . $company->logo_path) }}" class="logo-img" alt="Logo">
                @else
                    <div class="brand-title">GOSIKA <span>OFFICE</span></div>
                @endif
                <div class="company-legal">
                    <strong>{{ $company->company_name ?? 'GOSIKA Pvt. Ltd.' }}</strong> &bull; Reg: {{ $company->registration_no ?? 'REG-284910/080/081' }} &bull; PAN/VAT: {{ $company->pan_vat_no ?? '612093845' }}<br>
                    {{ $company->address ?? 'Corporate Tower, Level 4, Tinkune' }}, {{ $company->city ?? 'Kathmandu' }}, {{ $company->country ?? 'Nepal' }}<br>
                    Tel: {{ $company->phone ?? '+977-1-4567890' }} &bull; Email: {{ $company->email ?? 'office@gosika.com' }} &bull; Web: {{ $company->website ?? 'https://gosika.com' }}
                </div>
            </td>
            <td class="header-meta-cell">
                <div class="report-badge">HR DIRECTORY AUDIT REPORT</div>
                <div class="report-meta">
                    <strong>Ref No:</strong> GSK-HR-DIR-{{ Carbon\Carbon::now()->format('Ymd') }}<br>
                    <strong>Fiscal Year:</strong> {{ $company->fiscal_year ?? '2081/2082' }}<br>
                    <strong>Date & Time Generated:</strong> {{ Carbon\Carbon::now()->format('Y-m-d H:i:s') }}<br>
                    <strong>Classification:</strong> CONFIDENTIAL - INTERNAL USE
                </div>
            </td>
        </tr>
    </table>

    <!-- Quick Summary KPIs -->
    <table class="kpi-table">
        <tr>
            <td class="kpi-card">
                <div class="kpi-val">{{ count($employees) }}</div>
                <div class="kpi-lbl">Total Registered Employees</div>
            </td>
            <td class="kpi-card">
                <div class="kpi-val" style="color: #059669;">{{ $employees->where('status', 'active')->count() }}</div>
                <div class="kpi-lbl">Active Workforce</div>
            </td>
            <td class="kpi-card">
                <div class="kpi-val">{{ $employees->pluck('department_id')->unique()->count() }}</div>
                <div class="kpi-lbl">Operating Departments</div>
            </td>
            <td class="kpi-card">
                <div class="kpi-val" style="color: #FF5500;">NPR {{ number_format($employees->where('status', 'active')->sum('basic_salary'), 2) }}</div>
                <div class="kpi-lbl">Total Monthly Basic Payroll</div>
            </td>
        </tr>
    </table>

    <!-- Main Employee Table -->
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 10%;">EMPLOYEE ID</th>
                <th style="width: 16%;">FULL NAME</th>
                <th style="width: 12%;">DEPARTMENT</th>
                <th style="width: 14%;">DESIGNATION</th>
                <th style="width: 16%;">OFFICIAL EMAIL</th>
                <th style="width: 10%;">PHONE</th>
                <th style="width: 8%;">JOINED</th>
                <th style="width: 8%; text-align: right;">BASIC (NPR)</th>
                <th style="width: 6%; text-align: center;">STATUS</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($employees as $emp)
            <tr>
                <td><span class="code-pill">{{ $emp->employee_code }}</span></td>
                <td class="emp-name">{{ $emp->full_name }}</td>
                <td>{{ $emp->department->name ?? 'N/A' }}</td>
                <td>{{ $emp->designation->title ?? 'N/A' }}</td>
                <td>{{ $emp->email }}</td>
                <td>{{ $emp->phone }}</td>
                <td>{{ $emp->joining_date ? $emp->joining_date->format('Y-m-d') : '—' }}</td>
                <td class="num-col">{{ number_format($emp->basic_salary, 2) }}</td>
                <td style="text-align: center;">
                    <span style="font-weight: 800; font-size: 6.5pt; color: {{ $emp->status === 'active' ? '#059669' : ($emp->status === 'on_leave' ? '#D97706' : '#DC2626') }};">
                        {{ strtoupper($emp->status) }}
                    </span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Formal Signatory Block -->
    <table class="sign-table">
        <tr>
            <td class="sign-cell">
                <div class="sign-line"></div>
                <div class="sign-title">Prepared By</div>
                <div class="sign-sub">Human Resources Executive</div>
            </td>
            <td class="sign-cell">
                <div class="sign-line"></div>
                <div class="sign-title">Verified By</div>
                <div class="sign-sub">Finance & Accounts Head</div>
            </td>
            <td class="sign-cell">
                @if(!empty($company->stamp_signature_path) && file_exists(public_path('storage/' . $company->stamp_signature_path)))
                    <img src="{{ public_path('storage/' . $company->stamp_signature_path) }}" style="max-height: 32px; display: block; margin: 0 auto -10px auto;" alt="Stamp">
                @endif
                <div class="sign-line"></div>
                <div class="sign-title">Approved By</div>
                <div class="sign-sub">Managing Director / Administrator</div>
            </td>
        </tr>
    </table>

    <!-- Footer Note -->
    <div class="footer-note">
        <div class="footer-left">
            This document is computer-generated from the official {{ $company->trading_name ?? 'GOSIKA' }} Office Management System database.
        </div>
        <div class="footer-right">
            Strictly Confidential
        </div>
    </div>

</body>
</html>
