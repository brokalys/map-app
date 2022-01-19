import styles from './Footer.module.css';

export default function Footer() {
  return (
    <div className={styles.container}>
      <a
        href="https://pinger.brokalys.com/#/terms-and-conditions?ref=map"
        target="_blank"
        rel="noreferrer"
      >
        Terms & Conditions
      </a>
      ●
      <a
        href="https://pinger.brokalys.com/#/privacy-policy?ref=map"
        target="_blank"
        rel="noreferrer"
      >
        Privacy Policy
      </a>
    </div>
  );
}
