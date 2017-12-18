function initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWduaWVzemtham90IiwiYSI6ImNqMDloMDFscTAwM3UycW14ZnM1YmFvZm0ifQ.cQxnfJqnE2yCYL9MGO89aw';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/agnieszkajot/cj485493d1o182slb8auqq058',
        center: [16.8752446, 52.4079914],
        zoom: 2.8,
		minZoom: 2
    });

    map.addControl(new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
    }));

    map.addControl(new mapboxgl.ScaleControl());

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
                'fill-color': 'rgba(200, 100, 240, 0.05)',
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
		
        map.addLayer({
            id: 'countries_highlight_2',
            type: 'fill',
            source: 'data',
            layout: {
                visibility: 'visible'
            },
            paint: {
                'fill-color': 'rgba(123, 123, 123, 1)'
            },
            "filter": ["in", "ISO_A3", ""]
        });		
		




        map.on('click', 'countries', function (e){
            app.selected_country = e.features[0].properties.ISO_A3;
            countryHighlight(app.selected_country);
        });
    });

    return map;
}

function countryHighlight (country){ 
    console.log(country);
    var filtered = filterData(app.selected_year, country);
    filtered = filtered.sort((a, b) => b.value - a.value);
    europe.features.forEach((e, i) => europe.features[i].properties['value'] = getMigrationValue(filtered, e.properties.ISO_A3));
    map.getSource('data').setData(europe);
    map.setFilter("countries_highlight", ["in", "ISO_A3"].concat(filtered.map(e => e[app.opositeToPicked()])));
    map.setFilter("countries_highlight_2", ["in", "ISO_A3"].concat(country));
    app.filteredData = filtered;
    drawChart();
}

function getMigrationValue (data, country){
    for (let e of data) {
        if (e[app.opositeToPicked()] == country) {
            return e.value;
        }
    }
    return undefined;
}

function filterData (year, country){
    var filtered = dataByYear[year];
    filtered = filtered.filter(e => e[app.picked] == country);
    return filtered;
}

var years = [];
for (i = 1999; i < 2018; i++){
    years.push(i);
}

var dataByYear = {};
data.forEach(e => {
    if(dataByYear[e.year] == undefined) {
        dataByYear[e.year] = [];
    }
    dataByYear[e.year].push(e);
});

google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Pizza');
    data.addColumn('number', 'Populartiy');
    data.addRows(app.filteredData.map(e => [countryMapping[e[app.opositeToPicked()]].nazwa, e.value]));
    
    var options = {
        sliceVisibilityThreshold: .05
      };

    var chart = new google.visualization.PieChart(document.getElementById('chart-div'));
    chart.draw(data, options);
    }