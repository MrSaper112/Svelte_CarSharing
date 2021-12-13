<?php
require("./main.php");
header('Content-Type: application/json; charset=utf-8');
$_POST = json_decode(file_get_contents('php://input'), true);
$allEmailsFromDB = get_data("SELECT `email` FROM `users`");

if (!checkIfContains($allEmailsFromDB, $_POST["email"], "email")) {
    //Maila nie ma w bazie
    $email = $_POST["email"];
    $username = $_POST["username"];
    $passwd = md5($_POST["passwd"]);
    $command = "INSERT INTO users (userType, username, password, email) VALUES ('2','$username','$passwd','$email');";

    if (queryData($command)) {
        echos(array("registered" => true));
        // $_COOKIE["logged"] = $email;
        $_SESSION['LAST_ACTIVITY'] = time();
        $_SESSION["logged"] = $email;
        $_SESSION['userType'] = "user";
    } else {
        echos(array("registered" => false));
    }
} else {
    //email Jest w bazie
    echos(array("emailExist" => true));
}
