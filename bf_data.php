<?php

	include 'connect.php';
	
	if(!$conn) {die('Could not connect:' . mysql_error());
		} else {echo "";}
		
	$result = mysqli_query($conn, "SELECT * FROM RESULTS") or die(mysql_error());
	
	$results_array = array();
	
	// build up the array with data values
	while($row = mysqli_fetch_assoc($result)) {
		array_push($results_array, $row);
  	}

  	echo json_encode($results_array);

  	//close your connections
	mysqli_close($conn);