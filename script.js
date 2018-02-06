function initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFydHluYS13YWxpY2thIiwiYSI6ImNqYWFjdXE3YjBoNXUyd3FwaDdxNHM2dTIifQ.0t6wrYw5dN4tMljmtwHfWg';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/martyna-walicka/cjalwgu6b0iw32socp6dejte5',
        center: [16.8752446, 52.4079914],
        zoom: 2.8,
        minZoom: 2.2
    });

    map.addControl(new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric'
    }), 'bottom-right');

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', function () {
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
                'fill-color': 'rgba(29, 19, 39, 0.3)',
                'fill-outline-color': 'rgba(29, 19, 39, 0.7)'
            }
        });

        map.addLayer({
            id: 'countries_highlight_asylum',
            type: 'fill',
            source: 'data',
            filter: ['in', 'ISO_A3', ''],
            layout: {
                visibility: 'visible'
            },
            paint: {
                'fill-color': {
                    property: 'value',
                    stops: [
                        [0, '#fc9272'],
                        [10, '#fb6a4a'],
                        [20, '#ef3b2c'],
                        [50, '#cb181d'],
                        [100, '#a50f15'],
                        [200, '#67000d']

                    ]
                },
                'fill-outline-color': 'rgba(29, 19, 39, 1)'
            },

        });

        map.addLayer({
            id: 'countries_highlight_origin',
            type: 'fill',
            source: 'data',
            filter: ['in', 'ISO_A3', ''],
            layout: {
                visibility: 'visible'
            },
            paint: {
                'fill-color': {
                    property: 'value',
                    stops: [
                        [0, '#65c458'],
                        [5, '#74c476'],
                        [10, '#41ab5d'],
                        [20, '#238b45'],
                        [30, '#006d2c'],
                        [50, '#00441b']

                    ]
                },
                'fill-outline-color': 'rgba(29, 19, 39, 1)'
            },

        });



        map.addLayer({
            id: 'countries_highlight_2',
            type: 'fill',
            source: 'data',
            layout: {
                visibility: 'visible'
            },
            paint: {
                'fill-color': 'rgba(108, 94, 135, 1)',
                'fill-outline-color': 'rgba(29, 19, 39, 1)'
            },
            "filter": ["in", "ISO_A3", ""]
        });


            map.on("mousemove", "countries", function(e) {
                map.getCanvas().style.cursor = 'pointer';
                popup.setLngLat(e.lngLat)
                .setText(countryMapping[e.features[0].properties.ISO_A3].nazwa)
                .addTo(map);
            });
            
            map.on("mouseleave", "countries", function() {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });
        




        map.on('click', 'countries', function (e) {
            app.selected_country = e.features[0].properties.ISO_A3;
            countryHighlight(app.selected_country);
        });



    });

    return map;
}


function countryHighlight(country) {
    console.log(country);
    var filtered = filterData(app.selected_year, country);
    filtered = filtered.sort((a, b) => b.value - a.value);
    europe.features.forEach((e, i) => europe.features[i].properties['value'] = getMigrationValue(filtered, e.properties.ISO_A3));
    map.getSource('data').setData(europe);
    if (app.picked == 'asylum') {
        map.setFilter("countries_highlight_origin", ["in", "ISO_A3", '']);
        map.setFilter("countries_highlight_asylum", ["in", "ISO_A3"].concat(filtered.map(e => e[app.opositeToPicked()])));
    } else {
        map.setFilter("countries_highlight_asylum", ["in", "ISO_A3", '']);
        map.setFilter("countries_highlight_origin", ["in", "ISO_A3"].concat(filtered.map(e => e[app.opositeToPicked()])));
    }
    map.setFilter("countries_highlight_2", ["in", "ISO_A3"].concat(country));
    app.filteredData = filtered;
    drawChart();

    var originLegendEl = document.getElementById('origin-legend');
    var asylumLegendEl = document.getElementById('asylum-legend');
    if (app.picked == 'asylum') {
        originLegendEl.style.display = 'none';
        asylumLegendEl.style.display = 'block';
    } else {
        originLegendEl.style.display = 'block';
        asylumLegendEl.style.display = 'none';
    }
}

function getMigrationValue(data, country) {
    for (let e of data) {
        if (e[app.opositeToPicked()] == country) {
            return e.value;
        }
    }
    return undefined;
}

function filterData(year, country) {
    var filtered = dataByYear[year];
    filtered = filtered.filter(e => e[app.picked] == country);
    return filtered;
}

var years = [];
for (i = 1999; i < 2018; i++) {
    years.push(i);
}

var dataByYear = {};
data.forEach(e => {
    if (dataByYear[e.year] == undefined) {
        dataByYear[e.year] = [];
    }
    dataByYear[e.year].push(e);
});



google.charts.load("current", {
    packages: ["corechart"]
});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Pizza');
    data.addColumn('number', 'Populartiy');
    data.addRows(app.filteredData.map(e => [countryMapping[e[app.opositeToPicked()]].nazwa, e.value]));

    var options = {
        sliceVisibilityThreshold: .05,
        width: 300,
        height: 300,
        chartArea: {
            top: 30,
            left: 10,
            width: 300,
            height: 300
        },

        fontSize: 13



    };

    var chart = new google.visualization.PieChart(document.getElementById('chart-div'));
    chart.draw(data, options);
}



document.addEventListener("DOMContentLoaded", function () {
    $('#btnClick').on('click', function () {
        if ($('#1').css('display') != 'none') {
            $('#chart-div').html($('#chart-div').html()).show().siblings('div').hide();
        } else if ($('#chart-div').css('display') != 'none') {
            $('#1').show().siblings('div').hide();
        }
    });
});

var popup = new mapboxgl.Popup({
    closeButton: false
});