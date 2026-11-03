<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>GOSIKA Bulk Employee ID Cards Sheet (A4 Portrait)</title>
    <style>
        @page {
            margin: 12mm 14mm;
            size: A4 portrait;
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
        .sheet-header {
            text-align: center;
            margin-bottom: 12px;
            border-bottom: 2px solid #FF5500;
            padding-bottom: 6px;
        }
        .sheet-title {
            font-size: 13pt;
            font-weight: 800;
            color: #202124;
        }
        .sheet-sub {
            font-size: 7.5pt;
            color: #6B7280;
        }
        .cards-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }
        .cards-table td {
            padding: 2mm 0;
        }
        .card-box {
            width: 85.60mm;
            height: 53.98mm;
            border: 0.8pt dashed #9CA3AF;
            position: relative;
            background: #ffffff;
            margin: 0 auto;
            border-radius: 4pt;
            overflow: hidden;
            page-break-inside: avoid;
        }
        .top-accent {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4pt;
            background: #FF5500;
        }
        .header {
            position: absolute;
            top: 7pt;
            left: 8pt;
            text-align: left;
            padding: 0;
        }
        .company-name {
            font-size: 8pt;
            font-weight: 800;
            color: #202124;
        }
        .company-name span {
            color: #FF5500;
        }
        .company-sub {
            font-size: 3.5pt;
            font-weight: 700;
            color: #6B7280;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .photo-wrap {
            position: absolute;
            top: 29pt;
            left: 8pt;
            text-align: left;
            margin: 0;
        }
        .photo-box {
            display: inline-block;
            width: 40pt;
            height: 49pt;
            border-radius: 3pt;
            border: 1.2pt solid #FF5500;
            overflow: hidden;
            background: #FFF0E8;
        }
        .photo-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .photo-initials {
            width: 100%;
            height: 100%;
            line-height: 47pt;
            font-size: 15pt;
            font-weight: 800;
            color: #FF5500;
            text-align: center;
        }
        .identity {
            position: absolute;
            top: 29pt;
            left: 55pt;
            right: 7pt;
            text-align: left;
            padding: 0;
        }
        .emp-name {
            font-size: 7pt;
            font-weight: 800;
            color: #202124;
            line-height: 1.1;
        }
        .emp-designation {
            font-size: 4.5pt;
            font-weight: 700;
            color: #FF5500;
            text-transform: uppercase;
            margin: 1pt 0 2pt 0;
        }
        .dept-pill {
            display: block;
            width: 100pt;
            background: #F3F4F6;
            color: #374151;
            font-size: 4pt;
            font-weight: 600;
            padding: 1pt 4pt;
            border-radius: 4pt;
            text-transform: uppercase;
        }
        .info-table {
            position: absolute;
            left: 55pt;
            bottom: 16pt;
            width: 110pt;
            margin: 0;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 0.5pt 0;
            font-size: 4.2pt;
        }
        .info-lbl {
            font-weight: 700;
            color: #6B7280;
        }
        .info-val {
            font-weight: 800;
            color: #202124;
            text-align: right;
        }
        .qr-section {
            position: absolute;
            right: 8pt;
            bottom: 14pt;
            text-align: center;
            margin: 0;
        }
        .qr-img {
            width: 24pt;
            height: 24pt;
            background: #ffffff;
            border: 0.5pt solid #E5E7EB;
            padding: 1pt;
            display: inline-block;
        }
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
            font-size: 4pt;
            font-weight: 600;
        }
        @include('pdf.partials.document_styles')
    </style>
</head>
<body>

    <div class="sheet-header">
        <div class="sheet-title">GOSIKA &bull; Employee ID Cards Print Sheet</div>
        <div class="sheet-sub">Standard CR80 Landscape Badges (85.60mm &times; 53.98mm) &bull; Crop along dashed guides</div>
    </div>

    <table class="cards-table">
        @foreach(array_chunk($cardsData, 2) as $row)
        <tr>
            @foreach($row as $card)
            @php $emp = $card['employee']; @endphp
            <td style="vertical-align: top; text-align: center; width: 50%;">
                <div class="card-box">
                    <div class="top-accent"></div>
                    <div class="header">
                        @if(!empty($company->logo_path) && file_exists(public_path('storage/' . $company->logo_path)))
                            <img src="{{ public_path('storage/' . $company->logo_path) }}" style="max-height: 12pt; max-width: 50pt;" alt="Logo">
                        @else
                            <div class="company-name">GOSIKA <span>OFFICE</span></div>
                            <div class="company-sub">Employee Identity</div>
                        @endif
                    </div>

                    <div class="photo-wrap">
                        <div class="photo-box">
                            @if(!empty($emp->photo_path) && file_exists(public_path('storage/' . $emp->photo_path)))
                                <img src="{{ public_path('storage/' . $emp->photo_path) }}" class="photo-img" alt="{{ $emp->full_name }}">
                            @else
                                <div class="photo-initials">{{ strtoupper(substr($emp->first_name, 0, 1) . substr($emp->last_name, 0, 1)) }}</div>
                            @endif
                        </div>
                    </div>

                    <div class="identity">
                        <div class="emp-name">{{ $emp->full_name }}</div>
                        <div class="emp-designation">{{ $emp->designation->title ?? 'Staff Member' }}</div>
                        <div class="dept-pill">{{ $emp->department->name ?? 'General' }}</div>
                    </div>

                    <table class="info-table">
                        <tr>
                            <td class="info-lbl">ID:</td>
                            <td class="info-val">{{ $emp->employee_code }}</td>
                        </tr>
                        @if(!empty($emp->blood_group))
                        <tr>
                            <td class="info-lbl">BLOOD:</td>
                            <td class="info-val">{{ $emp->blood_group }}</td>
                        </tr>
                        @endif
                    </table>

                    <div class="qr-section">
                        <img src="{{ $card['qrCodeUri'] }}" class="qr-img" alt="QR">
                    </div>

                    <div class="footer-banner">
                        {{ $company->website ?? 'https://gosika.com' }}
                    </div>
                </div>
            </td>
            @endforeach
            @for($i = count($row); $i < 2; $i++)
                <td style="width: 50%;"></td>
            @endfor
        </tr>
        @endforeach
    </table>

</body>
</html>
