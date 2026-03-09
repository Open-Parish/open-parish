import { Card } from '@mantine/core';
import { IconArrowUpRight, IconSettings } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import styles from '../Dashboard.module.css';

export function SettingsCardSection() {
  return (
    <div>
      <p className={styles.sectionLabel}>Configuration</p>
      <Card component={Link} to="/settings" padding="md" className={styles.settingsCard} maw={480}>
        <div className={styles.settingsInner}>
          <div className={styles.settingsIconWrap}>
            <IconSettings size={22} />
          </div>
          <div className={styles.settingsText}>
            <p className={styles.settingsTitle}>Parish Settings</p>
            <p className={styles.settingsSub}>Header lines, priest name, signature, and logo</p>
          </div>
          <IconArrowUpRight size={15} style={{ color: '#c9a157', flexShrink: 0 }} />
        </div>
      </Card>
    </div>
  );
}
