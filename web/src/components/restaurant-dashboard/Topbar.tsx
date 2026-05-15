"use client";

import { useState } from "react";
import styles from "./RestaurantDashboard.module.css";

type TopbarProps = {
  restaurant: string;
  open: boolean;
  notificationCount: number;
  searchTerm: string;
  onSearch: (value: string) => void;
  onProfile: () => void;
  onSettings: () => void;
  onLogout: () => void;
};

export function Topbar({ restaurant, open, notificationCount, searchTerm, onSearch, onProfile, onSettings, onLogout }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <div className={styles.pageIntro}>
          <p className={styles.pageIntroLabel}>Restaurant dashboard</p>
          <h1 className={styles.pageIntroTitle}>{restaurant}</h1>
        </div>
        <div className={styles.openIndicator}>
          <span className={open ? styles.openDot : styles.closedDot} />
          <span>{open ? "Open for orders" : "Closed temporarily"}</span>
        </div>
      </div>
      <div className={styles.topbarRight}>
        <div className={styles.searchWrapper}>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search orders, customers, items"
            value={searchTerm}
            onChange={(event) => onSearch(event.target.value)}
          />
        </div>
        <button type="button" className={styles.notificationButton}>
          <span className={styles.notificationCount}>{notificationCount}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 0 0-12 0v5l-2 2v1h16v-1l-2-2Z" />
          </svg>
        </button>
        <div className={styles.profileMenu}>
          <button type="button" className={styles.profileButton} onClick={() => setMenuOpen((open) => !open)}>
            <span className={styles.profileAvatar}>HF</span>
            <span className={styles.profileName}>Owner</span>
            <span className={styles.profileArrow}>{menuOpen ? "▲" : "▼"}</span>
          </button>
          {menuOpen ? (
            <div className={styles.profileDropdown}>
              <button type="button" className={styles.profileDropdownItem} onClick={() => { setMenuOpen(false); onProfile(); }}>
                Profile
              </button>
              <button type="button" className={styles.profileDropdownItem} onClick={() => { setMenuOpen(false); onSettings(); }}>
                Settings
              </button>
              <button type="button" className={styles.profileDropdownItem} onClick={() => { setMenuOpen(false); onLogout(); }}>
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
