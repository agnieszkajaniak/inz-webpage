mapboxgl.accessToken = 'pk.eyJ1IjoiYWduaWVzemtham90IiwiYSI6ImNqMDloMDFscTAwM3UycW14ZnM1YmFvZm0ifQ.cQxnfJqnE2yCYL9MGO89aw';
var map = new mapboxgl.Map({
    container: 'map', // id kontenera (div) mapy
    style: 'mapbox://styles/agnieszkajot/cj485493d1o182slb8auqq058', //lokalizacja pliku stylów
    center: [16.8752446, 52.4079914], // centrum mapy
    zoom: 2.8 // bazowy zoom 
});

map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'metric'
}));

map.addControl(new mapboxgl.ScaleControl());

function dataToString (year, destination){
    filtered = data.filter(e => e.year == year);
    filtered = filtered.filter(e => e.asylum == destination);
    strings = filtered.map(e => e.origin + ": " + e.value);
    return strings;
}

map.on('load', function() {
    map.addSource("data", {
        "type": "vector",
        url: 'mapbox://agnieszkajot.cj486gvg8090n2wlfwr62oawi-075p4'
    });

    map.addLayer({
        id: 'kartokraje',
        type: 'fill',
        source: 'data',
        'source-layer': 'kartokraje',
        layout: {
            visibility: 'visible'
        },
        paint: {
            'fill-color': 'rgba(200, 100, 240, 0.2)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
        }
    });

    map.addLayer({
        id: 'kraje_highlight',
        type: 'fill',
        source: 'data',
        'source-layer': 'kartokraje',
        layout: {
            visibility: 'visible'
        },
        paint: {
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
        },
        "filter": ["==", "name", ""]
    });



    map.on('click', 'kartokraje', function (e) {
        var country = e.features[0].properties.ISO3;
        console.log(country);
        var strings = dataToString(2015,country);
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(strings.join("<br>"))
            .addTo(map);
        map.setFilter("kraje_highlight", ["in", "NAME"].concat(filtered.map(e => e.origin)).concat(e.features[0].properties.NAME));
    });
});

var year = document.getElementById('year');
