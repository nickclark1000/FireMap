<?php include '../getDistTimeData.php'; ?> 
 

//	 var dataset1 = <?php echo json_encode($distTime_array); ?>;
	 var dataset1 = [[0,0],[3,5],[10,10]];
$(function () {
 	  $.plot($("#dashboard"),
 	  [
   {
     label: "Series 1",
     data: dataset1,
 
     points: {show: true}
   },
   {
     label: "Series 2",
     data: [ [0, 3], [1, 5], [2, 8], [3, 13] ],

     points: {show: true}   
   }
 ]);
});
