var prices = prices.median;
var mappedPrices = Object.keys(prices).map(function(key) { return prices[key]; });
var maxPrice = Math.max.apply(null, mappedPrices);
var minPrice = Math.min.apply(null, mappedPrices);

function calcHue(price) {
  var cur = price - minPrice;
  var max = maxPrice - minPrice;
  var hue = Math.floor(((1 - cur / max) * 100) * 1.2);
  return hslToHex(hue, 50, 50);
}

function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  var r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function (p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  var toHex = function(x) {
    var hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

var infoWindow;

function setPolygon(map, region) {
  var coords = regions[region].map(function(row) {
    return { lng: row[0], lat: row[1] };
  });

  var color = calcHue(prices[region]);

  var polygon = new google.maps.Polygon({
    paths: coords,
    strokeColor: color,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color,
    fillOpacity: 0.35,
  });
  polygon.setMap(map);

  polygon.addListener('click', function(event) {
    infoWindow.setContent('Cena: ' + prices[region] + ' EUR');
    infoWindow.setPosition(event.latLng);

    infoWindow.open(map);
  });
}

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {
      lat: 56.946285,
      lng: 24.105078,
    },
    mapTypeId: 'terrain',
  });

  infoWindow = new google.maps.InfoWindow;

  Object.keys(regions).forEach(function (key) {
    setPolygon(map, key);
  });
}
