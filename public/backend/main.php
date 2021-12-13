<?php
include("./dbManager.php");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
session_save_path("A:\aaatmpphp");
session_start();
header('Content-Type: application/json; charset=utf-8');
$_POST = json_decode(file_get_contents('php://input'), true);

if (isset($_SESSION['logged']) && isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 1800)) {
    session_unset();     // unset $_SESSION variable for the run-time 
    session_destroy();   // destroy session data in storage
}
// echos(get_data("SELECT * FROM accounts"));
// $dataToReturn = array("call" => $_POST);
if (isset($_POST['openPage']) && $_POST['openPage']) {
    if (isset($_SESSION["logged"])) {
        $data = get_data("SELECT userType.type,users.username,users.password,users.accepted FROM users INNER JOIN userType on users.userType = userType.id WHERE users.email = '$_SESSION[logged]'");

        if ($data[0]["accepted"] == 1) {

            if ($_SESSION["userType"] != $data[0]["type"]) {
                $_SESSION['LAST_ACTIVITY'] = time(); // update last activity time stamp]
                $_SESSION["userType"] = $data[0]["type"];
                $dataToReturn["accountType"] = $_SESSION["userType"];
            } else {
                $_SESSION['LAST_ACTIVITY'] = time(); // update last activity time stamp]
                $dataToReturn["accountType"] = $_SESSION["userType"];
            }
            $dataToReturn["exist"] = true;
        } else if ($data[0]["accepted"] == 0) {
            session_unset();     // unset $_SESSION variable for the run-time 
            session_destroy();   // destroy session data in storage
            $dataToReturn["exist"] = false;
        }
    } else {
        $dataToReturn["exist"] = false;

        // Cookie is not set
    }
    echos($dataToReturn);
} else if (isset($_SESSION["logged"]) && isset($_POST['getUsers']) && $_POST['getUsers'] && $_SESSION["userType"] == "admin") {

    $users = get_data("SELECT users.username, users.email, userType.type,users.accepted FROM users INNER JOIN userType ON userType.id = users.userType;");
    echos(array("users" => $users));
} else if (isset($_SESSION["logged"]) && isset($_POST['accountOperations']) && $_POST['accountOperations'] && $_SESSION["userType"] = "admin") {
    $dataToReturn["query"] = false;
    if (isset($_POST['operation']) && $_POST['operation'] == "acceptUser") {
        $status;

        if ($_POST['status'] == "accepted") {
            $status = 1;
        } else if ($_POST['status'] == "notAccepted") {
            $status = 0;
        }

        if ($status == 1 || $status == 0) {
            queryData("UPDATE users SET accepted=$status WHERE username = '$_POST[username]' AND email = '$_POST[email]'");
            $dataToReturn["query"] = true;
        }
    }

    if (isset($_POST['operation']) && $_POST['operation'] == "changeType") {
        queryData("UPDATE users SET users.userType = (SELECT id FROM usertype WHERE type = '$_POST[type]') WHERE users.username = '$_POST[username]' AND users.email = '$_POST[email]';");
        $dataToReturn["query"] = true;
    }
    echos($dataToReturn);
}

function echos($data)
{
    echo (json_encode($data));
}

function checkIfContains($array, $data, $key)
{
    foreach ($array as $item) {
        if ($item[$key] == $data) {
            return true;
        }
    }
    return false;
}
