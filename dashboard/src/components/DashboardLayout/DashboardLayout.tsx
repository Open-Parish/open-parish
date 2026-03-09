import { Outlet, NavLink } from 'react-router-dom';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import {
  IconLayoutDashboard,
  IconSettings,
  IconDroplet,
  IconFlame,
  IconCross,
  IconHearts,
  IconSun,
  IconMoon,
  IconLogout,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react';
import { OpenParishMark } from '@/components/OpenParishMark/OpenParishMark';
import { useUi } from '@/context/UiContext';
import { useAuth } from '@/context/AuthContext';
import { getSettings } from '@/features/settings/settingsApi';
import styles from './DashboardLayout.module.css';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
  { path: '/baptismal', label: 'Baptismal', icon: IconDroplet },
  { path: '/confirmation', label: 'Confirmation', icon: IconFlame },
  { path: '/death', label: 'Death', icon: IconCross },
  { path: '/marriage', label: 'Marriage', icon: IconHearts },
  { path: '/settings', label: 'Settings', icon: IconSettings },
];

export function DashboardLayout() {
  const { sidebarOpen, toggleSidebar, colorScheme, toggleColorScheme } = useUi();
  const { email, logout } = useAuth();
  const settingsQuery = useQuery({ queryKey: ['settings'], queryFn: getSettings });

  const parishName = settingsQuery.data?.parishName || 'Our Lady of the Sacred Heart';
  return (
    <div className={`${styles.shell} ${sidebarOpen ? '' : styles.collapsed}`}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHead}>
          <OpenParishMark className={styles.logoMark} />
          <span className={styles.logoName}>Open Parish</span>
        </div>

        <nav className={styles.nav}>
          <div className={styles.sectionLabel}>Menu</div>

          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <Tooltip key={path} label={label} position="right" disabled={sidebarOpen} withArrow offset={12}>
              <NavLink
                to={path}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                <Icon size={18} className={styles.navIcon} />
                <span className={styles.navLabel}>{label}</span>
              </NavLink>
            </Tooltip>
          ))}
        </nav>

        <div className={styles.sidebarFoot}>
          <Tooltip
            label={sidebarOpen ? 'Collapse' : 'Expand'}
            position="right"
            disabled={sidebarOpen}
            withArrow
            offset={12}
          >
            <button className={styles.collapseBtn} onClick={toggleSidebar} type="button">
              {sidebarOpen ? (
                <IconChevronsLeft size={17} className={styles.navIcon} />
              ) : (
                <IconChevronsRight size={17} className={styles.navIcon} />
              )}
              <span className={styles.collapseBtnLabel}>Collapse</span>
            </button>
          </Tooltip>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.parishName}>{parishName}</span>
          </div>

          <div className={styles.headerRight}>
            <Tooltip label={colorScheme === 'dark' ? 'Light mode' : 'Dark mode'} withArrow>
              <ActionIcon variant="subtle" className={styles.headerIconBtn} onClick={toggleColorScheme}>
                {colorScheme === 'dark' ? <IconSun size={17} /> : <IconMoon size={17} />}
              </ActionIcon>
            </Tooltip>

            <div className={styles.userChip}>
              <span className={styles.userName}>{email}</span>
              <ActionIcon variant="subtle" className={styles.headerIconBtn} onClick={logout} aria-label="Logout">
                <IconLogout size={16} />
              </ActionIcon>
            </div>
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
