<?php
require '../../mustache.php-2.13.0/src/Mustache/Autoloader.php';
Mustache_Autoloader::register();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    renderPostAndGet(true);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    renderPostAndGet(false);
}

function renderPostAndGet($post)
{
    $template = file_get_contents("../templates/beispiel.tpl.html");
    $filter =
        array(
            'mail' => FILTER_VALIDATE_EMAIL,
            'status' => FILTER_SANITIZE_FULL_SPECIAL_CHARS
        );
    if ($post) {
        $filteredArray = filter_input_array(INPUT_POST, $filter);

    } else {
        $filteredArray = filter_input_array(INPUT_GET, $filter);
    }
    if (!filter_var($filteredArray['mail'], FILTER_VALIDATE_EMAIL)) {
        function_alert($filteredArray['mail']);
    }
    $mustache = new Mustache_Engine();
    if (isset($_COOKIE['lastVisit'])) {
        echo $mustache->render(
            $template,
            array(
                "title" => "WebEng-PHP",
                "mail" => $filteredArray['mail'],
                "password" => $_POST['password'],
                "status" => $filteredArray['status'],
                "lastVisit" => $_COOKIE['lastVisit']
            )
        );
    } else {
        echo $mustache->render(
            $template,
            array(
                "title" => "WebEng-PHP",
                "mail" => $filteredArray['mail'],
                "password" => $_POST['password'],
                "status" => $filteredArray['status']
            )
        );
    }
    setcookie("lastVisit", date("h:i:s"));
}

function function_alert($message)
{
    echo "<script>alert($message)</script>";
}
