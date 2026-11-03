@php
    $employee = $salary->employee;
    $accountNumber = $employee->bank_account_no ?? '';
    $maskedAccountNumber = $accountNumber === ''
        ? 'N/A'
        : str_repeat('*', max(0, strlen($accountNumber) - 4)) . substr($accountNumber, -4);
    $currency = $company->default_currency ?: 'NPR';
    $currencySymbol = $company->currency_symbol ?: $currency;
@endphp
<table class="header">
    <tr>
        <td class="brand-cell">
            @if($company->logo_path && file_exists(public_path('storage/' . $company->logo_path)))
                <img src="{{ public_path('storage/' . $company->logo_path) }}" class="logo" alt="Company logo">
            @else
                <span class="company-name">{{ $company->trading_name ?: $company->company_name }}</span>
            @endif
            <div class="company-details">
                <strong>{{ $company->company_name }}</strong><br>
                {{ $company->address }}{{ $company->city ? ', ' . $company->city : '' }}{{ $company->country ? ', ' . $company->country : '' }}<br>
                @if($company->phone) {{ $company->phone }} @endif
                @if($company->email) &nbsp;|&nbsp; {{ $company->email }} @endif
                @if($company->website) &nbsp;|&nbsp; {{ $company->website }} @endif
                @if($company->pan_vat_no)<br>PAN/VAT: {{ $company->pan_vat_no }}@endif
            </div>
        </td>
        <td class="title-cell">
            <span class="document-title">SALARY DISBURSEMENT SLIP</span>
            <div class="document-meta">
                <strong>Slip No:</strong> {{ $salary->slip_number }}<br>
                <strong>Period:</strong> {{ $salary->salary_period ?: sprintf('%02d/%d', $salary->month, $salary->year) }}<br>
                <strong>Payment Date:</strong> {{ $salary->payment_date ? $salary->payment_date->format('Y-m-d') : '—' }}
            </div>
        </td>
    </tr>
</table>

<table class="employee-card">
    <tr>
        @if($employee->photo_path && file_exists(public_path('storage/' . $employee->photo_path)))
            <td class="photo-cell">
                <img src="{{ public_path('storage/' . $employee->photo_path) }}" class="employee-photo" alt="Employee photo">
            </td>
        @endif
        <td class="details-cell">
            <table>
                <tr>
                    <td class="details-left">
                        <table>
                            <tr class="detail-row"><td class="detail-label">Employee Name</td><td class="detail-value">{{ $employee->full_name }}</td></tr>
                            <tr class="detail-row"><td class="detail-label">Employee Code</td><td class="detail-value">{{ $employee->employee_code }}</td></tr>
                            <tr class="detail-row"><td class="detail-label">Designation</td><td class="detail-value">{{ $employee->designation->title ?? 'Staff' }}</td></tr>
                            <tr class="detail-row"><td class="detail-label">Department</td><td class="detail-value">{{ $employee->department->name ?? 'General' }}</td></tr>
                        </table>
                    </td>
                    <td class="details-right">
                        <table>
                            <tr class="detail-row"><td class="detail-label">Bank Name</td><td class="detail-value">{{ $employee->bank_name ?: 'N/A' }}</td></tr>
                            <tr class="detail-row"><td class="detail-label">Account Number</td><td class="detail-value">{{ $maskedAccountNumber }}</td></tr>
                            <tr class="detail-row"><td class="detail-label">Payment Method</td><td class="detail-value">{{ strtoupper(str_replace('_', ' ', $salary->payment_method ?: 'N/A')) }}</td></tr>
                            <tr class="detail-row"><td class="detail-label">Status</td><td class="detail-value status">{{ strtoupper($salary->status) }}</td></tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<table class="breakdowns">
    <tr>
        <td class="breakdown-cell">
            <table class="breakdown-table">
                <thead><tr><th>EARNINGS</th><th class="amount">AMOUNT ({{ $currency }})</th></tr></thead>
                <tbody>
                    <tr><td>Basic Salary</td><td class="amount">{{ number_format((float) $salary->basic_salary, 2) }}</td></tr>
                    @if((float) $salary->allowances > 0)
                        <tr><td>Allowances &amp; Per Diem</td><td class="amount">{{ number_format((float) $salary->allowances, 2) }}</td></tr>
                    @endif
                    @if((float) $salary->bonuses > 0)
                        <tr><td>Bonus</td><td class="amount">{{ number_format((float) $salary->bonuses, 2) }}</td></tr>
                    @endif
                    <tr class="total-row"><td>GROSS EARNINGS</td><td class="amount">{{ number_format((float) $salary->gross_salary, 2) }}</td></tr>
                </tbody>
            </table>
        </td>
        <td class="breakdown-cell">
            <table class="breakdown-table">
                <thead><tr><th>DEDUCTIONS</th><th class="amount">AMOUNT ({{ $currency }})</th></tr></thead>
                <tbody>
                    @if((float) $salary->tax_deduction > 0)
                        <tr><td>Tax Deducted at Source (TDS)</td><td class="amount deduction">{{ number_format((float) $salary->tax_deduction, 2) }}</td></tr>
                    @endif
                    @if((float) $salary->provident_fund > 0)
                        <tr><td>Provident Fund / Social Security</td><td class="amount deduction">{{ number_format((float) $salary->provident_fund, 2) }}</td></tr>
                    @endif
                    @if((float) $salary->other_deductions > 0)
                        <tr><td>Other Deductions</td><td class="amount deduction">{{ number_format((float) $salary->other_deductions, 2) }}</td></tr>
                    @endif
                    <tr class="total-row"><td>TOTAL DEDUCTIONS</td><td class="amount deduction">{{ number_format((float) $salary->total_deductions, 2) }}</td></tr>
                </tbody>
            </table>
        </td>
    </tr>
</table>

<table class="net-pay">
    <tr>
        <td class="net-label-cell">
            <div class="net-label">NET SALARY PAYABLE</div>
            <div class="net-caption">
                Payment reference: {{ $salary->payment_reference ?: 'N/A' }}
                &nbsp;|&nbsp; This slip is generated from recorded payroll data.
            </div>
        </td>
        <td class="net-amount-cell">{{ $currencySymbol }} {{ number_format((float) $salary->net_salary, 2) }}</td>
    </tr>
</table>

<table class="footer">
    <tr>
        <td class="notes-cell">
            <strong>Important Notes</strong><br>
            Please contact HR if you have any questions about this salary statement.
        </td>
        <td class="signature-cell">
            @if($company->stamp_signature_path && file_exists(public_path('storage/' . $company->stamp_signature_path)))
                <img src="{{ public_path('storage/' . $company->stamp_signature_path) }}" class="signature-image" alt="Authorized signature">
            @endif
            <div class="signature-line"></div>
            <strong>Authorized Signature</strong><br>HR / Finance Department
        </td>
        <td class="acknowledgement-cell">
            <strong>Employee Acknowledgement</strong><br>
            I acknowledge receipt of this salary statement.<br>
            Signature: __________________ &nbsp; Date: __________
        </td>
    </tr>
</table>

<table class="footer-bar">
    <tr>
        <td class="footer-left">{{ $company->company_name }}@if($company->website) &nbsp;|&nbsp; {{ $company->website }}@endif</td>
        <td class="footer-center">Confidential — For Official Use Only</td>
        <td class="footer-right">Generated {{ now()->format('Y-m-d') }}</td>
    </tr>
</table>
