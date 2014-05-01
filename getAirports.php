<?php

	include 'connect.php';
  	
   $conn = mysql_connect($dbhost,$username,$password);
	if(!$conn) {die('Could not connect:' . mysql_error());
		} else {}
	mysql_select_db($database);	
	
	$result = mysql_query("SELECT * FROM Airports") or die(mysql_error());
	
	header("Content-type: text/xml");
	
	// Start XML file, echo parent node
	echo '<markers>';
	
	// Iterate through the rows, printing XML nodes for each
	while ($row = @mysql_fetch_assoc($result)){
	  // ADD TO XML DOCUMENT NODE
	  echo '<marker ';
	  echo 'name="' . $row['Base'] . '" ';
	  echo 'code="' . $row['Code'] . '" ';
	  echo 'lat="' . $row['Latitude'] . '" ';
	  echo 'lng="' . $row['Longitude'] . '" ';
	  echo '/>';
	}
	
	// End XML file
	echo '</markers>';
		
	//close your connections
	mysql_close();
?> 