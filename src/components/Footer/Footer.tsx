import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <div className={styles.container}>
      <p className={styles.copyright}>
        Real sales data source:{' '}
        <a href="https://www.vzd.gov.lv/" target="_blank" rel="noreferrer">
          VZD
        </a>
        ; licensed under{' '}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noreferrer"
        >
          CC 4.0
        </a>
      </p>

      <div className={styles.legal}>
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
    </div>
  );
}
