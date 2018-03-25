import React from 'react';
import { Gmaps } from 'react-gmaps';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
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

  constructor(props) {
    super(props);

    this.onMapCreated = this.onMapCreated.bind(this);
    this.toggleCategory = this.toggleCategory.bind(this);
    this.toggleType = this.toggleType.bind(this);
    this.state = {
      categoryDropdownOpen: false,
      typeDropdownOpen: false,
      category: 'apartment',
      type: 'sell'
    };
  }

  toggleCategory() {
    this.setState({
      categoryDropdownOpen: !this.state.categoryDropdownOpen,
    });
  }

  toggleType(gg) {
    this.setState({
      typeDropdownOpen: !this.state.typeDropdownOpen,
    });
  }

  selectCategory(value) {
    this.state.category = value;
    this.onMapCreated(this.map);
  }

  selectType(value) {
    this.state.type = value;
    this.onMapCreated(this.map);
  }

  async onMapCreated(map) {
    if (this.map === undefined) {
      map.data.loadGeoJson('https://raw.githubusercontent.com/brokalys/sls-data-extraction/master/data/riga-geojson.json')
    }

    this.map = map;

    map.setOptions({
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.TOP_LEFT,
      },
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

      infoWindow.setContent(`Mediānā cena:<br>${price} EUR (${region.name})`);
      infoWindow.setPosition(event.latLng);
      infoWindow.open(map);
    });
  }

  render() {
    let selectedType;
    let selectedCategory;

    switch (this.state.type) {
      case 'rent':
        selectedType = 'Izīrē';
        break;
      case 'sell':
        selectedType = 'Pārdod';
        break;
    }

    switch (this.state.category) {
      case 'apartment':
        selectedCategory = 'Dzīvoklis';
        break;
      case 'house':
        selectedCategory = 'Māja';
        break;
      case 'land':
        selectedCategory = 'Zeme';
        break;
    }

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
          onMapCreated={this.onMapCreated}>
        </Gmaps>

        <div className="buttons">

          <ButtonDropdown isOpen={this.state.categoryDropdownOpen} toggle={this.toggleCategory}>
            <DropdownToggle outline color="danger" caret>
              { selectedCategory }
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={this.selectCategory.bind(this, 'apartment')}>Dzīvoklis</DropdownItem>
              <DropdownItem onClick={this.selectCategory.bind(this, 'house')}>Māja</DropdownItem>
              <DropdownItem onClick={this.selectCategory.bind(this, 'land')}>Zeme</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>

          <ButtonDropdown isOpen={this.state.typeDropdownOpen} toggle={this.toggleType}>
            <DropdownToggle outline color="danger" caret>
              { selectedType }
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem key="sell" onClick={this.selectType.bind(this, 'sell')}>Pārdod</DropdownItem>
              <DropdownItem key="rent" onClick={this.selectType.bind(this, 'rent')}>Izīrē</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>

        </div>
      </div>
    );
  }

  async loadPriceData() {
    const response = await fetch(`https://raw.githubusercontent.com/brokalys/data/master/data/${this.state.category}/${this.state.type}-monthly.csv`);
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
