<?php
require("./main.php");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
// header('Content-Type: application/x-www-form-urlencoded; charset=utf-8');
$_POST = json_decode(file_get_contents('php://input'), true);

$allEmailsFromDB = get_data("SELECT `email` FROM `users`");
if (isset($_POST["email"])) {
    if (checkIfContains($allEmailsFromDB, $_POST["email"], "email")) {
        $email = $_POST["email"];
        $passwd = $_POST["passwd"];
        global $mysqli;
        $data = get_data("SELECT userType.type,users.username,users.password,users.accepted FROM users INNER JOIN userType on users.userType = userType.id WHERE users.email = '$email'");
        if (count($data) == 1) {
            if (md5($passwd) == $data[0]["password"]) {
                if ($data[0]["accepted"] == 1) {
                    $_SESSION["logged"]  = $email;
                    $_SESSION['userType'] = $data[0]["type"];
                    $_SESSION['LAST_ACTIVITY'] = time();

                    echos(array("logged" => true));
                } else {
                    echos(array("logged" => false, "message" => "account not accepted by administrator"));
                }
            } else {
                echos(array("logged" => false));
            }
        } else {
            echos(array("logged" => false));
        }
    } else {
        //Mail Jest w bazie
        echos(array("emailInBase" => false));
    }
}

if (isset($_POST["logout"]) && $_POST["logout"]) {
    session_unset();     // unset $_SESSION variable for the run-time 
    session_destroy();   // destroy session data in storage
    echos(array("logout" => true));
}
