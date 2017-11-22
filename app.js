var app = new Vue({
    el: '#app',
    data: {
        title: 'Interaktywna mapa przedstawiająca imigrację na terenie Europy oraz Azji Mniejszej',
		selected: null,
		selected_countries: 'Polska',
		data: data,
		years: years,
		countryPolishName: countryPolishName
		
    },
    mounted: function() {
        map = initMap();
    },
	watch: {
		selected: function(val) {
			this.data = dataByYear[val];
		}
	}
});