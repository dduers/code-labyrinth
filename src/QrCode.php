<?php

declare(strict_types=1);

namespace Dduers\CodeLabyrinth;

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel\ErrorCorrectionLevelHigh;
use Endroid\QrCode\Label\Alignment\LabelAlignmentCenter;
use Endroid\QrCode\Label\Font\NotoSans;
use Endroid\QrCode\RoundBlockSizeMode\RoundBlockSizeModeMargin;
use Endroid\QrCode\Writer\PngWriter;

class QrCode
{
    function __construct()
    {
    }

    /**
     * create qr code
     */
    function createCode()
    {
        return Builder::create()
            ->writer(new PngWriter())
            ->writerOptions([])
            ->data($this->generateRandomString(rand(5, 25)))
            ->encoding(new Encoding('UTF-8'))
            ->errorCorrectionLevel(new ErrorCorrectionLevelHigh())
            ->size(1000)
            ->margin(0)
            ->roundBlockSizeMode(new RoundBlockSizeModeMargin())
            //->logoPath(__DIR__ . '/assets/symfony.png')
            ->labelText('')
            ->labelFont(new NotoSans(14))
            ->labelAlignment(new LabelAlignmentCenter())
            ->build();
    }

    /**
     * generate random string
     */
    private function generateRandomString(int $bytes): string
    {
        return bin2hex(random_bytes($bytes));
    }
}
