var app = new Vue({
    el: '#app',
    data: {
        title: 'Interaktywna mapa przedstawiająca imigrację na terenie Europy oraz Azji Mniejszej',
		selected_year: 2017,
		selected_country: 'Polska',
		data: data,
		years: years,
		countryPolishName: countryPolishName
		
    },
    mounted: function() {
        map = initMap();
    },
	watch: {
		selected_year: function(val) {
			countryHighlight(country);
			this.data = dataByYear[val];
		}
	}
});