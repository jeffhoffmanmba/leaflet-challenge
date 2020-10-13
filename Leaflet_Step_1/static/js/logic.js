// geoJson link; use link to view data
var quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Initialize LayerGroups we'll be using
var quakes = L.layerGroup();

// Create tile layer
var airmap = L.tileLayer("https://api.mapbox.com/styles/v1/mfatih72/ck30s2f5b19ws1cpmmw6zfumm/tiles/256/{z}/{x}/{y}?" + 
"access_token=pk.eyJ1IjoibWZhdGloNzIiLCJhIjoiY2sycnMyaDVzMGJxbzNtbng0anYybnF0MSJ9.aIN8AYdT8vHnsKloyC-DDA");

// Create our map, giving it the airmap and earthquakes layers to display on load
  var myMap = L.map("map", {
      center: [31.57,-99.58],
      zoom: 3,
      layers: [airmap, quakes]
  });
  
 /* Earthquakes with higher magnitudes should appear larger (marker size); earthquakes with 
// greater depth should appear darker in color
 */
//function to change marker size depending on the magnitute
d3.json(quakeURL, function(quakedata) {
    function markerSize(magnitude) {
      return magnitude * 5;
    };
console.log(quakedata)

// function so greater depth is darker color
function markerColor(depth) {
    if (depth >90) {
        return "red";
    } else if (depth > 75) {
        return "blue";
    } else if (depth > 60) {
        return "orange";
    } else if (depth > 45) {
        return "lightgray";
    } else if (depth > 30) {
        return "yellow";
    } else {
        return "lightgreen";
    };
  }

// create Popup with place, time, magnitude and depth of the earthquake
var earthquakes = L.geoJSON(quakedata, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, 

// Set the popup markers features
    {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        fillOpacity: 1,
        color: "black",
        stroke: true,
        weight: .5
          }
        );
      },
      onEachFeature: function(feature, layer) {
          layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Date: "
          + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag
          + "</p><hr><p>Depth: " + feature.geometry.coordinates[2] + "</p>");
      }

    }).addTo(quakes);

// Sending earthquakes layer to the createMap function
    quakes.addTo(myMap);

// Add a legend
   var legend = L.control({position: "topleft" });
   legend.onAdd = function() {
     var div = L.DomUtil.create("div", "legend");
     var dpth = [0, 30, 45, 60, 75, 90]
     labels = [];
     var colors = ["lightgreen", "yellow", "lightgray", "orange", "blue", "red"];
     div.innerHTML = "<h3>Depth Legend</h3>";
     for (var i =0; i < dpth.length; i++) {
    div.innerHTML += 
    '<i style="background:' + markerColor(dpth[i]) + '"></i> ' +
    dpth[i] + (dpth[i + 1] ? '&ndash;' + dpth[i + 1] + '<br>' : '+');
    }
    return div;
    };
    legend.addTo(myMap);
    });



