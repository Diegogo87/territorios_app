mapboxgl.accessToken = 'pk.eyJ1IjoiaGlndWVyb2RpZWdvIiwiYSI6ImNrN3Q2a25yNTBtc2ozaG1yam8zNnRibHUifQ.Zgmrlgnrw54eXySGuI3DIQ';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/higuerodiego/ck7t6ytf00hno1iqyycuc6pm6/draft', // stylesheet location
    center: [2.290078, 48.895353], // starting position [lng, lat]
    zoom: 17 // starting zoom
});
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

    map.setFeatureState({
        source: 'composite',
        sourceLayer: "building",
        id: 64799733,

    }, {
        seleccionado: true
    });
    map.setFeatureState({
        source: 'composite',
        sourceLayer: "building",
        id: 64800214,

    }, {
        seleccionado: true
    });

    // map.setFeatureState({ id: 64799733, source: "edificiosHechos" });



})

map.on('click', 'porHacer', function(e) {

    var features = map.queryRenderedFeatures(e.point);
    var numero = features[0].id;

    map.setFeatureState({
        source: 'composite',
        sourceLayer: "building",
        id: numero,

    }, {
        seleccionado: true
    });


    map.getSource('edificiosHechos').setData({
        "type": "FeatureCollection",
        "features": e.features,
    });

})