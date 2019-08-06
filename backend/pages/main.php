<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title><?php echo PAGE_TITLE ?></title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel='stylesheet' type='text/css' media='screen' href='frontend/style/main.css'>
    <script src="https://kit.fontawesome.com/1cce40d0d5.js"></script>
  <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

    <script
  src="https://code.jquery.com/jquery-3.4.1.min.js"
  integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
  crossorigin="anonymous"></script>

</head>
<body>
    <?php include("backend/pages/header.php"); ?>
    
    <?php include("backend/pages/navigation.php"); ?>

    <?php include("backend/pages/static_index.php");?>

    <?php// include("backend/pages/footer.php"); ?>

    <script src='frontend/script/main.js'></script>
</body>
</html>