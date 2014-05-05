// Enable the visual refresh
google.maps.visualRefresh = false;

function addTankerMarker(data) {
	
	var DATA_LENGTH = data.length;
	var bounds = new google.maps.LatLngBounds();
	
	for(i=0; i < DATA_LENGTH; i++) {
		var latLng = new google.maps.LatLng(data[i]['Latitude'], data[i]['Longitude']);
		var marker = new google.maps.Marker({
			map: map,
			position: latLng,
			title: 'id: ' + i,
			icon: {
				path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
				scale: 2,
				rotation: data[i]['Heading'],
				strokeColor: 'yellow',
			},
			
		});
		data[i]['marker'] = marker;
		bounds.extend(marker.getPosition());
	}
	
	map.fitBounds(bounds);


}


function detectDrops(data) {
	
	
//	console.log(data);
}

google.maps.event.addDomListener(window,'load',initialize);