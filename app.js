var app = new Vue({
    el: '#app',
    data: {
        title: 'Kryzys migracyjny',
        selected_year: 2017,
        selected_country: 'Polska',
        data: data,
        years: years,
        countryMapping: countryMapping,
        filteredData: [],
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
    },
    computed: {
        sortedCountries() {
            var keys = Object.keys(this.countryMapping)
              .sort((a, b) => this.countryMapping[a].nazwa.localeCompare(this.countryMapping[b].nazwa));
            var sorted = {};
            keys.forEach((k) => sorted[k] = countryMapping[k]);
            return sorted;
        }
    }
});