var prices = {};
var map;

var mappedPrices;
var maxPrice;
var minPrice;

var slugify = function(text) {
  // Use hash map for special characters
  var specialChars = {"à":'a',"ķ":'k',"č":'c',"ē":'e',"ģ":'g',"ļ":'l',"ņ":'n',"š":'s',"ū":'u',"ž":'z',"ä":'a',"á":'a',"ā":'a',"â":'a',"æ":'a',"å":'a',"ë":'e',"è":'e',"é":'e', "ê":'e',"î":'i',"ī":'i',"ï":'i',"ì":'i',"í":'i',"ò":'o',"ó":'o',"ö":'o',"ô":'o',"ø":'o',"ù":'o',"ú":'u',"ü":'u',"û":'u',"ñ":'n',"ç":'c',"ß":'s',"ÿ":'y',"œ":'o',"ŕ":'r',"ś":'s',"ń":'n',"ṕ":'p',"ẃ":'w',"ǵ":'g',"ǹ":'n',"ḿ":'m',"ǘ":'u',"ẍ":'x',"ź":'z',"ḧ":'h',"·":'-',"/":'-',"_":'-',",":'-',":":'-',";":'-'};

  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/./g,(target, index, str) => specialChars[target] || target) // Replace special characters using the hash map
    .replace(/&/g, '-and-')         // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');             // Trim - from end of text
};

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

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {
      lat: 56.946285,
      lng: 24.105078,
    },
    mapTypeId: 'terrain',
  });

  infoWindow = new google.maps.InfoWindow;
}

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/brokalys/data/master/data/apartment/sell-monthly.csv', true);
xhr.onreadystatechange = function () {
  if (xhr.readyState == XMLHttpRequest.DONE) {
    var parts = $.csv.toArrays(xhr.responseText);
    var header = parts[0].map((name) => slugify(name));
    var priceData = parts[parts.length - 2];

    for (var i = 0; i < header.length; i++) {
      prices[header[i]] = parseInt(priceData[i], 10);
    }

    mappedPrices = Object.keys(prices).map(function(key) { return prices[key]; });
    maxPrice = Math.max.apply(null, mappedPrices);
    minPrice = Math.min.apply(null, mappedPrices);

    initMap();
    map.data.loadGeoJson('https://raw.githubusercontent.com/brokalys/sls-data-extraction/master/data/riga-geojson.json');

    map.data.setStyle(function(feature) {
      var region = slugify(feature.getProperty('apkaime'));
      var color = calcHue(prices[region]);

      return {
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35,
      };
    });

    map.data.addListener('click', function(event) {
      var region = slugify(event.feature.getProperty('apkaime'));
      infoWindow.setContent('Mediānā dzīvokļa cena: ' + prices[region] + ' EUR');
      infoWindow.setPosition(event.latLng);

      infoWindow.open(map);
    });
  }
};
xhr.send();
