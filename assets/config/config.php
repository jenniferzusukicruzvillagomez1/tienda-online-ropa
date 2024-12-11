<?php
define("CLIENT_ID", "AR3Kb9SznCvYsbX6noe-5BDLSRVZFSpzO0PtkNy8LZyU_-aA7yIkM92C2Ga3Yw2ewq8WoGuhQWXralYK");
define("CURRENCY", "MXN");
define("KEY_TOKEN", "APR.wqc-354*");
define("MONEDA", "$");

if (session_status() === PHP_SESSION_NONE) {
    session_start();

    // $num_cart = 0;
    if(isset( $_SESSION['carrito']['productos'])){
        $num_cart = count( $_SESSION['carrito']['productos']);
    }

}
?>
