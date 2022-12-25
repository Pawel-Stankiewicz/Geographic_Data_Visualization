// Set the marker class name based on the data-marker-color attribute
function addToMarkersCustomMarkerClass() {
    var markers = document.querySelectorAll('.leaflet-marker-icon');
    markers.forEach(function(marker) {
        marker.classList.add('custom-marker'); // Add the custom-marker class to all markers

    });
}

// Call the function after the markers have been added to the map
addToMarkersCustomMarkerClass();