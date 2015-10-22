$(function() {
  var levels = {
    null: {
      level: 'safe',
      colour: 'green',
    },
    55: {
      level: 'harmful',
      colour: 'yellow',
    },
    60: {
      level: 'harmful',
      colour: 'yellow',
    },
    65: {
      level: 'dangerous',
      colour: 'red',
    },
    70: {
      level: 'dangerous',
      colour: 'orange',
    },
    75: {
      level: 'very-dangerous',
      colour: 'red',
    },
  };

  var marker;
  var map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: true,
  });
  map.zoomControl.setPosition('topright');
  map.attributionControl.setPrefix('');
  map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }));

  var noiseCurrentLayer = new L.GeoJSON(noiseCurrent, {
    style: function(feat) {
      return {
        clickable: false,
        stroke: true,
        weight: 1,
        color: '#254B80',
        fillColor: '#3264AB',
        fillOpacity: 0.25,
      };
    },
    onEachFeature: function(feat) {
      feat.properties.dB = parseInt(feat.properties.Noise_Cont.split(' ')[0]);
    },
  });
  map.addLayer(noiseCurrentLayer);

  var noiseProposedLayer = new L.GeoJSON(noiseProposed, {
    style: function(feat) {
      return {
        clickable: false,
        stroke: true,
        weight: 1,
        color: '#991217',
        fillColor: '#ED1C24',
        fillOpacity: 0.25,
      };
    },
    onEachFeature: function(feat) {
      feat.properties.dB = parseInt(feat.properties.Noise_Cont.split(' ')[0]);
    },
  });
  map.addLayer(noiseProposedLayer);
  map.fitBounds(noiseProposedLayer.getBounds());
  map.setZoom(12);

  function loudest(latlng, areas) {
    var matches = leafletPip.pointInLayer(latlng, areas, false);

    if (!matches.length) {
      return null;
    }

    return _.max(matches, function(m) { return m.feature.properties.dB; });
  }

  function showReport(latlng) {
    // which feature is it in?
    var current = loudest(latlng, noiseCurrentLayer);
    var proposed = loudest(latlng, noiseProposedLayer);

    var currentDb = current ? current.feature.properties.dB : null;
    var proposedDb = proposed ? proposed.feature.properties.dB : null;

    $('.report').removeClass('hidden');

    $('.report .current')
      .find('.level')
        .hide()
        .end()
      .find('.level-' + levels[currentDb].level)
        .show();

    $('.report .proposed')
      .find('.level')
        .hide()
        .end()
      .find('.level-' + levels[proposedDb].level)
        .show();
  }

  function showPoint(latlng) {
    if (!marker) { 
      marker = L.marker(latlng).addTo(map);
    } else {
      marker.setLatLng(latlng);
    }

    // how bad is the noise?
    showReport(latlng);
  }


  map.on('click', function(e) {
    showPoint(e.latlng);
  });


  $('.address-form').on('submit', function(e) {
    e.preventDefault();
    var addr = $('#address').val();

    $.getJSON('http://mapit.code4sa.org/address?generation=1&type=CY&partial=1&address=' + encodeURIComponent(addr))
      .done(function(result) {
        if (result.addresses.length) {
          var addr = result.addresses[0];

          showPoint(L.latLng(addr.lat, addr.lng));
        }
      });
  });
});
