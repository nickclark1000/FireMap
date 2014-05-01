<?php

	include 'connect.php';
	
	$conn = mysql_connect($dbhost,$username,$password);
	
	if(!$conn) {die('Could not connect:' . mysql_error());
		} else {echo "";}
		
	mysql_select_db($database);	
	echo "d";
	$result = mysql_query("SELECT * FROM BFdistTime") or die(mysql_error());
	
	$distTime_array = array();
	
	// build up the array with altitude values
	while($row = mysql_fetch_array($result)) {
		$distTime_array[] = array(floatval($row['Bfdist']), floatval($row['Bftime']));
  	}
	header('Content-Type: application/json');	

//	echo json_encode($distTime_array);
	//close your connections
//	mysql_close();
?>

<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>FireMap</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="Nicholas Clark" >

    <!-- Le styles -->
    <link href="bootstrap/css/bootstrap.css" rel="stylesheet">
    <link href="css/basic.css" rel="stylesheet"> 
  <!--  <link href="bootstrap/css/bootstrap-responsive.css" rel="stylesheet"> -->
    <style>
      body {
        padding-top: 40px; /* 60px to make the container go all the way to the bottom of the topbar */
      }
    </style>

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Fav and touch icons -->
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="../assets/ico/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="../assets/ico/apple-touch-icon-114-precomposed.png">
      <link rel="apple-touch-icon-precomposed" sizes="72x72" href="../assets/ico/apple-touch-icon-72-precomposed.png">
                    <link rel="apple-touch-icon-precomposed" href="../assets/ico/apple-touch-icon-57-precomposed.png">
                                   <link rel="shortcut icon" href="../assets/ico/favicon.png">
   <script type="text/javascript" src="https://www.google.com/jsapi"></script>
   <script type="text/javascript">
		google.load("earth","1");
	</script>
                       
  </head>
	
  <body>

    <div class="navbar navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
          <a class="brand" href="#">FireMap</a>
          <div class="nav-collapse collapse">
            <ul class="nav">
              <li><a href="/firemap.html">Map</a></li>
              <li><a href="/dashboard.html">Dashboard</a></li>
            </ul>
          </div> 
        </div>
      </div>
    </div>
	 <div class="container-fluid" >
		<div class="row-fluid" >   	
			<div class="span3">
 			hello
 			</div>
    		<div class="span9" style="margin-left:0px">
    			
<div style="height:600px;width:570px;box-shadow: 0 3px 10px rgba(0,0,0,0.15);
	-o-box-shadow: 0 3px 10px rgba(0,0,0,0.1);
	-ms-box-shadow: 0 3px 10px rgba(0,0,0,0.1);
	-moz-box-shadow: 0 3px 10px rgba(0,0,0,0.1);
	-webkit-box-shadow: 0 3px 10px rgba(0,0,0,0.1);"><h3 style="margin-left:150px;margin-bottom:0px;padding-top:10px">Base-to-fire Travel Time</h3>
<div id="dashboard" style="height:550px; width:550px;margin-left:10px 	">

</div>
	</div>
    		</div>
    	</div> 
	 </div>


  

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDMEWbu-DxkBYqkZa-gNuaLPPoAm0CEHCM&sensor=false&libraries=drawing&v=3"> </script>
	 <script src="http://code.jquery.com/jquery-1.10.1.js"></script>	 
	 <script type="text/javascript" src="bootstrap/js/bootstrap.min.js"></script>
	 <script type="text/javascript" src="bootstrap/js/bootstrap.js"></script>	
	 <script type="text/javascript" src="bootstrap/js/bootstrapPlugin.js"></script>		 
	 <script type="text/javascript" src="js/jquery.flot.js"></script>
	 <script type="text/javascript" src="/js/jquery.flot.axislabels.js"></script>
<!--	 <script type="text/javascript" src="js/dashboard.js"></script> -->
<script type="text/javascript" >

	var dataset = {label:"Travel Time",data: <?php echo json_encode($distTime_array); ?>,points:{show:true}};

$(function () {
	  	var options = {xaxes:[{
	  				 axisLabel:"Distance (km)",
					 axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 10,
                }],
                yaxes:[{
	  				 axisLabel:"Time (min.)",
					 axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 10,
                }]
                
                };
 	  $.plot($("#dashboard"),[dataset],options);
});
</script>

	 
  </body>
</html>


