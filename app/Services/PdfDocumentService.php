<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;

class PdfDocumentService
{
    public function render(string $view, array $data, string|array $paper = 'a4', string $orientation = 'portrait')
    {
        $pdf = Pdf::loadView($view, $data)
            ->setPaper($paper, $orientation)
            ->setOption('defaultFont', 'DejaVu Sans')
            ->setOption('dpi', 96)
            ->setOption('isHtml5ParserEnabled', true)
            ->setOption('isRemoteEnabled', true);

        if ($paper === 'a4') {
            $pdf->getDomPDF()->setCallbacks([
                [
                    'event' => 'end_document',
                    'f' => static function ($pageNumber, $pageCount, $canvas, $fontMetrics): void {
                        $canvas->page_text(
                            $canvas->get_width() - 88,
                            $canvas->get_height() - 15,
                            'Page {PAGE_NUM} of {PAGE_COUNT}',
                            $fontMetrics->getFont('DejaVu Sans', 'normal'),
                            7,
                            [107, 114, 128]
                        );
                    },
                ],
            ]);
        }

        return $pdf;
    }
}
