import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { ActionIcon, Avatar, Tooltip } from '@mantine/core';
import {
  IconLayoutDashboard,
  IconSettings,
  IconDroplet,
  IconFlame,
  IconCross,
  IconHearts,
  IconBell,
  IconSun,
  IconMoon,
  IconLogout,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react';
import { OpenParishMark } from '@/components/OpenParishMark/OpenParishMark';
import { useUiStore } from '@/store/useUiStore';
import { appRoutes } from '@/app/routes';
import { useAuth } from '@/context/AuthContext';
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
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const colorScheme = useUiStore((s) => s.colorScheme);
  const toggleColorScheme = useUiStore((s) => s.toggleColorScheme);
  const location = useLocation();
  const { email, logout } = useAuth();

  const currentRoute = appRoutes.find((r) => r.path === location.pathname);
  const pageTitle = currentRoute?.label ?? 'Dashboard';
  return (
    <div className={`${styles.shell} ${!sidebarOpen ? styles.collapsed : ''}`}>
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
            <h1 className={styles.pageTitle}>{pageTitle}</h1>
          </div>

          <div className={styles.headerRight}>
            <Tooltip label="Notifications" withArrow>
              <div className={styles.bellWrap}>
                <ActionIcon variant="subtle" className={styles.headerIconBtn}>
                  <IconBell size={17} />
                </ActionIcon>
                <span className={styles.notifBadge} aria-hidden="true" />
              </div>
            </Tooltip>

            <Tooltip label={colorScheme === 'dark' ? 'Light mode' : 'Dark mode'} withArrow>
              <ActionIcon variant="subtle" className={styles.headerIconBtn} onClick={toggleColorScheme}>
                {colorScheme === 'dark' ? <IconSun size={17} /> : <IconMoon size={17} />}
              </ActionIcon>
            </Tooltip>

            <div className={styles.userChip}>
              <Avatar className={styles.userAvatar} radius="xl">
                AD
              </Avatar>
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
