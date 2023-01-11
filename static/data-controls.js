
// Default side length for markers
let sideLength = 12;

// Add markers to map
const markers = [];
const latitudeRegex = /lat(itude)?/i;   // regex to match lat(itude) and ignore case
const longitudeRegex = /long(itude)?/i;

// Find latitude and longitude columns
let latitude, longitude;
for (const key in data[0]) {
    if (latitudeRegex.test(key)) {
        latitude = key;
    }
    if (longitudeRegex.test(key)) {
        longitude = key;
    }
}

data.forEach(function (point) {
    // Create marker
    const marker = L.marker([point[latitude], point[longitude]], {
            icon: L.divIcon({
                className: 'custom-marker',
                iconSize: [sideLength, sideLength],  // default icon size is 12px
                iconAnchor: [sideLength / 2, sideLength / 2]  // position of geographic location within the marker
            })
        }
    ).addTo(map);
    markers.push(marker);

    // Set marker properties
    marker.feature = {
        properties: point
    };
    // Add tooltips and popups to markers
    let content = '<table>';
    const properties = marker.feature.properties;
    for (const key in properties) {
        content += '<tr><td>' + key + '</td><td>' + properties[key] + '</td></tr>';
    }
    content += '</table>';
    marker.bindPopup(content);
    marker.bindTooltip(content);
});

// Initialize range slider
const slider = document.getElementById('slider');
let dataColumn = document.getElementById('data-column').value;
let values = data.map(function (point) {
    return point[dataColumn];
});
let min = Math.min.apply(Math, values);
let max = Math.max.apply(Math, values);
noUiSlider.create(slider, {
    start: [min, max],
    range: {
        'min': min,
        'max': max
    },
    connect: true,
});

// Update input numbers with range values
document.getElementById('min-range').value = min;
document.getElementById('max-range').value = max;

// Initialize markers' side length slider
noUiSlider.create(document.getElementById('markers-side-slider'), {
    start: sideLength,
    tooltips: true,
    step: 1,
    connect: [true, false],
    range: {
        'min': 0,
        'max': 50
    }
});


// Update map with dataColumn values
function displaySelectedDataColumn() {
    // Get selected dataColumn and values
    dataColumn = document.getElementById('data-column').value;
    values = data.map(function (point) {
        return point[dataColumn];
    });

    // Update range for noUiSlider
    min = Math.min.apply(Math, values);
    max = Math.max.apply(Math, values);
    slider.noUiSlider.updateOptions({
        start: [min, max],
        range: {
            'min': min,
            'max': max
        }
    });
    // Update input numbers with range values
    document.getElementById('min-range').value = min;
    document.getElementById('max-range').value = max;

    updateMarkersVisibility();
    // Update class ranges
    numRangesChanged(document.getElementById('num-ranges').value)
    updateMarkerSizes();
}

// Update marker visibility based on dataColumn values and range slider values
function updateMarkersVisibility() {
    const range = slider.noUiSlider.get();
    min = range[0];
    max = range[1];
    markers.forEach(function (marker) {
        const value = marker.feature.properties[dataColumn];
        marker.setOpacity((value >= min && value <= max) ? 1 : 0);
    });
}

// Update range slider with input field values
function updateRange() {
    min = document.getElementById('min-range').value;
    max = document.getElementById('max-range').value;
    slider.noUiSlider.set([min, max]);
    updateMarkersVisibility()
}
// Set up event listeners for range slider and input fields
slider.noUiSlider.on('slide', function(values) {
    updateMarkersVisibility();
    document.getElementById('min-range').value = values[0];
    document.getElementById('max-range').value = values[1];
});
document.getElementById('min-range').addEventListener('change', updateRange);   // Update range slider with input field values
document.getElementById('max-range').addEventListener('change', updateRange);   // Update range slider with input field values






