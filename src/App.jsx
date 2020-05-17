import React from "react";
import { Container, Grid } from "semantic-ui-react";

import SplitPaneLeft from "containers/SplitPaneLeft";
import SplitPaneRight from "containers/SplitPaneRight";

import styles from "./App.module.css";

function App(props) {
  return (
    <Container fluid className={styles.container}>
      <Grid className={styles.grid}>
        <Grid.Column computer={9} className={styles.leftPanel}>
          <SplitPaneLeft />
        </Grid.Column>
        <Grid.Column computer={7} className={styles.rightPanel}>
          <SplitPaneRight />
        </Grid.Column>
      </Grid>
    </Container>
  );
}

export default App;
