data = {};

$.ajax({
	type: "GET",
	url: "http://localhost:8888/FireMap/proc_ats.csv",                          
	success: function(csv){                    
		data = $.csv.toObjects(csv);
		cleanseData(data);
/*		if(data[73]['Altitude'] < data[74]['Altitude']) {
			console.log('yes');
			console.log(data[73]['Altitude'] + ', ' + data[74]['Altitude']);
			typeof(data[73]['Altitude']);
		} else {
			console.log('no');
			console.log(data[73]['Altitude'] + ', ' + data[74]['Altitude']);
		}
*/		detectDrops(data);
		
	}
});



function detectDrops(data) {
	
	var DATA_LENGTH = data.length;
	
	for (i = 4; i < DATA_LENGTH; i++) {
		if( data[i-2]['Altitude'] <= data[i-3]['Altitude'] && data[i-2]['Altitude'] <= data[i-4]['Altitude'] && data[i-2]['Altitude'] <= data[i-1]['Altitude'] && data[i-2]['Altitude'] <= data[i]['Altitude'] && data[i-2]['Speed'] >= 30 && data[i-2]['Speed'] <= 110) {
			data[i-2]['Pickup'] = 1;
			console.log((12711 + i) + ', id:' + (i-2) + ', pickup');
		} else {
			data[i-2]['Pickup'] = 0;
			console.log((12711 + i) + ', id:' + (i-2) + ', no');
			
		}
	}
//	console.log(data);
}

function cleanseData(data) {
	var DATA_LENGTH = data.length;
	
	for(i=0; i < DATA_LENGTH; i++){
		data[i]['Seconds'] = parseFloat(data[i]['Seconds']);
		data[i]['Latitude'] = parseFloat(data[i]['Latitude']);
		data[i]['Longitude'] = parseFloat(data[i]['Longitude']);
		data[i]['Altitude'] = parseFloat(data[i]['Altitude']);
		data[i]['Heading'] = parseFloat(data[i]['Heading']);
		data[i]['Speed'] = parseFloat(data[i]['Speed']);
	}
	console.log(data);
	return data;
}