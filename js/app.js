$(function() {
  var marker;
  var map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: true,
  });
  
  map.attributionControl.setPrefix('');
  map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }));

  var newNoise = new L.GeoJSON(newNoiseGeoJson, {
    style: function(feat) {
      return {
        clickable: false,
        stroke: true,
        color: '#700',
        weight: 1,
        fillOpacity: 0.25,
        fillColor: '#ED1C24',
      };
    }
  });
  map.addLayer(newNoise);
  map.fitBounds(newNoise.getBounds());


  function showReport(latlng) {
    // which feature is it in?
    var matches = leafletPip.pointInLayer(latlng, newNoise, false);

    if (!matches.length) {
      $("#report").addClass('hidden');
      return;
    }

    var loudest = _.max(matches, function(m) { return m.feature.properties.Noise_Max_; });
    $('#report')
      .removeClass('hidden')
      .find('.decibels')
        .text(loudest.feature.properties.Noise_Max_);
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
