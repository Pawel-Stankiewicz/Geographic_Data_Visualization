// Save the current map settings to local storage
function saveMapSettings() {
    // Get the current map center and zoom level
    const center = map.getCenter();
    const zoom = map.getZoom();

    // Get the current active layer
    let activeLayer = null;
    for (let key in map._layers) {
        //._map is a property of the layer object that indicates whether the layer is currently being displayed on the map or not.
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
    let center = JSON.parse(localStorage.getItem('mapCenter'));
    let zoom = localStorage.getItem('mapZoom');
    let activeLayer = localStorage.getItem('activeLayer');

    // If the map center and zoom level are available, set the map view
    if (center && zoom) {
        map.setView(center, zoom);
    }

    // If the active layer is available, set the active layer
    if (activeLayer) {
        for (let key in layerControl._layers) {
            if (layerControl._layers[key].layer._url === activeLayer) {
                layerControl._layers[key].layer.addTo(map);
                break;
            }
        }
    }
}

// Create the map and set the view to a specific geographical location
var map = L.map('map').setView([55.9, -3.2], 8);

// Add the OSM layer to the map
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
maxZoom: 19
}).addTo(map);

// Add the OSM.de layer to the map
var osmdeLayer = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
maxZoom: 19
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

// add the Hiking Waymarked Trails overlay
var wayMarkedTrails = L.tileLayer.wms('https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png', {
    layers: 'hiking',
    format: 'image/png',
    transparent: true,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://hiking.waymarkedtrails.org/">Waymarked Trails</a>'
});

// Add the Cycling Waymarked Trails overlay
var wayMarkedTrailsCycling = L.tileLayer.wms('https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png', {
    layers: 'cycling',
    format: 'image/png',
    transparent: true,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://cycling.waymarkedtrails.org/">Waymarked Trails</a>'
});

var baseMaps = {
    "OSM": osmLayer,
    "OSM.de": osmdeLayer,
    "OpenTopo": opentopoLayer,
    "Esri Satellite": esriSatelliteLayer,
    "MtbMap": mtbMapLayer
};

var overlays = {
    "Hiking Trails": wayMarkedTrails,
    "Cycling Trails": wayMarkedTrailsCycling
};

// Create a layer control and add it to the map
var layerControl = L.control.layers(baseMaps, overlays).addTo(map);

L.control.scale().addTo(map);

// Load the map settings from local storage
loadMapSettings();

// Save the map settings to local storage when the map is moved or zoomed. on ads an event listener
map.on('moveend', saveMapSettings);

