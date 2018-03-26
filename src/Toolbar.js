import React from 'react';
import PropTypes from 'prop-types';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class Toolbar extends React.Component {

  constructor(props) {
    super(props);

    this.toggleRegion = this.toggleRegion.bind(this);
    this.toggleCategory = this.toggleCategory.bind(this);
    this.toggleType = this.toggleType.bind(this);

    this.state = {
      regionDropdownOpen: false,
      categoryDropdownOpen: false,
      typeDropdownOpen: false,
    };
  }

  toggleRegion() {
    this.setState((prevState) => ({
      regionDropdownOpen: !prevState.regionDropdownOpen,
    }));
  }

  toggleCategory() {
    this.setState((prevState) => ({
      categoryDropdownOpen: !prevState.categoryDropdownOpen,
    }));
  }

  toggleType() {
    this.setState((prevState) => ({
      typeDropdownOpen: !prevState.typeDropdownOpen,
    }));
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

  render() {
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
      <div className="buttons">

        <ButtonDropdown isOpen={this.state.regionDropdownOpen} toggle={this.toggleRegion}>
          <DropdownToggle outline color="danger" caret>
            { this.props.region === 'latvia' ? 'Latvija' : 'Rīga' }
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={this.onSelectRegion.bind(this, 'riga')}>Rīga</DropdownItem>
            <DropdownItem onClick={this.onSelectRegion.bind(this, 'latvia')}>Latvija</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>

        <ButtonDropdown isOpen={this.state.categoryDropdownOpen} toggle={this.toggleCategory}>
          <DropdownToggle outline color="danger" caret>
            { selectedCategory }
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={this.onSelectCategory.bind(this, 'apartment')}>Dzīvoklis</DropdownItem>
            <DropdownItem onClick={this.onSelectCategory.bind(this, 'house')}>Māja</DropdownItem>
            { this.props.region !== 'latvia' &&
              <DropdownItem onClick={this.onSelectCategory.bind(this, 'land')}>Zeme</DropdownItem>
            }
          </DropdownMenu>
        </ButtonDropdown>

        <ButtonDropdown isOpen={this.state.typeDropdownOpen} toggle={this.toggleType}>
          <DropdownToggle outline color="danger" caret>
            { this.props.type === 'rent' ? 'Īrē' : 'Pārdod' }
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem key="sell" onClick={this.onSelectType.bind(this, 'sell')}>Pārdod</DropdownItem>
            <DropdownItem key="rent" onClick={this.onSelectType.bind(this, 'rent')}>Īrē</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>

      </div>
    );
  }

}

Toolbar.propTypes = {
  region: PropTypes.string,
  category: PropTypes.string,
  type: PropTypes.string,
  onUpdate: PropTypes.func,
};

export default Toolbar;
