<?php

	include 'connect.php';
  	
   $conn = mysql_connect($dbhost,$username,$password);
	if(!$conn) {die('Could not connect:' . mysql_error());
		} else {}
	mysql_select_db($database);	
	
	$result = mysql_query("SELECT * FROM Fires") or die(mysql_error());
	
	header("Content-type: text/xml");
	
	// Start XML file, echo parent node
	echo '<markers>';
	
	// Iterate through the rows, printing XML nodes for each
	while ($row = @mysql_fetch_assoc($result)){
	  // ADD TO XML DOCUMENT NODE
	  echo '<marker ';
	  echo 'id="' . $row['FireId'] . '" ';
	  echo 'spreadrate="' . $row['SpreadRate'] . '" ';
	  echo 'sizeia="' . $row['SizeIA'] . '" ';
	  echo 'fueltype="' . $row['FuelType'] . '" ';
	  echo 'reporttime="' . $row['ReportTime'] . '" ';
	  echo 'reportdate="' . $row['ReportDate'] . '" ';
	  echo 'lat="' . $row['Latitude'] . '" ';
	  echo 'lng="' . $row['Longitude'] . '" ';
	  echo '/>';
	}
	
	// End XML file
	echo '</markers>';
		
	//close your connections
	mysql_close();
?> 