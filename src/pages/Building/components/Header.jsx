import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Menu, Message } from 'semantic-ui-react';

import { returnToHomeClicked } from 'src/store/actions';

import BuildingToolbar from './BuildingToolbar';

export default function Header(props) {
  const dispatch = useDispatch();
  const onReturnClick = useCallback(
    () => dispatch(returnToHomeClicked()),
    [dispatch],
  );

  return (
    <>
      <Menu secondary>
        <Menu.Item fitted>
          <Button
            content="Return"
            icon="left arrow"
            labelPosition="left"
            onClick={onReturnClick}
          />
        </Menu.Item>

        <BuildingToolbar />
      </Menu>

      <Message info>
        <p>
          Data might be inaccurate. Some people provide wrong locations for
          their classifieds.
        </p>
      </Message>
    </>
  );
}

Header.propTypes = {};
