import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        {/* Logo & Brand */}
        <div className={styles.brand}>
          <div className={styles.logoIcon} aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Pill / Cross icon */}
              <rect x="1" y="1" width="30" height="30" rx="8" fill="white" fillOpacity="0.15"/>
              {/* Cross shape */}
              <rect x="13" y="5" width="6" height="22" rx="3" fill="white"/>
              <rect x="5" y="13" width="22" height="6" rx="3" fill="white"/>
            </svg>
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>Expanse</span>
            <span className={styles.brandSub}>Pharmaceutical</span>
          </div>
        </div>

        {/* Badge */}
        <div className={styles.badge}>
          <span className={styles.badgeDot} aria-hidden="true" />
          <span className={styles.badgeLabel}>Est. 2010</span>
        </div>
      </div>
    </header>
  )
}
