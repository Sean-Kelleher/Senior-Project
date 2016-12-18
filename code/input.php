<?php
  session_start();

  require_once "functions.php";
  require_once "db_login.php";

  error_reporting(E_ALL);
  ini_set('display_errors', 1);
  header('Access-Control-Allow-Origin: *');
  header('Content-type: application/json');

  $mysqli = new mysqli($db_hostname,$db_username,$db_password,$db_database);
  if ($mysqli->connect_error)
  {
    die("Connection failed: " . $mysqli->connect_error);
  }

  $cmd = getValue("cmd");

  if ($cmd == "create")
  {
  	$name = getValue('name');
  	$name = mysqli_real_escape_string($mysqli, $name);
  	$era = getValue('era');
  	$era = mysqli_real_escape_string($mysqli, $era);
  	$year = getValue('year');
  	$year = mysqli_real_escape_string($mysqli, $year);
  	$intervals = getValue('intervals');
  	$intervals = mysqli_real_escape_string($mysqli, $intervals);
  	$type = getValue('eventtype');
  	$type = mysqli_real_escape_string($mysqli, $type);
  	$past = getValue('past');
  	$future = getValue('future');
  	$future = mysqli_real_escape_string($mysqli, $future);
    $salt = '$2a$09$kfu783hf76hbdl9jw7yh4i$';
    $response = eventToDb($a_number, $password, $f_name, $l_name, $email);
    echo json_encode($response);
  }
  else
  {
      echo json_encode("Please specify a value for cmd. Command supported: login");
  }

	
	function eventToDb($name, $year, $era, $type)
  	{
      global $mysqli;
      $response = array();
      $query = "INSERT INTO events(name, year, era, type) VALUES (?,?,?,?)";
  	}
  	function lineToDb($title, $start, $end, $intervals)
  	{
      global $mysqli;
      $response = array();
      $query = "INSERT INTO timeline(title, start, end, intervals) VALUES (?,?,?,?)";
  	}
      /*
      $stmt = $mysqli->stmt_init();
      $stmt->prepare($query) or die(mysqli_error($mysqli));
      $stmt->bind_param('sssss', $a_number, $f_name, $l_name, $email, $password);
      $stmt->execute();
      $res = $stmt->get_result();
      $stmt->close();
      return true;*/
  	

?>