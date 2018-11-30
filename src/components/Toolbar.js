import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  UncontrolledDropdown,
} from 'reactstrap';
import Notification from './Notification';

class Toolbar extends React.Component {

  constructor(props) {
    super(props);

    this.toggleMonthSlider = this.toggleMonthSlider.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);

    this.state = {
      showMonthSlider: false,
    };
  }

  toggleMonthSlider() {
    this.setState({
      showMonthSlider: !this.state.showMonthSlider,
    });
  }

  onSelectRegion(region) {
    const data = { region };

    if (region === 'latvia' && this.props.category === 'land') {
      data.category = 'apartment';
    }

    this.props.onUpdate(data);
  }

  onSelectCategory(value) {
    this.props.onUpdate({
      category: value,
    });
  }

  onSelectType(value) {
    this.props.onUpdate({
      type: value,
    });
  }

  onSliderChange(change) {
    this.props.onUpdate({
      activeTimeframe: change,
    });
  }

  render() {
    const maxTimeframe = Object.keys(this.props.timeframes).length - 1;
    let selectedCategory;

    switch (this.props.category) {
      case 'apartment':
        selectedCategory = 'Dzīvoklis';
        break;
      case 'house':
        selectedCategory = 'Māja';
        break;
      case 'land':
        selectedCategory = 'Zeme';
        break;
      default:
        break;
    }

    return (
      <footer>
        <Notification></Notification>

        { this.state.showMonthSlider &&
          <div className="slider">
            <Slider vertical dots min={0} max={maxTimeframe} marks={this.props.timeframes} step={1} onChange={this.onSliderChange} value={this.props.activeTimeframe} included={false} />
          </div>
        }

        <Navbar className="navbar-dark bg-dark fixed-bottom">
          <Nav>

            <Button color="link" className={this.state.showMonthSlider ? 'active' : ''} onClick={this.toggleMonthSlider}>
              <i className="far fa-calendar-alt"></i>
              <span className="ml-2 d-none d-sm-inline-block">
                { this.props.timeframes[this.props.activeTimeframe] }
              </span>
            </Button>

            <UncontrolledDropdown>
              <DropdownToggle nav>
                <i className="far fa-map"></i>
                <span className="ml-2 d-none d-sm-inline-block">
                  { this.props.region === 'latvia' ? 'Latvija' : 'Rīga' }
                </span>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem header>Reģions</DropdownItem>
                <DropdownItem active={this.props.region === 'riga'} onClick={this.onSelectRegion.bind(this, 'riga')}>
                  Rīga
                </DropdownItem>
                <DropdownItem active={this.props.region === 'latvia'} onClick={this.onSelectRegion.bind(this, 'latvia')}>
                  Latvija
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown>
              <DropdownToggle nav>
                <i className="far fa-building"></i>
                <span className="ml-2 d-none d-sm-inline-block">
                  { selectedCategory }
                </span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>Īpašuma veids</DropdownItem>
                <DropdownItem active={this.props.category === 'apartment'} onClick={this.onSelectCategory.bind(this, 'apartment')}>Dzīvoklis</DropdownItem>
                <DropdownItem active={this.props.category === 'house'} onClick={this.onSelectCategory.bind(this, 'house')}>Māja</DropdownItem>
                { this.props.region !== 'latvia' &&
                  <DropdownItem active={this.props.category === 'land'} onClick={this.onSelectCategory.bind(this, 'land')}>Zeme</DropdownItem>
                }
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown>
              <DropdownToggle nav>
                <i className="far fa-handshake"></i>
                <span className="ml-2 d-none d-sm-inline-block">
                  { this.props.type === 'rent' ? 'Īrē' : 'Pārdod' }
                </span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>Darījumu tips</DropdownItem>
                <DropdownItem active={this.props.type === 'sell'} onClick={this.onSelectType.bind(this, 'sell')}>Pārdod</DropdownItem>
                <DropdownItem active={this.props.type === 'rent'} onClick={this.onSelectType.bind(this, 'rent')}>Īrē</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <NavItem>
              <NavLink href="#/pulse" className="text-danger">Atvērt tirgus pulsu</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </footer>
    );
  }

}

Toolbar.propTypes = {
  region: PropTypes.string,
  category: PropTypes.string,
  type: PropTypes.string,
  activeTimeframe: PropTypes.number,
  onUpdate: PropTypes.func,
};

export default Toolbar;
