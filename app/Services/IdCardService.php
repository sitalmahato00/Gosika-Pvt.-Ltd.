<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\CompanySetting;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class IdCardService
{
    public function __construct(private PdfDocumentService $documents)
    {
    }

    /**
     * Generate QR code as base64 SVG data URI for an employee.
     */
    public function generateQrCodeDataUri(Employee $employee): string
    {
        $verificationUrl = url("/verify-id/{$employee->qr_token}");
        $svg = QrCode::format('svg')
            ->size(120)
            ->errorCorrection('H')
            ->margin(1)
            ->color(32, 33, 36)
            ->generate($verificationUrl);

        return 'data:image/svg+xml;base64,' . base64_encode($svg);
    }

    /**
     * Render a landscape CR80 card (85.60 mm x 53.98 mm).
     */
    public function generateSinglePdf(Employee $employee, string $template = 'corporate_modern')
    {
        $company = CompanySetting::current();
        $qrCodeUri = $this->generateQrCodeDataUri($employee);

        return $this->documents->render('pdf.id_card_cr80', [
            'employee' => $employee,
            'company' => $company,
            'template' => $template,
            'qrCodeUri' => $qrCodeUri,
        ], [0, 0, 242.65, 153.01], 'landscape');
    }

    /**
     * Render A4 Sheet containing multiple ID cards with trim / cutting marks.
     */
    public function generateA4SheetPdf($employees, string $template = 'corporate_modern')
    {
        $company = CompanySetting::current();
        $cardsData = [];

        foreach ($employees as $employee) {
            $cardsData[] = [
                'employee' => $employee,
                'qrCodeUri' => $this->generateQrCodeDataUri($employee),
            ];
        }

        return $this->documents->render('pdf.id_cards_a4_sheet', [
            'cardsData' => $cardsData,
            'company' => $company,
            'template' => $template,
        ]);
    }
}
