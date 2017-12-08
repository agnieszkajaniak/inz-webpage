var app = new Vue({
    el: '#app',
    data: {
        title: 'Interaktywna mapa przedstawiająca imigrację na terenie Europy oraz Azji Mniejszej',
        selected_year: 2017,
        selected_country: 'Polska',
        data: data,
        years: years,
        countryMapping: countryMapping,
        picked: 'asylum'
    },
    mounted: function() {
        map = initMap();
    },
    methods: {
        opositeToPicked() {
            if (this.picked == 'asylum') {
                return 'origin'
            } else {
                return 'asylum'
            }
        }
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
            countryHighlight(this.selected_country);
        }
    }
});
