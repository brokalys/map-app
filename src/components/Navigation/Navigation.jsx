import React from 'react';
import { Button, Icon, Menu, Popup } from 'semantic-ui-react';

import SupportButton from 'src/components/SupportButton';

import styles from './Navigation.module.css';

function Navigation() {
  function onFeedbackClick() {
    window.location.href = 'mailto:matiss@brokalys.com?subject=Feedback';
  }

  return (
    <Menu secondary>
      <Menu.Header>
        <img src="https://brokalys.com/favicon.png" alt="logo" height="40px" />
      </Menu.Header>

      <Menu.Item position="right">
        <Popup
          content="Sign up for instant notifications about classifieds matching your parameters"
          inverted
          position="bottom right"
          trigger={
            <a
              href="https://pinger.brokalys.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.notificationLink}
              data-testid="pinger-button"
            >
              <Icon name="bell outline" className={styles.shake} />
            </a>
          }
        />
      </Menu.Item>

      {/*<Menu.Item fitted>
        <Button basic animated="vertical">
          <Button.Content visible>Compare</Button.Content>
          <Button.Content hidden>
            <Icon name="crosshairs" />
          </Button.Content>
        </Button>
      </Menu.Item>*/}

      <Menu.Item fitted>
        <Button primary animated="vertical" onClick={onFeedbackClick}>
          <Button.Content visible>Give feedback</Button.Content>
          <Button.Content hidden>
            <Icon name="mail" />
          </Button.Content>
        </Button>
      </Menu.Item>
      <Menu.Item fitted>
        <SupportButton />
      </Menu.Item>
    </Menu>
  );
}

export default Navigation;
