import Map from 'src/components/Map';

import styles from './SplitPaneRight.module.css';

function SplitPaneRight() {
  return (
    <div className={styles.container}>
      <Map />
    </div>
  );
}

export default SplitPaneRight;
