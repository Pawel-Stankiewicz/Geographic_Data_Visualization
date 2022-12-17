// Save the current map settings to local storage
function saveMapSettings() {
    // Get the current map center and zoom level
    var center = map.getCenter();
    var zoom = map.getZoom();

    // Get the current active layer
    var activeLayer = null;
    for (var key in map._layers) {
        //._map is a property of the layer object that indicates whether the layer is currently being displayed on the map or not.
        // undocumented
        if (map._layers[key]._map) {
            activeLayer = map._layers[key]._url;
            break;
        }
    }

    // Save the map center, zoom level, and active layer to local storage
    localStorage.setItem('mapCenter', JSON.stringify(center));
    localStorage.setItem('mapZoom', zoom);
    localStorage.setItem('activeLayer', activeLayer);
}

// Load the map settings from local storage
function loadMapSettings() {
    // Retrieve the map center, zoom level, and active layer from local storage
    var center = JSON.parse(localStorage.getItem('mapCenter'));
    var zoom = localStorage.getItem('mapZoom');
    var activeLayer = localStorage.getItem('activeLayer');

    // If the map center and zoom level are available, set the map view
    if (center && zoom) {
        map.setView(center, zoom);
    }

    // If the active layer is available, set the active layer
    if (activeLayer) {
        for (var key in layerControl._layers) {
            if (layerControl._layers[key].layer._url === activeLayer) {
                layerControl._layers[key].layer.addTo(map);
                break;
            }
        }
    }
}

// Create the map and set the view to a specific geographical location
var map = L.map('map').setView([51.505, -0.09], 13);

// Add the OSM layer to the map
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
maxZoom: 18
}).addTo(map);

// Add the OSM.de layer to the map
var osmdeLayer = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
maxZoom: 18
});

// Add the OpenTopo layer to the map
var opentopoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
attribution: 'Map data: OpenStreetMap, SRTM | Map style: © OpenTopoMap (CC-BY-SA)',
maxZoom: 17
});
// Add the Esri satellite layer to the map
var esriSatelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// Add the MtbMap layer to the map
var mtbMapLayer = L.tileLayer('https://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://mtbmap.cz">MtbMap</a>'
});

// Create a layer control and add it to the map
var layerControl = L.control.layers({
    "OSM": osmLayer,
    "OSM.de": osmdeLayer,
    "OpenTopo": opentopoLayer,
    "Esri Satellite": esriSatelliteLayer,
    "MtbMap": mtbMapLayer
}).addTo(map);

// Load the map settings from local storage
loadMapSettings();

// Save the map settings to local storage when the map is moved or zoomed
map.on('moveend', saveMapSettings);
