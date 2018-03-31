import React from 'react';
import { Gmaps } from 'react-gmaps';
import parse from 'csv-parse/lib/es5/sync';
import colormap from 'colormap';
import progress from 'nprogress';

import Toolbar from '../components/Toolbar';

const coords = {
  lat: 56.98,
  lng: 24.105078,
};

const styles = [
  {
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
  },
];

const params = {
  v: '3.exp',
  key: process.env.REACT_APP_GMAPS_KEY || undefined,
};

class Home extends React.Component {

  constructor(props) {
    super(props);

    this.onMapCreated = this.onMapCreated.bind(this);
    this.onToolbarUpdate = this.onToolbarUpdate.bind(this);

    this.state = {
      region: 'riga',
      category: 'apartment',
      type: 'sell',
    };

    this.loadedRegions = [];

    progress.configure({
      showSpinner: false,
      speed: 1000,
      trickleSpeed: 150,
    });
    progress.start();
  }

  onMapCreated(map) {
    this.loadRegion(map);

    this.map = map;
    this.infoWindow = new window.google.maps.InfoWindow();

    this.onMapChanged();
  }

  loadRegion(map) {
    const region = this.state.region;

    if (this.loadedRegions.indexOf(region) >= 0) {
      return;
    }

    this.loadedRegions.push(region);
    map.data.loadGeoJson(`https://raw.githubusercontent.com/brokalys/sls-data-extraction/master/data/${region}-geojson.json`);
  }

  async onMapChanged() {
    if (progress.isStarted() === false) {
      progress.start();
    }

    const map = this.map;

    this.infoWindow.close();

    map.setOptions({
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.TOP_LEFT,
      },
    });

    let data;

    try {
      data = await this.loadPriceData();
    } catch (e) {
      console.error(e);
      alert('Something really bad happened. Please try again later.');
      return;
    }

    const { header, body, timeframes } = data;

    const priceData = body[body.length - 1];
    const [start, end] = timeframes[timeframes.length - 1];
    const uniquePrices = [...new Set(priceData)].length;

    const colors = colormap({
      colormap: 'autumn',
      nshades: uniquePrices,
      format: 'hex',
    }).reverse();

    this.regions = header.map((name, index) => ({
      name,
      price: parseInt(priceData[index], 10),
    }))
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

      // eslint-disable-next-line
      if (!region || region.price <= 0 || feature.getProperty('Level') < 2 && regionName !== 'Rīga') {
        return {
          visible: false,
        };
      }

      return {
        strokeColor: region.color,
        strokeWeight: 0.1,
        fillColor: region.color,
        fillOpacity: 0.5,
        zIndex: feature.getProperty('Level') || 1,
      };
    });

    map.data.addListener('click', (event) => {
      const regionName = event.feature.getProperty('apkaime');
      const region = this.findRegionByName(regionName);

      if (!region || region.price <= 0) {
        return;
      }

      const price = region.price.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1\'');
      const timeframe = [start, end].join(' - ');

      this.infoWindow.setContent(`Mediānā cena:<br><strong>${price} EUR</strong> (${region.name})<hr>${timeframe}`);
      this.infoWindow.setPosition(event.latLng);
      this.infoWindow.open(map);
    });

    progress.done();
  }

  onToolbarUpdate(change) {
    this.setState(change, () => {
      if (change.region) {
        this.loadRegion(this.map);
      }

      this.onMapChanged();
    });
  }

  render() {
    return (
      <div className="wrapper">
        <Gmaps
          width={'100%'}
          height={'100%'}
          lat={coords.lat}
          lng={coords.lng}
          zoom={11}
          params={params}
          styles={styles}
          onMapCreated={this.onMapCreated}
        />

        <Toolbar
          region={this.state.region}
          category={this.state.category}
          type={this.state.type}
          onUpdate={this.onToolbarUpdate}
        />
      </div>
    );
  }

  async loadPriceData() {
    const response = await fetch(`https://raw.githubusercontent.com/brokalys/data/master/data/${this.state.category}/${this.state.type}-monthly-${this.state.region}.csv`);
    const csvData = await response.text();
    const data = parse(csvData);

    return {
      header: data[0].slice(3),
      body: data.slice(1).map((row) => row.slice(3)),
      timeframes: data.slice(1).map((row) => row.slice(0, 2)),
    };
  }

  findRegionByName(name) {
    return this.regions.find((region) => region.name === name);
  }

}

export default Home;
