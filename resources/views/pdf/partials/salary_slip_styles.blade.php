        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'DejaVu Sans', Arial, sans-serif;
        }
        body {
            color: #202124;
            font-size: 8pt;
        }
        table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
        }
        td,
        th {
            overflow-wrap: break-word;
            word-wrap: break-word;
        }
        .header {
            border-bottom: 2px solid #FF5500;
            margin-bottom: 10px;
        }
        .brand-cell {
            width: 56%;
            padding: 0 8px 8px 0;
            vertical-align: middle;
        }
        .title-cell {
            width: 44%;
            padding: 0 0 8px 8px;
            text-align: right;
            vertical-align: middle;
        }
        .logo {
            max-width: 108px;
            max-height: 36px;
            margin: 0 8px 0 0;
            vertical-align: middle;
        }
        .company-name {
            color: #202124;
            font-size: 15pt;
            font-weight: bold;
        }
        .company-details {
            margin-top: 4px;
            color: #4B5563;
            font-size: 7pt;
            line-height: 1.4;
        }
        .document-title {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 6px;
            background: #FF5500;
            color: #FFFFFF;
            font-size: 13pt;
            font-weight: bold;
        }
        .document-meta {
            margin-top: 5px;
            color: #374151;
            font-size: 8pt;
            line-height: 1.5;
        }
        .employee-card {
            margin-bottom: 10px;
            border: 1px solid #DDE1E6;
            border-radius: 8px;
            background: #F5F6F8;
            page-break-inside: avoid;
        }
        .photo-cell {
            width: 16%;
            padding: 8px 10px;
            vertical-align: middle;
        }
        .details-cell {
            width: 84%;
            padding: 8px 10px;
            vertical-align: middle;
        }
        .employee-photo {
            width: 86px;
            height: 88px;
            border: 1px solid #DDE1E6;
            object-fit: cover;
        }
        .details-left {
            width: 50%;
            padding-right: 12px;
            border-right: 1px solid #D1D5DB;
            vertical-align: top;
        }
        .details-right {
            width: 50%;
            padding-left: 16px;
            vertical-align: top;
        }
        .detail-row {
            padding: 3px 0;
        }
        .detail-label {
            width: 38%;
            color: #4B5563;
        }
        .detail-value {
            color: #202124;
            font-weight: bold;
        }
        .status {
            color: #059669;
        }
        .breakdowns {
            margin-bottom: 10px;
        }
        .breakdown-cell {
            width: 50%;
            vertical-align: top;
        }
        .breakdown-cell:first-child {
            padding-right: 6px;
        }
        .breakdown-cell:last-child {
            padding-left: 6px;
        }
        .breakdown-table {
            border: 1px solid #DDE1E6;
            border-radius: 6px;
        }
        .breakdown-table th {
            padding: 7px 9px;
            background: #FF5500;
            color: #FFFFFF;
            font-size: 8pt;
            text-align: left;
        }
        .breakdown-table th.amount,
        .breakdown-table td.amount {
            width: 36%;
            text-align: right;
            white-space: nowrap;
        }
        .breakdown-table td {
            padding: 6px 9px;
            border-bottom: 1px solid #DDE1E6;
        }
        .breakdown-table tr:last-child td {
            border-bottom: 0;
        }
        .amount {
            font-family: 'DejaVu Sans Mono', monospace;
            font-variant-numeric: tabular-nums;
        }
        .total-row td {
            background: #FFF0E8;
            font-weight: bold;
        }
        .deduction {
            color: #B91C1C;
        }
        .net-pay {
            margin-bottom: 9px;
            border: 1px solid #FF5500;
            border-radius: 8px;
            background: #FFF0E8;
        }
        .net-label-cell {
            width: 56%;
            padding: 10px 14px;
            vertical-align: middle;
        }
        .net-label {
            color: #202124;
            font-size: 13pt;
            font-weight: bold;
        }
        .net-caption {
            margin-top: 3px;
            color: #4B5563;
            font-size: 7pt;
        }
        .net-amount-cell {
            width: 44%;
            padding: 9px 13px;
            border-radius: 7px;
            background: #FF5500;
            color: #FFFFFF;
            font-family: 'DejaVu Sans Mono', monospace;
            font-size: 19pt;
            font-weight: bold;
            text-align: right;
            white-space: nowrap;
        }
        .footer {
            border-top: 1px solid #FF5500;
            color: #4B5563;
            font-size: 7pt;
        }
        .notes-cell {
            width: 38%;
            padding: 7px 10px 0 0;
            vertical-align: top;
            line-height: 1.5;
        }
        .signature-cell {
            width: 31%;
            padding: 7px 10px 0;
            border-left: 1px solid #DDE1E6;
            text-align: center;
            vertical-align: top;
        }
        .signature-image {
            display: block;
            max-width: 80px;
            max-height: 28px;
            margin: 0 auto 2px;
        }
        .signature-line {
            width: 72%;
            margin: 17px auto 3px;
            border-top: 1px solid #6B7280;
        }
        .acknowledgement-cell {
            width: 31%;
            padding: 7px 0 0 10px;
            border-left: 1px solid #DDE1E6;
            vertical-align: top;
            line-height: 1.5;
        }
        .footer-bar {
            margin-top: 8px;
            padding: 6px 8px;
            background: #202124;
            color: #FFFFFF;
            font-size: 7pt;
        }
        .footer-left {
            width: 33%;
            text-align: left;
        }
        .footer-center {
            width: 34%;
            text-align: center;
        }
        .footer-right {
            width: 33%;
            text-align: right;
        }
