// Enable the visual refresh
google.maps.visualRefresh = false;

map = '';
markers = [];

function initialize() {
	var mapOptions = {
		center: new google.maps.LatLng(49.667872,-85.915853),
		zoom: 5,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};

	map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);
	
	var red14LatLng = new google.maps.LatLng(52.614, -93.8935);
	var marker = new google.maps.Marker ({
		map: map,
		position: red14LatLng,
		title: 'RED14',
		icon: {
			path: google.maps.SymbolPath.CIRCLE,
			strokeColor: 'red',
			scale: 7,
		}
	});

  /*
  downloadUrl("getAirports.php", function(data) {
        var xml = data.responseXML;
   //     var markers = xml.documentElement.getElementsByTagName("marker");
        for (var i = 0; i < markers.length; i++) {
          var name = markers[i].getAttribute("name");
          var code = markers[i].getAttribute("code");
          var point = new google.maps.LatLng(
              parseFloat(markers[i].getAttribute("lat")),
              parseFloat(markers[i].getAttribute("lng")));
          var html = "<b>" + name + "</b> <br/>" + code;
    //      var icon = customIcons[type] || {};
          var marker = new google.maps.Marker({
            map: map,
            position: point,
            icon: iconBase + 'tower.png',
    //        shadow: icon.shadow
          });
          bindInfoWindow(marker, map, infoWindow, html);
          baseText = "<tr><td>" + name + "</td><td>" + code + "</td></tr>";
          $("#tab3contents").append(baseText);
        }
      });
      
  downloadUrl("getFires.php", function(data) {
        var xml = data.responseXML;
   //     var markers = xml.documentElement.getElementsByTagName("marker");
        for (var i = 0; i < markers.length; i++) {
          var id = markers[i].getAttribute("id");
          var spreadrate = markers[i].getAttribute("spreadrate");
          var sizeia = markers[i].getAttribute("sizeia");
          var fueltype = markers[i].getAttribute("fueltype");
          var reporttime = markers[i].getAttribute("reporttime");
          var reportdate = markers[i].getAttribute("reportdate");
          var point = new google.maps.LatLng(
              parseFloat(markers[i].getAttribute("lat")),
              parseFloat(markers[i].getAttribute("lng")));
          var html = "<b>" + id + "</b> <br/> Spread Rate: " + spreadrate + " m/min <br/> Size IA: " + sizeia + " ha <br/> Fuel Type: " + fueltype + "<br/> Report Time: " + reporttime + "<br/> Report Date: " + reportdate ;
    //      var icon = customIcons[type] || {};
          var marker = new google.maps.Marker({
            map: map,
            position: point,
            icon: iconBase + 'fire.png',
    //        shadow: icon.shadow
          });
          bindInfoWindow(marker, map, infoWindow, html);
          fireText = "<tr><td>" + id + "</td><td>" + spreadrate + "</td><td>" + sizeia + "</td></tr>";
          $("#tab1contents").append(fireText);
        }
      });
    }
	 
	 $('#tab1 a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
    })	
     $('#tab2 a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
    })	 
     $('#tab3 a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
    })	 
	 
	 
    function bindInfoWindow(marker, map, infoWindow, html) {
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
      });
    }

    function downloadUrl(url, callback) {
      var request = window.ActiveXObject ?
          new ActiveXObject('Microsoft.XMLHTTP') :
          new XMLHttpRequest;

      request.onreadystatechange = function() {
        if (request.readyState == 4) {
          request.onreadystatechange = doNothing;
          callback(request, request.status);
        }
      };

      request.open('GET', url, true);
      request.send(null);
    }
    
    function doNothing() {}
*/
}

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
		
*/		

		addTankerMarker(data);
		detectDrops(data);
		
	}
});

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
		markers.push(marker);
		bounds.extend(marker.getPosition());
	}
	
	map.fitBounds(bounds);


}


function detectDrops(data) {
	
	var DATA_LENGTH = data.length;
	
	for (i = 4; i < DATA_LENGTH; i++) {
		if( data[i-2]['Altitude'] <= data[i-3]['Altitude'] && data[i-2]['Altitude'] <= data[i-4]['Altitude'] && data[i-2]['Altitude'] <= data[i-1]['Altitude'] && data[i-2]['Altitude'] <= data[i]['Altitude'] && data[i-2]['Speed'] >= 30 && data[i-2]['Speed'] <= 110) {
			data[i-2]['Pickup'] = 1;
			console.log((12711 + i) + ', id:' + (i-2) + ', pickup');
			markers[i-2].setOptions({
				icon: {
					path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
					scale: 2,
					rotation: data[i]['Heading'],
					strokeColor: 'blue',
				},
			});
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

google.maps.event.addDomListener(window,'load',initialize);