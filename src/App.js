import React from 'react';
import { Gmaps } from 'react-gmaps';
import parse from 'csv-parse/lib/es5/sync';
import colormap from 'colormap';

const coords = {
  lat: 56.98,
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

const params = {
  v: '3.exp',
  key: process.env.REACT_APP_GMAPS_KEY || undefined,
};

class App extends React.Component {

  async onMapCreated(map) {
    map.data.loadGeoJson('https://raw.githubusercontent.com/brokalys/sls-data-extraction/master/data/riga-geojson.json')

    map.setOptions({
      disableDefaultUI: true,
      zoomControl: true,
    });

    const { header, body } = await this.loadPriceData();
    const priceData = body[body.length - 1];
    const uniquePrices = [...new Set(priceData)].length;

    const colors = colormap({
      colormap: 'autumn',
      nshades: uniquePrices,
      format: 'hex',
    }).reverse();

    this.regions = header.map((name, index) => {
      return {
        name,
        price: parseInt(priceData[index], 10),
      };
    })
      .sort((a, b) => a.price - b.price)
      .map((region, index,  all) => {
        const prev = all[index - 1] || {};
        const colorIndex = prev.price === region.price ? prev.colorIndex || 0 : prev.colorIndex + 1;

        region.colorIndex = colorIndex;
        region.color = colors[colorIndex];

        return region;
      });

    map.data.setStyle((feature) => {
      const regionName = feature.getProperty('apkaime');
      const region = this.findRegionByName(regionName);

      if (region.price <= 0) {
        return;
      }

      return {
        strokeColor: region.color,
        strokeWeight: .1,
        fillColor: region.color,
        fillOpacity: 0.4,
      };
    });

    const infoWindow = new window.google.maps.InfoWindow();
    map.data.addListener('click', (event) => {
      const regionName = event.feature.getProperty('apkaime');
      const region = this.findRegionByName(regionName);
      const price = region.price.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1\'');

      infoWindow.setContent(`Mediānā dzīvokļa pārdošanas cena:<br>${price} EUR (${region.name})`);
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
        zoom={11}
        params={params}
        styles={styles}
        onMapCreated={this.onMapCreated.bind(this)}>
      </Gmaps>
    );
  }

  async loadPriceData() {
    const response = await fetch('https://raw.githubusercontent.com/brokalys/data/master/data/apartment/sell-monthly.csv');
    const csvData = await response.text();
    const data = parse(csvData);

    return {
      header: data[0].slice(3),
      body: data.slice(1).map((row) => row.slice(3)),
    };
  }

  findRegionByName(name) {
    return this.regions.find((region) => region.name === name);
  }

}

export default App;
