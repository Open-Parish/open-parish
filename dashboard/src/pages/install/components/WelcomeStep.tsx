import { Button } from '@mantine/core';
import { IconDroplet, IconFlame, IconHearts } from '@tabler/icons-react';
import type { WelcomeStepProps } from './WelcomeStep.types';
import styles from '../InstallWizard.module.css';

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <>
      <ul className={styles.welcomeList}>
        <li className={styles.welcomeItem}>
          <div className={styles.welcomeDot}>
            <IconDroplet size={14} />
          </div>
          <div className={styles.welcomeItemText}>
            <p className={styles.welcomeItemTitle}>Sacramental Records</p>
            <p className={styles.welcomeItemDesc}>Baptismal, confirmation, marriage, and death certificates.</p>
          </div>
        </li>
        <li className={styles.welcomeItem}>
          <div className={styles.welcomeDot}>
            <IconFlame size={14} />
          </div>
          <div className={styles.welcomeItemText}>
            <p className={styles.welcomeItemTitle}>Print-ready Certificates</p>
            <p className={styles.welcomeItemDesc}>Generate and print official parish documents instantly.</p>
          </div>
        </li>
        <li className={styles.welcomeItem}>
          <div className={styles.welcomeDot}>
            <IconHearts size={14} />
          </div>
          <div className={styles.welcomeItemText}>
            <p className={styles.welcomeItemTitle}>Parish Customisation</p>
            <p className={styles.welcomeItemDesc}>Set your parish name, header, priest name, and logo.</p>
          </div>
        </li>
      </ul>
      <div className={styles.actions}>
        <Button className={styles.btnPrimary} onClick={onNext}>
          Get started →
        </Button>
      </div>
    </>
  );
}
