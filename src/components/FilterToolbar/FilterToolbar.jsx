import React, { useContext } from "react";
import { Dropdown, Menu } from "semantic-ui-react";
import { transliterate } from "transliteration";

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

  /**
   * Improved search operation to ignore all UTF-8 characters.
   */
  function onSearch(all, selected) {
    const regexp = new RegExp(transliterate(selected), "i");
    return all.filter((row) => regexp.test(transliterate(row.text)));
  }

  return (
    <div className={styles.container}>
      <Menu secondary>
        <Menu.Item fitted>
          <Dropdown
            placeholder="Select location"
            search
            selection
            defaultValue={context.location.default}
            options={context.location.options}
            onChange={onLocationChange}
            search={onSearch}
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
