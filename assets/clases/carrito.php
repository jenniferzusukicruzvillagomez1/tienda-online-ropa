<?php
require_once '../config/config.php';
$datos = ['ok' => false];

if (isset($_POST['id']) && isset($_POST['token'])) {
    $id = $_POST['id'];
    $token = $_POST['token'];

    $token_tmp = hash_hmac('sha1', $id, KEY_TOKEN);

    // Verificación del token
    if ($token === $token_tmp) {
        if (!isset($_SESSION['carrito'])) {
            $_SESSION['carrito'] = ['productos' => []];
        }

        if (isset($_SESSION['carrito']['productos'][$id])) {
            $_SESSION['carrito']['productos'][$id] += 1;
        } else {
            $_SESSION['carrito']['productos'][$id] = 1;
        }

        $datos['numero'] = count($_SESSION['carrito']['productos']);
        $datos['ok'] = true;
    }
}

// Devolver respuesta JSON
header('Content-Type: application/json');
echo json_encode($datos);
exit;
?>