function numRangesChanged(numRanges) {
    // Clear the current range inputs
    document.getElementById('range-inputs').innerHTML = '';

    const palette = ['#003c00', '#005a00', '#007800', '#857800', '#c87600',
        '#ff7600', '#ff8181', '#ffb2ff', '#ffffff' ];

    // Generate a list of colors from the palette
    const colors = [];
    if (numRanges == 1) {
        colors.push('#dc143c');
    } else {
        for (let i = 0; i < numRanges; i++) {
            // the last -1 because length starts at 1 and index at 0
            colors[i] = palette[Math.floor(i / (numRanges-1) * (palette.length - 1))];
        }
    }
    // Add inputs for each range
    for (let i = 0; i < numRanges; i++) {
        // Create a div for the range input
        const rangeDiv = document.createElement('div');
        rangeDiv.className = 'class-inputs';

        // Create a label for the range input
        const rangeLabel = document.createElement('label');
        rangeLabel.innerHTML = 'R. ' + (i + 1) + '. > ';
        rangeDiv.appendChild(rangeLabel);

        // Create a number input for the range
        const rangeInput = document.createElement('input');
        rangeInput.type = 'number';
        rangeInput.name = 'range' + (i + 1);
        rangeInput.value = ranges[dataColumn][numRanges][i];
        rangeDiv.appendChild(rangeInput);

        // Create a color input for the range
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.name = 'color' + (i + 1);
        colorInput.value = colors[i];
        rangeDiv.appendChild(colorInput);

        // Create a checkbox to toggle the visibility of the range
        const visibilityCheckbox = document.createElement('input');
        visibilityCheckbox.type = 'checkbox';
        visibilityCheckbox.name = 'visibility' + (i + 1);
        visibilityCheckbox.checked = true;  // default to checked
        rangeDiv.appendChild(visibilityCheckbox);

        // Add the range input div to the page
        document.getElementById('range-inputs').appendChild(rangeDiv);
    }
    updateMarkerColors();
}

function updateMarkerColors() {
    const numRanges = document.getElementById('num-ranges').value;

    // Update the ranges with the input values
    for (let i = 0; i < numRanges; i++) {    // for each range
        const rangeInput = document.querySelector('input[name="range' + (i + 1) + '"]');
        ranges[dataColumn][numRanges][i] = rangeInput.value;
    }

    // Get the colors and visibility for each range
    const colors = {};
    const visibility = {};
    for (let i = 0; i < numRanges; i++) {
        const colorInput = document.querySelector('input[name="color' + (i + 1) + '"]');
        colors[i] = colorInput.value;

        const visibilityCheckbox = document.querySelector('input[name="visibility' + (i + 1) + '"]');
        visibility[i] = visibilityCheckbox.checked; // true or false
    }

    // Update the marker colors based on the data value and ranges
    markers.forEach(function (marker) {
        const value = marker.feature.properties[dataColumn];
        for (let i = 0; i < numRanges; i++) {    // >= and <= are used to include the max value in the last range
            if (value >= ranges[dataColumn][numRanges][i] && value <= ranges[dataColumn][numRanges][i + 1]) {
                marker._icon.style.backgroundColor = colors[i];     // set marker's colour to range colour
                marker._icon.style.opacity = visibility[i] ? 1 : 0;   // set marker's opacity to range visibility
            }
        }
    });
}

// Add event listener for checkbox
document.getElementById('marker-size-toggle').addEventListener('change', updateMarkerSizes);
// Add event listener for slider
document.getElementById('markers-side-slider').noUiSlider.on('slide', function (values, handle) {
    // Update max side length for markers
    sideLength = values[handle];    // values is an array of values, handle is the index of the handle that was moved
    updateMarkerSizes();
});

// Make squares' areas proportional to the data value
function updateMarkerSizes() {
    const dataColumnAsAreas = document.getElementById('data-column-as-areas').value;
    // MaxValue will have sideLength
    // Get the max value in a column. ... is the spread operator which converts an array to a list of arguments
    const maxValue = Math.max(...data.map(point => point[dataColumnAsAreas]));
    if (document.getElementById('marker-size-toggle').checked) {
        markers.forEach(function (marker) {
            const value = marker.feature.properties[dataColumnAsAreas];
            // To calculate proportional area, use the square root of side length
            const iSideLength = Math.sqrt(value / maxValue) * sideLength;
            marker.setIcon(L.divIcon({
                className: 'custom-marker',
                iconSize: [iSideLength, iSideLength],
                iconAnchor: [iSideLength / 2, iSideLength / 2]
            }));
        });
    } else {
        // Reset marker sizes to default
        markers.forEach(function (marker) {
            marker.setIcon(L.divIcon({
                className: 'custom-marker',
                iconSize: [sideLength, sideLength],
                iconAnchor: [sideLength / 2, sideLength / 2]
            }));
        });
    }
}

// Add event listeners after the page has loaded
document.addEventListener('DOMContentLoaded', function () {
    // Handle changes to the number of ranges dropdown
    document.getElementById('num-ranges').addEventListener('change', function () {
        numRangesChanged(this.value);
    });
    // Initialize the range inputs with 1 range
    numRangesChanged(1);

    // Handle changes to the range inputs
    document.getElementById('range-form').addEventListener('change', updateMarkerColors);
    // Handle changes to data-column-as-areas dropdown
    document.getElementById('data-column-as-areas').addEventListener('change', updateMarkerSizes);

});
