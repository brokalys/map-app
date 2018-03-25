import React from 'react';
import PropTypes from 'prop-types';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class Toolbar extends React.Component {

  constructor(props) {
    super(props);

    this.toggleCategory = this.toggleCategory.bind(this);
    this.toggleType = this.toggleType.bind(this);

    this.state = {
      categoryDropdownOpen: false,
      typeDropdownOpen: false,
    };
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

        <ButtonDropdown isOpen={this.state.categoryDropdownOpen} toggle={this.toggleCategory}>
          <DropdownToggle outline color="danger" caret>
            { selectedCategory }
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={this.onSelectCategory.bind(this, 'apartment')}>Dzīvoklis</DropdownItem>
            <DropdownItem onClick={this.onSelectCategory.bind(this, 'house')}>Māja</DropdownItem>
            <DropdownItem onClick={this.onSelectCategory.bind(this, 'land')}>Zeme</DropdownItem>
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
  category: PropTypes.string,
  type: PropTypes.string,
  onUpdate: PropTypes.func,
};

export default Toolbar;
