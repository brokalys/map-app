import React from 'react';
import GithubCorner from 'react-github-corner';
import { Route, Switch } from 'react-router-dom';
import { Container, Grid } from 'semantic-ui-react';

import Footer from 'src/components/Footer';
import Navigation from 'src/components/Navigation';
import SplitPaneRight from 'src/containers/SplitPaneRight';
import Building from 'src/pages/Building';
import Home from 'src/pages/Home';
import LocateBuilding from 'src/pages/LocateBuilding';

import styles from './App.module.css';

function App(props) {
  return (
    <>
      <Container fluid className={styles.container}>
        <GithubCorner
          className={styles.githubCorner}
          href="https://github.com/brokalys/map-app"
          direction="left"
        />
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
                <Navigation />

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
      </Container>

      <Footer />
    </>
  );
}

export default App;
