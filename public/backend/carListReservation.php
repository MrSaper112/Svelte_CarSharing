<?php
include("./main.php");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
if (!isset($_SESSION)) {
    session_save_path("A:\aaatmpphp");
    session_start();
}
header('Content-Type: application/json; charset=utf-8');
$_POST = json_decode(file_get_contents('php://input'), true);

if (isset($_SESSION['logged']) && isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 1800)) {
    session_unset();     // unset $_SESSION variable for the run-time 
    session_destroy();   // destroy session data in storage
}
$dataToReturn;
// getReservationWithBooked();
try {
    $emailInBase = get_data("SELECT COUNT(`id`) FROM `users` WHERE `email` = '$_SESSION[logged]';");
} catch (\Throwable $th) {
    //throw $th;
}

if (isset($_SESSION["logged"]) && $emailInBase[0]["COUNT(`id`)"] == 1) {
    if (isset($_POST["allCarList"]) && $_POST["allCarList"]) {
        $dataToReturn['allcars'] = getReservationWithBooked();
    }
    if (isset($_POST["getAllreservations"]) && $_POST["getAllreservations"] && $_SESSION["userType"] != "user") {
        $reservations = get_data("SELECT reservatiaon.hashCode,reservatiaon.price,reservatiaon.endDay,reservatiaon.startDay,statustype.status,cars.model,cars.brand,cars.year,users.email,users.username FROM reservatiaon INNER JOIN users ON users.id = reservatiaon.accountID INNER JOIN cars ON cars.id = reservatiaon.carID INNER JOIN statustype ON statustype.id = reservatiaon.statusID WHERE 1");

        $archives = get_data("SELECT archives.price,archives.endDay,archives.startDay,statustype.status,cars.model,cars.brand,cars.year,users.email,users.username FROM archives INNER JOIN users ON users.id = archives.accountID INNER JOIN cars ON cars.id = archives.carID INNER JOIN statustype ON statustype.id = archives.statusID WHERE 1");

        $dataToReturn["myReservations"] = $reservations;
        $dataToReturn["archives"] = $archives;
    }
    if (isset($_POST["status"]) && $_POST["status"]) {
        $model = $_POST["car"]["model"];
        $brand = $_POST["car"]["brand"];
        $year = intval($_POST["car"]["year"]);
        $startDay = $_POST["car"]["startDay"];
        $endDay = $_POST["car"]["endDay"];

        $status = -1;
        if ($_POST["status"] == "cancel") {
            $hash = "";
            $status =  4;
        } else if ($_POST["status"] == "refuse" && ($_SESSION["userType"] == "moderator" || $_SESSION["userType"] == "admin")) {
            $hash = "";
            $status =  3;
        } else if ($_POST["status"] == "accept" && ($_SESSION["userType"] == "moderator"  || $_SESSION["userType"] == "admin")) {
            $hash = generateHashCode();
            $dataToReturn["hash"] = $hash;
            $status =  2;
        }

        if ($status != -1) {
            $sqlIn = "UPDATE reservatiaon INNER JOIN cars ON reservatiaon.carID = cars.id INNER JOIN users ON reservatiaon.accountID = users.id SET reservatiaon.statusID = $status, reservatiaon.hashCode = '$hash'  WHERE cars.brand = '$brand' AND cars.model = '$model' AND cars.year = $year AND reservatiaon.startDay = '$startDay' AND reservatiaon.endDay = '$endDay'";
            queryData($sqlIn);
            $dataToReturn['query'] = true;
            $dataToReturn['status'] = $status;
        } else {
            $dataToReturn['query'] = "Error!";
        }
    }

    if (isset($_POST["car"]) && isset($_POST["dateRequest"]) && isset($_POST["dateRequest"]["start"]) && isset($_POST["dateRequest"]["end"])) {
        $model = $_POST["car"]["model"];
        $brand = $_POST["car"]["brand"];
        $year = intval($_POST["car"]["year"]);
        $getCarFromDBWithReservationsToFilter =  get_data("SELECT cars.brand,cars.model,cars.year,reservatiaon.startDay,reservatiaon.endDay,cars.price FROM cars LEFT JOIN reservatiaon ON cars.id = reservatiaon.carID INNER JOIN statustype ON reservatiaon.statusID = statustype.id WHERE cars.model = '$model' AND cars.brand = '$brand' AND cars.year = $year AND statustype.status != 'unconfirmed'AND statustype.status != 'canceled';");

        $price = get_data("SELECT price FROM cars WHERE brand = '$brand' AND year = $year AND model = '$model'");
        $dates = $_POST["dateRequest"];

        if (!checkIfNotOlderThanToday($dates["start"]) && !checkIfNotOlderThanToday($dates["end"])) {
            if (count($getCarFromDBWithReservationsToFilter) > 0) {
                if (getIfDatesDoesntColidate($dates, $getCarFromDBWithReservationsToFilter)) {
                    $earlier = new DateTime($dates["start"]);
                    $later = new DateTime($dates["end"]);

                    $abs_diff = $earlier->diff($later)->format("%a");
                    if ($abs_diff < 0) $abs_diff *= -1;

                    if ($dates["start"] == $dates["end"]) {
                        $price = intval($price[0]["price"]);
                    } else {
                        $price = $abs_diff * intval($price[0]["price"]);
                    }
                    $sqlCall = "INSERT INTO `reservatiaon`( `accountID`, `statusID`, `carID`, `startDay`, `endDay`, `price`) VALUES ((SELECT users.id FROM users WHERE users.email = '$_SESSION[logged]'),1,(SELECT cars.id FROM cars WHERE cars.brand = '$brand' AND cars.model = '$model' AND cars.year = $year),'$dates[start]','$dates[end]',$price);";

                    queryData($sqlCall);

                    $dataToReturn['query'] = true;
                } else {
                    $dataToReturn['query'] = "The selected days conflict with the booked days!";
                }
            } else if (count($getCarFromDBWithReservationsToFilter) == 0) {
                $earlier = new DateTime($dates["start"]);
                $later = new DateTime($dates["end"]);

                $abs_diff = $earlier->diff($later)->format("%a");
                if ($abs_diff < 0) $abs_diff *= -1;

                if ($dates["start"] == $dates["end"]) {
                    $price = intval($price[0]["price"]);
                } else {
                    $price = $abs_diff * intval($price[0]["price"]);
                }

                $sqlCall = "INSERT INTO `reservatiaon`( `accountID`, `statusID`, `carID`, `startDay`, `endDay`, `price`) VALUES ((SELECT users.id FROM users WHERE users.email = '$_SESSION[logged]'),1,(SELECT cars.id FROM cars WHERE cars.brand = '$brand' AND cars.model = '$model' AND cars.year = $year),'$dates[start]','$dates[end]',$price);";

                queryData($sqlCall);

                $dataToReturn['query'] = true;
            } else {
                $dataToReturn['query'] = "Error in database count!";
            }
        } else {
            $dataToReturn['query'] = "Selected days is older than today!";
        }
        if (gettype($dataToReturn['query']) == "boolean" && $dataToReturn['query']) {
            $dataToReturn['allcars'] = getReservationWithBooked();
        }
        // $dataToReturn["all"] = $getCarFromDBWithReservationsToFilter;
    } else if (isset($_POST["getMyReservations"]) && $_POST["getMyReservations"]) {
        $myReservations = get_data("SELECT reservatiaon.hashCode,reservatiaon.price,reservatiaon.endDay,reservatiaon.startDay,statustype.status,cars.model,cars.brand,cars.year FROM reservatiaon INNER JOIN users ON users.id = reservatiaon.accountID INNER JOIN cars ON cars.id = reservatiaon.carID INNER JOIN statustype ON statustype.id = reservatiaon.statusID WHERE users.email = '$_SESSION[logged]';");

        $dataToReturn["myReservations"] = $myReservations;
    }
} else {
    $dataToReturn["errror"] = "No Logged";
}
echos($dataToReturn);
function getReservationWithBooked()
{
    $reservatiaonToCars = get_data("SELECT cars.price,cars.brand,cars.model,cars.year,reservatiaon.startDay,reservatiaon.endDay,statustype.status FROM cars LEFT JOIN reservatiaon ON cars.id = reservatiaon.carID INNER JOIN statustype ON reservatiaon.statusID = statustype.id WHERE statustype.status != 'unconfirmed' AND statustype.status != 'canceled';");
    $allcars = get_data("SELECT `brand`, `model`, `year`,`price` FROM cars");
    foreach ($allcars as $key => $val) {
        $busy = [];
        foreach ($reservatiaonToCars as $keye => $vale) {
            if ($vale["brand"] == $val["brand"] && $val["model"] == $vale["model"] && $vale["startDay"] != null && $vale["endDay"] != null && $val["year"] == $vale["year"]) {
                array_push($busy, array("startDay" => $vale["startDay"], "endDay" => $vale["endDay"]));
            }
        }
        $allcars[$key]["busy"] = $busy;
    }
    return $allcars;
    // }
    //     item.busy = carList.carListReservation.filter(
    //         (itemRes) =>
    //             itemRes.brand == item.brand &&
    //             itemRes.model == item.model &&
    //             itemRes.startDay !== null &&
    //             itemRes.endDay !== null
    //     );
    // }
}
function checkIfNotOlderThanToday($dateToLookup)
{
    $date_now = date("Y-m-d");
    if ($date_now > $dateToLookup) {
        return true;
    }
    return false;
}
function getIfDatesDoesntColidate($rentRequest, $allReservedPlaces)
{
    foreach ($allReservedPlaces as $k => $value) {
        if (!checkDateBetween($value["startDay"], $value["endDay"], $rentRequest["start"], $rentRequest["end"])) {
            continue;
        } else {
            return false;
        }
    }
    return true;
}

function checkDateBetween($start, $end, $dayStartRent, $dayEndRent)
{
    if (((strtotime($dayStartRent) >= strtotime($start)) && (strtotime($dayStartRent) <= strtotime($end))) && ((strtotime($dayEndRent) >= strtotime($start)) && (strtotime($dayEndRent) <= strtotime($end)))) {
        return true;
    } else {
        return false;
    }
}
function generateHashCode()
{
    $key = generateRandomString(25);
    $allKeys = get_data("SELECT hashCode FROM reservatiaon");
    foreach ($allKeys as $k => $value) {
        if ($value["hashCode"] == $value) {
            $key = generateRandomString(25);
        }
    }

    return $key;
}
function generateRandomString($length = 10)
{
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
// $sql = "INSERT INTO `reservatiaon`( `accountID`, `statusID`, `carID`, `startDay`, `endDay`, `price`) VALUES ((SELECT users.id FROM users WHERE users.email = \'maciek@interia.pl\'),1,(SELECT cars.id FROM cars WHERE cars.brand = \'RENO\' AND cars.model = \'CLIO 2 Privalage\' AND cars.year = 2002),\'2021-12-10\',\'2021-12-12\',1337);";