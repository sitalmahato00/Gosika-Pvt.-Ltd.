<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Financial Statement - {{ $company->trading_name ?? 'GOSIKA' }}</title>
    <style>
        @page {
            margin: 18mm 14mm 16mm 14mm;
            size: A4 portrait;
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }
        body {
            color: #202124;
            font-size: 8.5pt;
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
            font-size: 9.5pt;
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

        /* Summary KPIs */
        .kpi-table {
            width: 100%;
            margin-bottom: 14px;
            border-collapse: separate;
            border-spacing: 8px 0;
        }
        .kpi-card {
            background: #F9FAFB;
            border: 1px solid #E5E7EB;
            border-radius: 6px;
            padding: 8px 12px;
            text-align: center;
        }
        .kpi-val {
            font-size: 11.5pt;
            font-weight: 800;
            color: #202124;
        }
        .kpi-lbl {
            font-size: 6.5pt;
            color: #6B7280;
            text-transform: uppercase;
            font-weight: 700;
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
            padding: 6px 8px;
            font-size: 7.5pt;
            border-bottom: 1px solid #E5E7EB;
            vertical-align: middle;
        }
        .data-table tr:nth-child(even) td {
            background-color: #F9FAFB;
        }
        .num-col {
            text-align: right;
            font-family: monospace;
            font-weight: 700;
        }

        /* Signatory */
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
                    <strong>{{ $company->company_name ?? 'GOSIKA Pvt. Ltd.' }}</strong> &bull; PAN/VAT: {{ $company->pan_vat_no ?? '612093845' }}<br>
                    {{ $company->address ?? 'Corporate Tower, Level 4, Tinkune' }}, {{ $company->city ?? 'Kathmandu' }}, {{ $company->country ?? 'Nepal' }}<br>
                    Tel: {{ $company->phone ?? '+977-1-4567890' }} &bull; Email: {{ $company->email ?? 'finance@gosika.com' }}
                </div>
            </td>
            <td class="header-meta-cell">
                <div class="report-badge">STATEMENT OF INCOME & EXPENDITURE</div>
                <div class="report-meta">
                    <strong>Reporting Period:</strong> {{ $periodName ?? $company->fiscal_year }}<br>
                    <strong>Generated:</strong> {{ Carbon\Carbon::now()->format('Y-m-d H:i:s') }}<br>
                    <strong>Currency:</strong> NPR (Nepalese Rupee)
                </div>
            </td>
        </tr>
    </table>

    <!-- Executive Summary KPIs -->
    <table class="kpi-table">
        <tr>
            <td class="kpi-card">
                <div class="kpi-val" style="color: #059669;">NPR {{ number_format($totalIncome ?? 0, 2) }}</div>
                <div class="kpi-lbl">Total Recorded Income</div>
            </td>
            <td class="kpi-card">
                <div class="kpi-val" style="color: #DC2626;">NPR {{ number_format($totalExpense ?? 0, 2) }}</div>
                <div class="kpi-lbl">Total Corporate Expenses</div>
            </td>
            <td class="kpi-card">
                @php $net = ($totalIncome ?? 0) - ($totalExpense ?? 0); @endphp
                <div class="kpi-val" style="color: {{ $net >= 0 ? '#059669' : '#DC2626' }};">
                    NPR {{ number_format($net, 2) }}
                </div>
                <div class="kpi-lbl">Net Corporate Balance</div>
            </td>
        </tr>
    </table>

    <!-- Financial Statement Table -->
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 12%;">TYPE</th>
                <th style="width: 15%;">TRANSACTION REF</th>
                <th style="width: 12%;">DATE</th>
                <th style="width: 25%;">ACCOUNT / DESCRIPTION</th>
                <th style="width: 18%;">CATEGORY</th>
                <th style="width: 18%; text-align: right;">AMOUNT (NPR)</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($transactions ?? [] as $trx)
            <tr>
                <td>
                    <span style="font-weight: 800; font-size: 6.8pt; color: {{ ($trx['type'] ?? '') === 'income' ? '#059669' : '#DC2626' }};">
                        {{ strtoupper($trx['type'] ?? 'RECORD') }}
                    </span>
                </td>
                <td style="font-family: monospace; font-weight: 700;">{{ $trx['ref'] ?? '—' }}</td>
                <td>{{ $trx['date'] ?? '—' }}</td>
                <td><strong>{{ $trx['title'] ?? '—' }}</strong></td>
                <td>{{ $trx['category'] ?? 'General' }}</td>
                <td class="num-col" style="color: {{ ($trx['type'] ?? '') === 'income' ? '#059669' : '#DC2626' }};">
                    {{ number_format($trx['amount'] ?? 0, 2) }}
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
                <div class="sign-sub">Senior Finance Officer</div>
            </td>
            <td class="sign-cell">
                <div class="sign-line"></div>
                <div class="sign-title">Verified By</div>
                <div class="sign-sub">Internal Audit Supervisor</div>
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
            Certified financial summary generated from the official {{ $company->trading_name ?? 'GOSIKA' }} database.
        </div>
        <div class="footer-right">
            Confidential Financial Statement
        </div>
    </div>

</body>
</html>
