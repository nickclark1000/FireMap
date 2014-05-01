<?php

	include 'connect.php';
	$conn = mysql_connect($dbhost,$username,$password);
	if(!$conn) {die('Could not connect:' . mysql_error());
		} else {echo "Connection successful. ";}
	mysql_select_db($database);	
	
	$result = mysql_query("SELECT * FROM ATS") or die(mysql_error());
	
	$altitude_array = array();
	
	// build up the array with altitude values
	while($row = mysql_fetch_array($result)) {
  		$altitude_array[] = $row['Altitude'];
  	}


  for($j=2; $j <= count($altitude_array)-1; $j++) {
  	if($altitude_array[$j] < $altitude_array[$j-1]) {
  		if($altitude_array[$j]<=$altitude_array[$j-2]){
  			if($altitude_array[$j]<=$altitude_array[$j+1]) {
  				if($altitude_array[$j]<=$altitude_array[$j+2]) {
  					echo '<br>'.$j.','.$altitude_array[$j];			
  					}
  				}
  			} 
  		} 
  	}

	//close your connections
	mysql_close();
?> 