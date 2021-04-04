import { List } from 'semantic-ui-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <div className={styles.container}>
      <List bulleted horizontal link>
        <List.Item
          as="a"
          href="https://pinger.brokalys.com/#/terms-and-conditions"
          target="_blank"
        >
          Terms & Conditions
        </List.Item>
        <List.Item
          as="a"
          href="https://pinger.brokalys.com/#/privacy-policy"
          target="_blank"
        >
          Privacy Policy
        </List.Item>
      </List>
    </div>
  );
}
