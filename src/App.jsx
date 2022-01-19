import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  Container,
  Grid,
  Icon,
  Menu,
  Message,
  Sidebar,
} from 'semantic-ui-react';

import Footer from 'src/components/Footer';
import SplitPaneRight from 'src/containers/SplitPaneRight';
import Building from 'src/pages/Building';
import Home from 'src/pages/Home';
import LocateBuilding from 'src/pages/LocateBuilding';

import styles from './App.module.scss';

function App(props) {
  return (
    <Sidebar.Pushable>
      <Sidebar
        as={Menu}
        direction="left"
        animation="overlay"
        visible
        inverted
        vertical
        className={styles.navigation}
      >
        <div>
          <Menu.Item className={styles.navigationLogo}>
            <img src="https://brokalys.com/favicon.png" alt="logo" />
            <h1>Brokalys</h1>
          </Menu.Item>

          <Menu.Item>
            <Menu.Header className={styles.header}>Other Products</Menu.Header>

            <Menu.Menu>
              <Menu.Item
                href="https://chrome.google.com/webstore/detail/brokalys-sslv-historical/pmjalfejchcofiplefmhglefgbkocmmh"
                target="_blank"
                className={styles.item}
              >
                <Icon name="chrome" />
                Chrome Extension
              </Menu.Item>
              <Menu.Item
                href="https://pinger.brokalys.com?ref=map"
                target="_blank"
                className={styles.item}
              >
                <Icon name="bell outline" />
                Pinger Notifications
              </Menu.Item>
            </Menu.Menu>
          </Menu.Item>

          <Menu.Item>
            <Menu.Header className={styles.header}>Support</Menu.Header>

            <Menu.Menu>
              <Menu.Item
                href="https://www.paypal.com/paypalme/matissjanisaboltins"
                target="_blank"
                className={styles.item}
              >
                <Icon name="heart" />
                Support The Project
              </Menu.Item>
              <Menu.Item
                href="mailto:matiss@brokalys.com?subject=Feedback"
                className={styles.item}
              >
                <Icon name="envelope outline" />
                Send Feedback
              </Menu.Item>
            </Menu.Menu>
          </Menu.Item>
        </div>

        <div className={styles.message}>
          <Message
            floating
            header="Interested in a specific building?"
            content="Zoom in on the map and click on a building. This will show data about your selected building."
          />
        </div>

        <Footer />
      </Sidebar>

      <Sidebar.Pusher as={Container} fluid className={styles.container}>
        <Switch>
          <Route
            path={[
              '/:lat,:lng,:zoom/building/:buildingId(\\d+)',
              '/:lat,:lng,:zoom/locate-building',
              '/:lat,:lng,:zoom',
              '/',
            ]}
          >
            <Grid className={styles.grid}>
              <Grid.Column computer={9} className={styles.leftPanel}>
                <Switch>
                  <Route path="/:lat,:lng,:zoom/building/:buildingId(\d+)">
                    <Building />
                  </Route>

                  <Route path="/:lat,:lng,:zoom/locate-building">
                    <LocateBuilding />
                  </Route>

                  <Route path="*">
                    <Home />
                  </Route>
                </Switch>
              </Grid.Column>
              <Grid.Column computer={7} className={styles.rightPanel}>
                <SplitPaneRight />
              </Grid.Column>
            </Grid>
          </Route>
        </Switch>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
}

export default App;
