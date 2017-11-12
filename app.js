var app = new Vue({
    el: '#app',
    data: {
        title: 'Interaktywna mapa przedstawiająca imigrację na terenie Europy oraz Azji Mniejszej'
    },
    mounted: function() {
        map = initMap();
    }
});
