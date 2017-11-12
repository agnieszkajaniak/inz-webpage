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

function getMigrationValue (origin, asylum, year){
    value = undefined;
    for (let e of dataByYear[year]) {
        if (e.origin == origin && e.asylum == asylum && e.year == year) {
            value = e.value;
            break;
        }
    }
    return value;
}

function filterData (year, destination){
    var filtered = data.filter(e => e.year == year);
    filtered = filtered.filter(e => e.asylum == destination);
    return filtered;
}

var dataByYear = {};
data.forEach(e => {
    if(dataByYear[e.year] == undefined) {
        dataByYear[e.year] = [];
    }
    dataByYear[e.year].push(e);
});

map.on('load', function() {
    map.addSource("data", {
        "type": "geojson",
        data: europe
    });

    map.addLayer({
        id: 'countries',
        type: 'fill',
        source: 'data',
        layout: {
            visibility: 'visible'
        },
        paint: {
            'fill-color': 'rgba(200, 100, 240, 0.02)',
            'fill-outline-color': 'rgba(200, 100, 240, 0.6)'
        }
    });

    map.addLayer({
        id: 'countries_highlight',
        type: 'fill',
        source: 'data',
        layout: {
            visibility: 'visible'
        },
        paint: {
            'fill-color': {
                property: 'value',
                stops: [
                    [0, '#F2F12D'],
                    [5, '#EED322'],
                    [7, '#E6B71E'],
                    [10, '#DA9C20'],
                    [25, '#CA8323'],
                    [50, '#B86B25'],
                    [75, '#A25626'],
                    [100, '#8B4225'],
                    [250, '#723122']
                ]
            },
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
        },
        "filter": ["in", "ISO_A3", ""]
    });



    map.on('click', 'countries', function (e) {
        var country = e.features[0].properties.ISO_A3;
        console.log(country);
        europe.features.forEach((e, i) => europe.features[i].properties['value'] = getMigrationValue(e.properties.ISO_A3, country, 2015));
        map.getSource('data').setData(europe);
        var filtered = filterData(2015, country)
        var strings = filtered.map(e => e.origin + ": " + e.value);

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(strings.join("<br>"))
            .addTo(map);
        map.setFilter("countries_highlight", ["in", "ISO_A3"].concat(filtered.map(e => e.origin)));
    });
});