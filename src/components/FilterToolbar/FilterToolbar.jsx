import React, { useContext } from "react";
import { Dropdown, Menu } from "semantic-ui-react";

import FilterContext from "context/FilterContext";
import styles from "./FilterToolbar.module.css";

function FilterToolbar() {
  const context = useContext(FilterContext);

  function onLocationChange(event, data) {
    context.location.setSelected(data.value);
  }

  function onCategoryChange(event, data) {
    context.category.setSelected(data.value);
  }

  function onTypeChange(event, data) {
    context.type.setSelected(data.value);
  }

  return (
    <div className={styles.container}>
      <Menu secondary>
        <Menu.Item fitted>
          <Dropdown
            placeholder="Select location"
            fluid
            search
            selection
            defaultValue={context.location.default}
            options={context.location.options}
            onChange={onLocationChange}
          />
        </Menu.Item>
        <Menu.Item fitted>
          <Dropdown
            placeholder="Select category"
            fluid
            selection
            defaultValue={context.category.default}
            options={context.category.options}
            onChange={onCategoryChange}
          />
        </Menu.Item>
        <Menu.Item fitted>
          <Dropdown
            placeholder="Select type"
            fluid
            selection
            defaultValue={context.type.default}
            options={context.type.options}
            onChange={onTypeChange}
          />
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default FilterToolbar;
