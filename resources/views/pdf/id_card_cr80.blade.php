<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Employee ID Card - {{ $employee->employee_code }}</title>
    <style>
        @page {
            margin: 0;
            size: 242.65pt 153.01pt;
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }
        body {
            background-color: #ffffff;
            color: #202124;
            -webkit-print-color-adjust: exact;
        }
        .card {
            width: 242.65pt;
            height: 151pt;
            position: relative;
            overflow: hidden;
            background: #ffffff;
            page-break-inside: avoid;
            page-break-after: always;
        }
        .card:last-child {
            page-break-after: avoid;
        }

        /* Top Accent Bar */
        .top-accent {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4pt;
            background: #FF5500;
        }

        /* Lanyard Slot Guide */
        .lanyard-slot {
            display: none;
            margin: 8pt auto 4pt auto;
            width: 24pt;
            height: 3pt;
            border-radius: 2pt;
            background: #E5E7EB;
            border: 0.5pt dashed #9CA3AF;
        }

        /* Header / Logo */
        .header {
            text-align: left;
            padding: 2pt 4pt 4pt 4pt;
        }
        .logo-img {
            max-height: 16pt;
            max-width: 60pt;
            margin-bottom: 1pt;
        }
        .company-name {
            font-size: 8.5pt;
            font-weight: 800;
            color: #202124;
            letter-spacing: -0.3px;
        }
        .company-name span {
            color: #FF5500;
        }
        .company-sub {
            font-size: 3.8pt;
            font-weight: 700;
            color: #6B7280;
            letter-spacing: 0.8px;
            text-transform: uppercase;
        }

        /* Photo Section */
        .photo-wrap {
            position: absolute;
            top: 31pt;
            right: 12pt;
            margin: 0;
        }
        .photo-box {
            display: inline-block;
            width: 46pt;
            height: 58pt;
            border-radius: 4pt;
            border: 1.5pt solid #FF5500;
            overflow: hidden;
            background: #FFF0E8;
            box-shadow: 0 1pt 3pt rgba(0,0,0,0.08);
        }
        .photo-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        .photo-initials {
            width: 100%;
            height: 100%;
            line-height: 56pt;
            font-size: 18pt;
            font-weight: 800;
            color: #FF5500;
            text-align: center;
            background: #FFF0E8;
        }

        /* Identity Details */
        .identity {
            width: 158pt;
            text-align: left;
            padding: 2pt 4pt;
            margin-top: 5pt;
        }
        .emp-name {
            font-size: 8.5pt;
            font-weight: 800;
            color: #202124;
            line-height: 1.1;
            margin-bottom: 1.5pt;
        }
        .emp-designation {
            font-size: 5.5pt;
            font-weight: 700;
            color: #FF5500;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            margin-bottom: 3pt;
        }
        .dept-pill {
            display: inline-block;
            background: #F3F4F6;
            color: #374151;
            font-size: 4.5pt;
            font-weight: 600;
            padding: 1.5pt 5pt;
            border-radius: 6pt;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            margin-bottom: 5pt;
        }

        /* Compact Info Table */
        .info-table {
            width: 64%;
            margin: 7pt 0 4pt 4pt;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 1pt 0;
            vertical-align: middle;
        }
        .info-lbl {
            font-size: 4.5pt;
            font-weight: 700;
            color: #6B7280;
            text-transform: uppercase;
            width: 45%;
        }
        .info-val {
            font-size: 4.8pt;
            font-weight: 800;
            color: #202124;
            text-align: right;
            width: 55%;
        }

        /* QR Code & Token */
        .qr-section {
            position: absolute;
            right: 15pt;
            bottom: 20pt;
            text-align: center;
            margin-top: 0;
        }
        .qr-img {
            width: 28pt;
            height: 28pt;
            background: #ffffff;
            border: 0.5pt solid #E5E7EB;
            border-radius: 2pt;
            padding: 1pt;
            display: inline-block;
        }
        .qr-caption {
            font-size: 3.5pt;
            color: #9CA3AF;
            letter-spacing: 0.3px;
            text-transform: uppercase;
            margin-top: 1pt;
        }

        /* Footer */
        .footer-banner {
            position: absolute;
            bottom: 2pt;
            left: 0;
            right: 0;
            height: 10pt;
            background: #202124;
            color: #ffffff;
            text-align: center;
            line-height: 10pt;
            font-size: 4.5pt;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        /* BACK SIDE SPECIFIC */
        .back-body {
            position: relative;
            height: 92pt;
            padding: 9pt 10pt 16pt 10pt;
            text-align: left;
        }
        .back-title {
            font-size: 6.5pt;
            font-weight: 800;
            color: #202124;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            margin-bottom: 2pt;
        }
        .back-subtitle {
            font-size: 4.5pt;
            color: #6B7280;
            margin-bottom: 8pt;
        }
        .terms-box {
            background: #F9FAFB;
            border: 0.5pt solid #E5E7EB;
            border-radius: 3pt;
            padding: 4pt 5pt;
            text-align: left;
            width: 128pt;
            margin-top: 5pt;
        }
        .terms-item {
            font-size: 4pt;
            color: #4B5563;
            line-height: 1.35;
            margin-bottom: 2.5pt;
        }
        .contact-box {
            position: absolute;
            top: 29pt;
            right: 10pt;
            width: 78pt;
            font-size: 4.2pt;
            color: #374151;
            line-height: 1.35;
            margin-bottom: 0;
        }
        .contact-box strong {
            color: #202124;
            display: block;
            margin-bottom: 1pt;
            font-size: 4.5pt;
        }
        .sig-block {
            position: absolute;
            right: 14pt;
            bottom: 22pt;
            width: 68pt;
            text-align: center;
        }
        .sig-img {
            max-height: 18pt;
            max-width: 50pt;
            margin: 0 auto;
            display: block;
        }
        .sig-line {
            width: 70pt;
            border-top: 0.8pt solid #202124;
            margin: 2pt auto 1pt auto;
        }
        .sig-caption {
            font-size: 4pt;
            font-weight: 700;
            color: #6B7280;
            text-transform: uppercase;
        }
        .disclaimer {
            position: absolute;
            left: 10pt;
            bottom: 14pt;
            width: 125pt;
            font-size: 3.5pt;
            color: #9CA3AF;
            line-height: 1.25;
        }
        @include('pdf.partials.document_styles')
    </style>
</head>
<body>

    <!-- FRONT SIDE (LANDSCAPE CR80) -->
    <div class="card">
        <div class="top-accent"></div>
        <div class="lanyard-slot"></div>

        <div class="header">
            @if(!empty($company->logo_path) && file_exists(public_path('storage/' . $company->logo_path)))
                <img src="{{ public_path('storage/' . $company->logo_path) }}" class="logo-img" alt="Logo">
            @else
                <div class="company-name">GOSIKA <span>OFFICE</span></div>
                <div class="company-sub">Official Employee Identity</div>
            @endif
        </div>

        <div class="photo-wrap">
            <div class="photo-box">
                @if(!empty($employee->photo_path) && file_exists(public_path('storage/' . $employee->photo_path)))
                    <img src="{{ public_path('storage/' . $employee->photo_path) }}" class="photo-img" alt="{{ $employee->full_name }}">
                @else
                    <div class="photo-initials">{{ strtoupper(substr($employee->first_name, 0, 1) . substr($employee->last_name, 0, 1)) }}</div>
                @endif
            </div>
        </div>

        <div class="identity">
            <div class="emp-name">{{ $employee->full_name }}</div>
            <div class="emp-designation">{{ $employee->designation->title ?? 'Staff Member' }}</div>
            <div class="dept-pill">{{ $employee->department->name ?? 'General' }}</div>
        </div>

        <table class="info-table">
            <tr>
                <td class="info-lbl">EMP ID:</td>
                <td class="info-val">{{ $employee->employee_code }}</td>
            </tr>
            @if(!empty($employee->blood_group))
            <tr>
                <td class="info-lbl">BLOOD GRP:</td>
                <td class="info-val">{{ $employee->blood_group }}</td>
            </tr>
            @endif
            <tr>
                <td class="info-lbl">JOINED:</td>
                <td class="info-val">{{ $employee->joining_date ? $employee->joining_date->format('M Y') : '—' }}</td>
            </tr>
        </table>

        <div class="qr-section">
            <img src="{{ $qrCodeUri }}" class="qr-img" alt="QR Code">
            <div class="qr-caption">Scan to Verify Identity</div>
        </div>

        <div class="footer-banner">
            {{ $company->website ?? 'https://gosika.com' }}
        </div>
    </div>

    <!-- BACK SIDE (LANDSCAPE CR80) -->
    <div class="card">
        <div class="top-accent"></div>
        <div class="lanyard-slot"></div>

        <div class="back-body">
            <div class="back-title">Property of {{ $company->trading_name ?? 'GOSIKA' }}</div>
            <div class="back-subtitle">Please return if found</div>

            <div class="terms-box">
                <div class="terms-item">&bull; This badge is strictly non-transferable and remains company property.</div>
                <div class="terms-item">&bull; Must be worn and clearly visible at all times within office premises.</div>
                <div class="terms-item">&bull; Report loss, theft, or damage immediately to HR Administration.</div>
                <div class="terms-item">&bull; Must be surrendered upon resignation, termination, or request.</div>
            </div>

            <div class="contact-box">
                <strong>{{ $company->company_name ?? 'GOSIKA Pvt. Ltd.' }}</strong>
                @if($company->address) {{ $company->address }}<br> @endif
                @if($company->city || $company->country) {{ $company->city }}@if($company->city && $company->country), @endif{{ $company->country }}<br> @endif
                Tel: {{ $company->phone ?? '+977-1-4567890' }}<br>
                Email: {{ $company->email ?? 'hr@gosika.com' }}
            </div>

            <div class="sig-block">
                @if(!empty($company->stamp_signature_path) && file_exists(public_path('storage/' . $company->stamp_signature_path)))
                    <img src="{{ public_path('storage/' . $company->stamp_signature_path) }}" class="sig-img" alt="Signature">
                @else
                    <div style="height: 14pt;"></div>
                @endif
                <div class="sig-line"></div>
                <div class="sig-caption">Authorized Signatory</div>
            </div>

            <div class="disclaimer">
                Card No: GSK-IDC-{{ substr($employee->employee_code, -4) }}<br>
                Security Token: {{ substr($employee->qr_token, 0, 12) }}...
            </div>
        </div>

        <div class="footer-banner" style="background: #FF5500;">
            OFFICIAL COMPANY RECORD
        </div>
    </div>

</body>
</html>
