mapboxgl.accessToken = 'pk.eyJ1IjoiaGlndWVyb2RpZWdvIiwiYSI6ImNrN3Q2a25yNTBtc2ozaG1yam8zNnRibHUifQ.Zgmrlgnrw54eXySGuI3DIQ';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/higuerodiego/ck7t6ytf00hno1iqyycuc6pm6/draft', // stylesheet location
    center: [2.290078, 48.895353], // starting position [lng, lat]
    zoom: 17 // starting zoom
});
map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
}));
map.addControl(new mapboxgl.NavigationControl());
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    })
);
map.on('load', function() {
    var layers = map.getStyle().layers;
    var labelLayerId;

    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }
    map.addLayer({
        'id': 'porHacer',
        'source': 'composite',
        'source-layer': 'building',
        'type': 'fill',
        'minzoom': 15,
        'paint': {
            'fill-color': ["case", ["boolean", ["feature-state", "seleccionado"], false], "red", "rgba(0,0,0,0)"]
        }
    }, labelLayerId);

    map.addSource('edificiosHechos', {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": []
        }
    }), labelLayerId;

})
var database = firebase.database();

database.ref("LevalloisN1")
    .on("child_added", function(s) {

        map.setFeatureState({
            source: 'composite',
            sourceLayer: "building",
            id: s.val().id,

        }, { seleccionado: true });

    })

database.ref("LevalloisN1")
    .on("child_removed", function(s) {

        map.setFeatureState({
            source: 'composite',
            sourceLayer: "building",
            id: s.val().id,

        }, { seleccionado: false });

    })


map.on('click', function(e) {

    let popup = new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML("<button id ='enviar'onclick='enviarBaseDatos();'>Enviar</button><br><button id ='borrar'onclick='borrarBaseDatos();'>Borrar</button>")
        .addTo(map);

    function fechaHecho() {
        var today = new Date()
        var d = today.getDate();
        var m = today.getMonth();
        var y = today.getFullYear();
        return d + " /" + m + "/ " + y;
    };
    var fechaHecho = fechaHecho();
    var features = map.queryRenderedFeatures(e.point);
    var numero = features[0].id;
    var edificio = {
        id: numero,
        fecha: fechaHecho,
    }
    document.getElementById('enviar').onclick =
        function enviarBaseDatos() {

            database.ref("LevalloisN1/" + edificio.id)
                .set(edificio);
            popup.remove()
        }
    document.getElementById('borrar').onclick =
        function borrarBaseDatos() {

            firebase.database().ref("LevalloisN1/" + numero).remove();
            popup.remove()
        };

})