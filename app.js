var app = new Vue({
    el: '#app',
    data: {
        title: 'Interaktywna mapa przedstawiająca imigrację na terenie Europy oraz Azji Mniejszej',
		todos: [
		  { text: 'Learn JavaScript' },
		  { text: 'Learn Vue' },
		  { text: 'Build something awesome' }
		],
		selected: null,
		data: data,
		years: years
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