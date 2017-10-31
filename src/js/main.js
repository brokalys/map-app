var prices = Object.keys(avgPrices).map(function(key) { return avgPrices[key]; });
var maxPrice = Math.max.apply(null, prices);
var minPrice = Math.min.apply(null, prices);

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
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function setPolygon(map, region) {
  var triangleCoords = regions[region].map(function(row) {
    return { lng: row[0], lat: row[1] };
  });

  var color = calcHue(avgPrices[region]);

  var bermudaTriangle = new google.maps.Polygon({
    paths: triangleCoords,
    strokeColor: color,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color,
    fillOpacity: 0.35,
  });
  bermudaTriangle.setMap(map);
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

  Object.keys(regions).forEach(function (key) {
    setPolygon(map, key);
  });
}
