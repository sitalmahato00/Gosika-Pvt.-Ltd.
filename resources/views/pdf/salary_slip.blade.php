<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Salary Slip - {{ $salary->slip_number }}</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 11mm 12mm;
        }
        @include('pdf.partials.salary_slip_styles')
    </style>
</head>
<body>
    @include('pdf.partials.salary_slip_content', ['salary' => $salary, 'company' => $company])
</body>
</html>
