<?php

declare(strict_types=1);
require '../../vendor/autoload.php';

use Dduers\CodeLabyrinth\QrCode;

$code = new QrCode();
$result = $code->createCode();

// direct output
header('Content-Type: ' . $result->getMimeType());
echo $result->getString();
// Generate a data URI to include image data inline (i.e. inside an <img> tag)
//$dataUri = $result->getDataUri();
