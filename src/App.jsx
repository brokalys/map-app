import React from 'react';
import { Switch, Route } from 'react-router-dom';
import GithubCorner from 'react-github-corner';
import { Container, Grid } from 'semantic-ui-react';
import Navigation from 'components/Navigation';
import SplitPaneRight from 'containers/SplitPaneRight';
import Building from 'pages/Building';
import Home from 'pages/Home';
import styles from './App.module.css';

function App(props) {
  return (
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
  );
}

export default App;
