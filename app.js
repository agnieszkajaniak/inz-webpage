var app = new Vue({
    el: '#app',
    data: {
        title: 'Interaktywna mapa przedstawiająca imigrację na terenie Europy oraz Azji Mniejszej',
        selected_year: 2017,
        selected_country: 'Polska',
        data: data,
        years: years,
        countryMapping: countryMapping,
        picked: 'Imigracja'
    },
    mounted: function() {
        map = initMap();
    },
    watch: {
        selected_year: function(val) {
            countryHighlight(this.selected_country);
            this.data = dataByYear[val];
        },
        selected_country: function(val) {
            countryHighlight(this.selected_country);
        },
        picked: function(val) {
            console.log(app.picked);
        }
    }
});
