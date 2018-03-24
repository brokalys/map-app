import React from 'react';
import { Gmaps } from 'react-gmaps';
import parse from 'csv-parse/lib/sync';
import slugify from 'slugify';

const coords = {
  lat: 56.946285,
  lng: 24.105078,
};

const styles = [{
  featureType: 'all',
  elementType: 'all',
  stylers: [{
    invert_lightness: true,
  }, {
    saturation: 10,
  }, {
    lightness: 30,
  }, {
     gamma: 0.5,
  }, {
    hue: '#435158',
  }],
}];

const params = {v: '3.exp'}; // @todo: key

class App extends React.Component {

  async onMapCreated(map) {
    map.data.loadGeoJson('https://raw.githubusercontent.com/brokalys/sls-data-extraction/master/data/riga-geojson.json')

    map.setOptions({
      disableDefaultUI: true
    });

    const response = await fetch('https://raw.githubusercontent.com/brokalys/data/master/data/apartment/sell-monthly.csv');
    const csvData = await response.text();
    const data = parse(csvData);

    const header = data[0].map((name) => slugify(name));
    const priceData = data[data.length - 2];

    const prices = {};

    for (var i = 3; i < header.length; i++) {
      prices[header[i]] = parseInt(priceData[i], 10);
    }

    const mappedPrices = Object.keys(prices).map((key) => prices[key]);
    const maxPrice = Math.max.apply(null, mappedPrices);
    const minPrice = Math.min.apply(null, mappedPrices);

    map.data.setStyle((feature) => {
      const region = slugify(feature.getProperty('apkaime'));
      const price = prices[region];
      const color = this.calcHue(price, maxPrice, minPrice);

      if (price <= 0) {
        return;
      }

      return {
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.2,
      };
    });

    const infoWindow = new window.google.maps.InfoWindow;
    map.data.addListener('click', (event) => {
      const name = event.feature.getProperty('apkaime');
      const region = slugify(name);
      const price = prices[region].toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1\'');

      infoWindow.setContent(`Mediānā dzīvokļa pārdošanas cena: ${price} EUR (${name})`);
      infoWindow.setPosition(event.latLng);
      infoWindow.open(map);
    });
  }

  render() {
    return (
      <Gmaps
        width={'100%'}
        height={'100%'}
        lat={coords.lat}
        lng={coords.lng}
        zoom={12}
        params={params}
        styles={styles}
        onMapCreated={this.onMapCreated.bind(this)}>
      </Gmaps>
    );
  }

  calcHue(price, maxPrice, minPrice) {
    var cur = price - minPrice;
    var max = maxPrice - minPrice;
    var hue = Math.floor(((1 - cur / max) * 100) * 1.2);
    return this.hslToHex(hue, 50, 50);
  }

  hslToHex(h, s, l) {
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

}

export default App;
