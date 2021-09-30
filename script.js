let map = L.map('map', {maxZoom: 19}).setView([16.87, 96.19], 10);

L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);

let markers = [];
let shellArr = [];
let polygon;

function getLatLngFromMarkers() {
    let latLng = [];

    for (let i = 0; i < markers.length; i++) {
        latLng.push(markers[i].getLatLng());
    }

    return latLng;
}

function addMarker(latLng) {
    markers.push(L.marker(latLng, {
        draggable: true
    }));

    let index = markers.length - 1;

    markers[index].setOpacity(1);
    markers[index].addTo(map);
    markers[index].on('dragend', function () {
        drawPolygon();
        calculateArea();
    });
}

function clearPolygon() {
    if (polygon) {
        if(!polygon.isEmpty()) {
            polygon.remove();
        }
    }

    polygon = L.polygon([], {
        color: '#0563bd'
    }).addTo(map);
}

function drawPolygon() {
    let points = getLatLngFromMarkers();
    clearPolygon();
    polygon.setLatLngs(points);
}

function calculateArea() {
    let pointFromMarker = getLatLngFromMarkers();
    let latLngs = [];
    let len = pointFromMarker.length;

    for (let i = 0; i < len; i++) {
        latLngs.push([pointFromMarker[i].lng, pointFromMarker[i].lat]);
    }

    let lastPoint = latLngs[0];

    latLngs.push(lastPoint);

    shellArr.length = 0;
    shellArr.push(latLngs);

    if (len > 2) {
        printResult();
    }
}

function printResult() {
    let polygon = turf.polygon(shellArr);
    let area = turf.area(polygon);
    area = Math.ceil(area);

    if (area) {
        document.getElementById('area').innerHTML = "Area: " + area + "m<sup>2</sup>";
    }
}

function onMapClick(point) {
    addMarker(point.latlng);
    drawPolygon();
    calculateArea();
}

map.on('click', onMapClick);