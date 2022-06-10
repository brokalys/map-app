import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Menu, Message } from 'semantic-ui-react';

import BuildingToolbar from './BuildingToolbar';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const onReturnHomeClick = useCallback(() => {
    const [, coords] = location.pathname.split('/');
    navigate(`/${coords}${location.search}`);
  }, [location, navigate]);

  return (
    <>
      <Menu secondary>
        <Menu.Item fitted>
          <Button
            content="Return home"
            icon="left arrow"
            labelPosition="left"
            onClick={onReturnHomeClick}
          />
        </Menu.Item>
      </Menu>

      <Menu secondary>
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
