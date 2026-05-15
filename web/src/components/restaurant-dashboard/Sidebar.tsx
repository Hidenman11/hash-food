import styles from "./RestaurantDashboard.module.css";

const navItems = [
  { key: "dashboard", label: "Overview" },
  { key: "orders", label: "Orders" },
  { key: "menu", label: "Menu" },
  { key: "analytics", label: "Analytics" },
  { key: "earnings", label: "Earnings" },
  { key: "settings", label: "Settings" },
] as const;

type SidebarProps = {
  active: string;
  onChange: (key: string) => void;
};

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.brandBlock}>
          <span className={styles.brandBadge}>HASH FOOD</span>
          <p className={styles.brandTag}>Premium restaurant operations</p>
        </div>
        <div className={styles.navGroup}>
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={active === item.key ? styles.navItemActive : styles.navItem}
              onClick={() => onChange(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.sidebarFooter}>
        <div>
          <p className={styles.sidebarFooterTitle}>Realtime operations</p>
          <p className={styles.sidebarFooterText}>Smart status sync, order alerts, and connected kitchen insights.</p>
        </div>
      </div>
    </aside>
  );
}
