<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Expense Audit Statement - {{ $company->trading_name ?? 'GOSIKA' }}</title>
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

        /* Table */
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
            padding: 5.5px 8px;
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
                <div class="report-badge">CORPORATE EXPENSE AUDIT STATEMENT</div>
                <div class="report-meta">
                    <strong>Date Range:</strong> {{ $dateRange ?? 'Full Historical Log' }}<br>
                    <strong>Fiscal Year:</strong> {{ $company->fiscal_year ?? '2081/2082' }}<br>
                    <strong>Generated:</strong> {{ Carbon\Carbon::now()->format('Y-m-d H:i:s') }}<br>
                    <strong>Currency:</strong> NPR (Nepalese Rupee)
                </div>
            </td>
        </tr>
    </table>

    <!-- Summary KPIs -->
    <table class="kpi-table">
        <tr>
            <td class="kpi-card">
                <div class="kpi-val">{{ count($expenses) }}</div>
                <div class="kpi-lbl">Total Expense Entries</div>
            </td>
            <td class="kpi-card">
                <div class="kpi-val" style="color: #FF5500;">NPR {{ number_format($totalAmount ?? $expenses->sum('amount'), 2) }}</div>
                <div class="kpi-lbl">Cumulative Expenses Audited</div>
            </td>
            <td class="kpi-card">
                <div class="kpi-val">{{ $expenses->pluck('category_id')->unique()->count() }}</div>
                <div class="kpi-lbl">Expense Categories Involved</div>
            </td>
        </tr>
    </table>

    <!-- Main Expense Table -->
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 14%;">EXPENSE VOUCHER</th>
                <th style="width: 11%;">DATE</th>
                <th style="width: 25%;">EXPENSE TITLE & DESCRIPTION</th>
                <th style="width: 16%;">CATEGORY</th>
                <th style="width: 14%;">PAYEE / VENDOR</th>
                <th style="width: 10%;">METHOD</th>
                <th style="width: 10%; text-align: right;">AMOUNT (NPR)</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($expenses as $exp)
            <tr>
                <td><span style="font-family: monospace; font-weight: 700;">{{ $exp->expense_number }}</span></td>
                <td>{{ $exp->date ? $exp->date->format('Y-m-d') : '—' }}</td>
                <td>
                    <strong>{{ $exp->title }}</strong>
                    @if($exp->description)
                        <div style="font-size: 6.8pt; color: #6B7280;">{{ $exp->description }}</div>
                    @endif
                </td>
                <td>{{ $exp->category->name ?? 'General' }}</td>
                <td>{{ $exp->payee }}</td>
                <td style="text-transform: capitalize;">{{ str_replace('_', ' ', $exp->payment_method) }}</td>
                <td class="num-col">{{ number_format($exp->amount, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr style="background: #FFF0E8; font-weight: 800; border-top: 2px solid #FF5500;">
                <td colspan="6" style="text-align: right; padding: 7px 8px; font-size: 8pt; color: #202124;">GRAND TOTAL EXPENSES:</td>
                <td class="num-col" style="color: #FF5500; font-size: 8.5pt;">NPR {{ number_format($totalAmount ?? $expenses->sum('amount'), 2) }}</td>
            </tr>
        </tfoot>
    </table>

    <!-- Formal Signatory Block -->
    <table class="sign-table">
        <tr>
            <td class="sign-cell">
                <div class="sign-line"></div>
                <div class="sign-title">Prepared By</div>
                <div class="sign-sub">Accounts Officer</div>
            </td>
            <td class="sign-cell">
                <div class="sign-line"></div>
                <div class="sign-title">Audited By</div>
                <div class="sign-sub">Chief Financial Officer</div>
            </td>
            <td class="sign-cell">
                @if(!empty($company->stamp_signature_path) && file_exists(public_path('storage/' . $company->stamp_signature_path)))
                    <img src="{{ public_path('storage/' . $company->stamp_signature_path) }}" style="max-height: 32px; display: block; margin: 0 auto -10px auto;" alt="Stamp">
                @endif
                <div class="sign-line"></div>
                <div class="sign-title">Authorized By</div>
                <div class="sign-sub">Managing Director</div>
            </td>
        </tr>
    </table>

    <div class="footer-note">
        <div class="footer-left">
            Certified official financial statement &bull; {{ $company->trading_name ?? 'GOSIKA' }} Internal Office Finance System
        </div>
        <div class="footer-right">
            Confidential Financial Audit
        </div>
    </div>

</body>
</html>
