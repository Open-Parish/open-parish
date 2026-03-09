import { getGreeting } from '../utils/getGreeting';
import type { DashboardBannerProps } from './DashboardBanner.types';
import { CrossMark } from './CrossMark';
import styles from '../Dashboard.module.css';

export function DashboardBanner({ dateLabel, firstName }: Readonly<DashboardBannerProps>) {
  return (
    <div className={styles.banner}>
      <div className={styles.bannerOrb1} />
      <div className={styles.bannerOrb2} />
      <div className={styles.bannerBody}>
        <p className={styles.bannerEyebrow}>{dateLabel}</p>
        <h2 className={styles.bannerTitle}>
          {getGreeting()}, <span className={styles.bannerAccent}>{firstName}</span>
        </h2>
        <p className={styles.bannerSub}>Manage sacramental records and generate parish certificates.</p>
      </div>
      <CrossMark className={styles.bannerCross} />
    </div>
  );
}
