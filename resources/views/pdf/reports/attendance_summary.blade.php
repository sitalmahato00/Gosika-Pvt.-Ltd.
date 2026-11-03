<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Attendance Summary Report - {{ $company->trading_name ?? 'GOSIKA' }}</title>
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

        /* Corporate Letterhead */
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
        }

        /* Data Table */
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
        .cnt-col {
            text-align: center;
            font-weight: 700;
            font-family: monospace;
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
                    Tel: {{ $company->phone ?? '+977-1-4567890' }} &bull; Email: {{ $company->email ?? 'office@gosika.com' }}
                </div>
            </td>
            <td class="header-meta-cell">
                <div class="report-badge">MONTHLY ATTENDANCE AUDIT LEDGER</div>
                <div class="report-meta">
                    <strong>Period:</strong> {{ $monthName ?? Carbon\Carbon::now()->format('F Y') }}<br>
                    <strong>Fiscal Year:</strong> {{ $company->fiscal_year ?? '2081/2082' }}<br>
                    <strong>Date & Time Generated:</strong> {{ Carbon\Carbon::now()->format('Y-m-d H:i:s') }}<br>
                    <strong>Classification:</strong> OFFICIAL CORPORATE AUDIT
                </div>
            </td>
        </tr>
    </table>

    <!-- Quick Attendance Metrics -->
    @php
        $totalPresent = array_sum(array_column($summary, 'present'));
        $totalLate = array_sum(array_column($summary, 'late'));
        $totalHalf = array_sum(array_column($summary, 'half_day'));
        $totalAbsent = array_sum(array_column($summary, 'absent_leave'));
        $totalHours = array_sum(array_column($summary, 'total_hours'));
    @endphp
    <table class="kpi-table">
        <tr>
            <td class="kpi-card">
                <div class="kpi-val">{{ count($summary) }}</div>
                <div class="kpi-lbl">Total Audited Employees</div>
            </td>
            <td class="kpi-card">
                <div class="kpi-val" style="color: #059669;">{{ $totalPresent }}</div>
                <div class="kpi-lbl">Total Present Days</div>
            </td>
            <td class="kpi-card">
                <div class="kpi-val" style="color: #D97706;">{{ $totalLate }}</div>
                <div class="kpi-lbl">Total Late Markings</div>
            </td>
            <td class="kpi-card">
                <div class="kpi-val" style="color: #2563EB;">{{ $totalHalf }}</div>
                <div class="kpi-lbl">Total Half Days</div>
            </td>
            <td class="kpi-card">
                <div class="kpi-val" style="color: #DC2626;">{{ $totalAbsent }}</div>
                <div class="kpi-lbl">Leaves & Absences</div>
            </td>
            <td class="kpi-card">
                <div class="kpi-val" style="color: #FF5500;">{{ number_format($totalHours, 1) }}h</div>
                <div class="kpi-lbl">Cumulative Hours Logged</div>
            </td>
        </tr>
    </table>

    <!-- Main Attendance Table -->
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 12%;">EMP CODE</th>
                <th style="width: 24%;">EMPLOYEE FULL NAME</th>
                <th style="width: 16%;">DEPARTMENT</th>
                <th class="cnt-col" style="width: 9%;">PRESENT</th>
                <th class="cnt-col" style="width: 9%;">LATE</th>
                <th class="cnt-col" style="width: 9%;">HALF DAY</th>
                <th class="cnt-col" style="width: 9%;">ABSENT / LEAVE</th>
                <th class="cnt-col" style="width: 12%;">LOGGED HOURS</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($summary as $row)
            <tr>
                <td><span class="code-pill">{{ $row['employee']->employee_code }}</span></td>
                <td><strong>{{ $row['employee']->full_name }}</strong></td>
                <td>{{ $row['employee']->department->name ?? 'General' }}</td>
                <td class="cnt-col" style="color: #059669; font-weight: 800;">{{ $row['present'] }}</td>
                <td class="cnt-col" style="color: #D97706; font-weight: 800;">{{ $row['late'] }}</td>
                <td class="cnt-col" style="color: #2563EB; font-weight: 800;">{{ $row['half_day'] }}</td>
                <td class="cnt-col" style="color: #DC2626; font-weight: 800;">{{ $row['absent_leave'] }}</td>
                <td class="cnt-col" style="font-weight: 800;">{{ number_format($row['total_hours'], 1) }} hrs</td>
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
                <div class="sign-sub">Attendance Officer / HR Admin</div>
            </td>
            <td class="sign-cell">
                <div class="sign-line"></div>
                <div class="sign-title">Verified By</div>
                <div class="sign-sub">Operations Supervisor</div>
            </td>
            <td class="sign-cell">
                @if(!empty($company->stamp_signature_path) && file_exists(public_path('storage/' . $company->stamp_signature_path)))
                    <img src="{{ public_path('storage/' . $company->stamp_signature_path) }}" style="max-height: 32px; display: block; margin: 0 auto -10px auto;" alt="Stamp">
                @endif
                <div class="sign-line"></div>
                <div class="sign-title">Approved By</div>
                <div class="sign-sub">Managing Director</div>
            </td>
        </tr>
    </table>

    <div class="footer-note">
        <div class="footer-left">
            Official system attendance record &bull; {{ $company->trading_name ?? 'GOSIKA' }} HR Management Module
        </div>
        <div class="footer-right">
            Strictly Confidential
        </div>
    </div>

</body>
</html>
