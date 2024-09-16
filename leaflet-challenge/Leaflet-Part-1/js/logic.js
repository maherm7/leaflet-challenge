// Create map
let Mymap = L.map('map').setView([37.09, -95.71], 5);

//Title layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(Mymap);

//URL for earth quake data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Fetch the data
fetch(url).then(Response=>Response.json()).then(data=>{
	//function for detemerming data
	function markercolor(depth){
		if (depth>90) return "red"
		else if (depth>70) return "orangered";
		else if (depth>50) return "darkorange";
		else if (depth>30) return "orange";
		else if (depth>10) return "gold";
		else return "yellowgreen";
	}
	//Function for Marker Size
	function markersize(magnitude){
		if (magnitude === 0) {
			return 1;
		  }
	  
		  return magnitude * 4;
		}

	//Add GeoJson Layer
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            let marker = L.circleMarker(latlng, {
                radius: markersize(feature.properties.mag),
                fillColor: markercolor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
            // Add popup with earthquake details
            marker.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
            return marker;
        }
    }).addTo(Mymap);


	//Add Legends 
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend'),
            depths = [0, 10, 30, 50, 70, 90], // Define your depth ranges
            colors = ['yellowgreen', 'gold', 'orange', 'darkorange', 'orangered', 'red'], // Corresponding colors
            labels = [];

        // Add the minimum and maximum depths
        let legendInfo = "<h4>Depth (km)</h4>" +
            "<div class=\"labels\">" +
                "<div class=\"min\">" + depths[0] + "</div>" +
                "<div class=\"max\">" + depths[depths.length - 1] + "</div>" +
            "</div>";
        div.innerHTML = legendInfo;

        // Loop through the depths and create a label for each
        for (let i = 0; i < depths.length - 1; i++) {
            labels.push("<li style=\"background-color: " + colors[i] + "\">" + depths[i] + " - " + depths[i + 1] + " km</li>");
        }

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    // Adding the legend to the map
    legend.addTo(Mymap);
});