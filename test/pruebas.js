	  map.on('click', function(e) {
	      var features = map.queryRenderedFeatures(e.point);
	      var edificioId = features[0].id;
	      var coordenadas = features[0].geometry.coordinates[0];
	      console.log(edificioId);
	      console.log(features);
	      console.log(coordenadas)
	  })