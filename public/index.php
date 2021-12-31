<?php

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code-Labyrinth</title>
</head>

<body>
    <canvas id="canvas" width="1000" height="1000"></canvas>

    <div id="status"></div><br>
    <div id="color" style="width:30px;height:30px;"></div>

    <script src="js/app.js"></script>
    <script>
        //drawImageFromWebUrl("<?= ''//$result->getDataUri() ?>");
        drawImageFromWebUrl("php/code.php");
    </script>
</body>

</html>