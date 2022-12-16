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
