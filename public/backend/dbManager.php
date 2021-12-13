<?php
$host = 'localhost';
$user = 'root';
$passwd = '';
$db = 'svelte';

$mysqli = mysqli_connect($host, $user, $passwd, $db);
$mysqli->query("set names utf8");

function get_data($command)
{
    global $mysqli;
    $res = $mysqli->query($command);
    $arr = $res->fetch_all(MYSQLI_ASSOC);
    return $arr;
}
function queryData($sql)
{
    global $mysqli;
    if (mysqli_query($mysqli, $sql)) {
        return true;
    } else {
        echos("Error: " . $sql . "<br>" . mysqli_error($mysqli));
        return false;
    }
}
