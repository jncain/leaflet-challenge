// Marker Radius Function
function markerSize(mag) {
    return mag * 20000;
}

// Marker Color Function
function chooseColor(mag) {
    if (mag <= 1) {
        return "#ffffb2";
    } else if (mag <= 2) {
        return "#fed976";
    } else if (mag <= 3) {
        return "#feb24c";
    } else if (mag <= 4) {
        return "#fd8d3c";
    } else if (mag <= 5) {
        return "#f03b20";
    } else {
        return "#bd0026";
    };
}

// Create Map Function
function createMap(earthquakes) {
    
    // Light Layer
    var lightLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });
    // Satellite Layer
    var satLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });
    // Defining BaseMaps
    var baseMaps = {
        "Light Map": lightLayer,
        "Satellite Map": satLayer
    };

    // Create Overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Create Map
    var myMap = L.map("map", {
        center: [37.0902, -95.7129],
        zoom: 2,
        layers: [lightLayer, earthquakes]
    });

    // Layer Control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Adding legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
        magnitudes = [0, 1, 2, 3, 4, 5];

        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML += '<li style="background-color:' + chooseColor(magnitudes[i] + 1) + '"></li> ' + magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
        }
    return div;
    };

    legend.addTo(myMap);
      
}

// Creating Circles Function
function drawCircles(earthquakeData) {
    var earthquakes = L.geoJson(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><strong>Magnitude</strong>: " + feature.properties.mag + "<br><strong>Date/Time</strong>: " + new Date(feature.properties.time))
        }, 
        pointToLayer: function(feature, latlng) {
            return new L.circle(latlng, {
                fillOpacity: 0.8,
                color: "#000000",
                stroke: false,
                fillColor: chooseColor(feature.properties.mag),
                radius: markerSize(feature.properties.mag),
            });
        }
    });
    // Map function
    createMap(earthquakes);
}

// Pulling data
var dataLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(dataLink, function(data) {

    drawCircles(data.features);
});

