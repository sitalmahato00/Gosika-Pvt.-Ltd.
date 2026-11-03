<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Payroll Slips - {{ $period }}</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 11mm 12mm;
        }
        .slip {
            page-break-after: always;
        }
        .slip:last-child {
            page-break-after: avoid;
        }
        @include('pdf.partials.salary_slip_styles')
    </style>
</head>
<body>
    @foreach($salaries as $salary)
        <section class="slip">
            @include('pdf.partials.salary_slip_content', ['salary' => $salary, 'company' => $company])
        </section>
    @endforeach
</body>
</html>
