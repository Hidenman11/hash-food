"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import styles from "./RestaurantDashboard.module.css";

type OrderStatus = "Pending" | "Preparing" | "Ready" | "Delivered" | "Rejected";

type Order = {
  id: string;
  customer: string;
  items: string[];
  total: string;
  status: OrderStatus;
  time: string;
};

type MenuItem = {
  id: string;
  name: string;
  price: string;
  available: boolean;
  image: string;
};

type Transaction = {
  id: string;
  date: string;
  amount: string;
  status: string;
};

const navItems = [
  { key: "dashboard", label: "Dashboard" },
  { key: "orders", label: "Orders" },
  { key: "menu", label: "Menu" },
  { key: "analytics", label: "Analytics" },
  { key: "earnings", label: "Earnings" },
  { key: "settings", label: "Settings" },
] as const;

const initialOrders: Order[] = [
  {
    id: "HF-1001",
    customer: "Amina Mwinyi",
    items: ["Chicken Pizza", "Coke"],
    total: "TSh 24,500",
    status: "Pending",
    time: "2 min ago",
  },
  {
    id: "HF-1002",
    customer: "Juma Hassan",
    items: ["Beef Pilau", "Mango Juice"],
    total: "TSh 18,300",
    status: "Preparing",
    time: "5 min ago",
  },
  {
    id: "HF-1003",
    customer: "Neema John",
    items: ["Burger Combo"],
    total: "TSh 12,800",
    status: "Ready",
    time: "8 min ago",
  },
  {
    id: "HF-1004",
    customer: "Sammy Peter",
    items: ["Sushi Box", "Ginger Tea"],
    total: "TSh 31,200",
    status: "Pending",
    time: "1 min ago",
  },
];

const initialMenu: MenuItem[] = [
  {
    id: "1",
    name: "Spicy Chicken Pizza",
    price: "TSh 19,000",
    available: true,
    image: "https://images.unsplash.com/photo-1548365328-5cb9ae8cbe2e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "2",
    name: "Beef Pilau",
    price: "TSh 14,500",
    available: true,
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "3",
    name: "Hash Burger",
    price: "TSh 11,200",
    available: false,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "4",
    name: "Sushi Delight",
    price: "TSh 23,000",
    available: true,
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=80",
  },
];

const initialTransactions: Transaction[] = [
  { id: "TX-2331", date: "May 14", amount: "TSh 124,000", status: "Paid" },
  { id: "TX-2332", date: "May 14", amount: "TSh 58,500", status: "Paid" },
  { id: "TX-2333", date: "May 13", amount: "TSh 72,300", status: "Paid" },
  { id: "TX-2334", date: "May 13", amount: "TSh 42,000", status: "Pending" },
];

const initialProfile = {
  name: "Hash Food Kitchen",
  location: "Mwanza, Tanzania",
  phone: "+255 762 345 678",
  open: true,
};

const ordersTrend = [
  { day: "Mon", value: 14 },
  { day: "Tue", value: 18 },
  { day: "Wed", value: 22 },
  { day: "Thu", value: 12 },
  { day: "Fri", value: 26 },
  { day: "Sat", value: 32 },
  { day: "Sun", value: 28 },
];

const popularItems = [
  { name: "Spicy Chicken Pizza", count: 82 },
  { name: "Beef Pilau", count: 61 },
  { name: "Hash Burger", count: 57 },
];

function Sidebar({ active, onChange }: { active: string; onChange: (key: string) => void }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brandBlock}>
        <div className={styles.brandBadge}>HASH FOOD</div>
        <p className={styles.brandTag}>Restaurant dashboard</p>
      </div>
      <nav className={styles.sidebarNav}>
        {navItems.map((item) => (
          <button
            key={item.key}
            className={active === item.key ? styles.navItemActive : styles.navItem}
            onClick={() => onChange(item.key)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className={styles.sidebarFooter}>
        <p className={styles.sidebarFooterTitle}>Live update</p>
        <p className={styles.sidebarFooterText}>Orders and kitchen status refresh automatically in real time.</p>
      </div>
    </aside>
  );
}

function TopBar({ restaurant }: { restaurant: string }) {
  return (
    <header className={styles.topbar}>
      <div>
        <p className={styles.topbarTitle}>Welcome back,</p>
        <h1 className={styles.topbarHeading}>{restaurant}</h1>
      </div>
      <div className={styles.topbarRight}>
        <button className={styles.iconButton} type="button" aria-label="Notifications">
          <span className={styles.iconBubble}>3</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z" />
          </svg>
        </button>
        <button className={styles.avatarButton} type="button" aria-label="Profile">
          <span>HF</span>
        </button>
      </div>
    </header>
  );
}

function SummaryCards({ metrics }: { metrics: { label: string; value: string; icon: string }[] }) {
  return (
    <div className={styles.grid4}>
      {metrics.map((metric) => (
        <div key={metric.label} className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.metricIcon}>{metric.icon}</span>
            <span className={styles.metricLabel}>{metric.label}</span>
          </div>
          <p className={styles.metricValue}>{metric.value}</p>
        </div>
      ))}
    </div>
  );
}

function OrdersSection({ orders, onUpdate }: { orders: Order[]; onUpdate: (id: string, status: OrderStatus) => void }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionLabel}>Incoming orders</p>
          <h2 className={styles.sectionTitle}>Real-time order feed</h2>
        </div>
        <span className={styles.badge}>Live</span>
      </div>
      <div className={styles.orderList}>
        {orders.map((order) => (
          <div key={order.id} className={styles.orderCard}>
            <div className={styles.orderTop}>
              <div>
                <p className={styles.orderId}>{order.id}</p>
                <p className={styles.orderMeta}>{order.customer} · {order.time}</p>
              </div>
              <span className={styles.statusPill}>{order.status}</span>
            </div>
            <div className={styles.orderItems}>
              {order.items.map((item) => (
                <span key={item} className={styles.orderItemTag}>{item}</span>
              ))}
            </div>
            <div className={styles.orderFooter}>
              <p className={styles.orderTotal}>{order.total}</p>
              <div className={styles.orderActions}>
                <button type="button" className={styles.actionButton} onClick={() => onUpdate(order.id, "Preparing")}>
                  Preparing
                </button>
                <button type="button" className={styles.actionButton} onClick={() => onUpdate(order.id, "Ready")}>
                  Mark Ready
                </button>
                <button type="button" className={styles.rejectButton} onClick={() => onUpdate(order.id, "Rejected")}>
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MenuSection({ items, onToggle, onDelete, onEdit, onAdd }: { items: MenuItem[]; onToggle: (id: string) => void; onDelete: (id: string) => void; onEdit: (id: string, name: string, price: string) => void; onAdd: (name: string, price: string) => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  function startEdit(item: MenuItem) {
    setEditId(item.id);
    setEditName(item.name);
    setEditPrice(item.price.replace(/[^0-9]/g, ""));
  }

  function saveEdit() {
    if (!editId || !editName.trim() || !editPrice.trim()) return;
    onEdit(editId, editName.trim(), `TSh ${Number(editPrice).toLocaleString()}`);
    setEditId(null);
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionLabel}>Menu manager</p>
          <h2 className={styles.sectionTitle}>Food items</h2>
        </div>
        <div className={styles.addForm}>
          <input
            type="text"
            value={name}
            placeholder="New item name"
            className={styles.inputField}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            type="number"
            value={price}
            placeholder="Price"
            className={styles.inputField}
            onChange={(event) => setPrice(event.target.value)}
          />
          <button type="button" className={styles.primaryButton} onClick={() => { onAdd(name.trim(), `TSh ${Number(price).toLocaleString()}`); setName(""); setPrice(""); }}>
            Add item
          </button>
        </div>
      </div>
      <div className={styles.menuGrid}>
        {items.map((item) => (
          <div key={item.id} className={styles.menuCard}>
            <div className={styles.menuImageWrap}>
              <Image className={styles.menuImage} src={item.image} alt={item.name} fill sizes="150px" />
            </div>
            <div className={styles.menuInfo}>
              {editId === item.id ? (
                <div className={styles.editRow}>
                  <input
                    className={styles.inputField}
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                  />
                  <input
                    className={styles.inputField}
                    value={editPrice}
                    onChange={(event) => setEditPrice(event.target.value)}
                  />
                </div>
              ) : (
                <>
                  <h3 className={styles.menuName}>{item.name}</h3>
                  <p className={styles.menuPrice}>{item.price}</p>
                </>
              )}
              <div className={styles.menuControls}>
                <label className={styles.switchLabel}>
                  <input type="checkbox" checked={item.available} onChange={() => onToggle(item.id)} />
                  <span className={styles.switchTrack} />
                  <span>{item.available ? "Available" : "Offline"}</span>
                </label>
                <div className={styles.menuButtons}>
                  {editId === item.id ? (
                    <button type="button" className={styles.primaryButton} onClick={saveEdit}>Save</button>
                  ) : (
                    <button type="button" className={styles.secondaryButton} onClick={() => startEdit(item)}>Edit</button>
                  )}
                  <button type="button" className={styles.rejectButton} onClick={() => onDelete(item.id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AnalyticsSection({ totalSales }: { totalSales: string }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionLabel}>Analytics</p>
          <h2 className={styles.sectionTitle}>Sales and trends</h2>
        </div>
        <span className={styles.badge}>Updated</span>
      </div>
      <div className={styles.analyticsGrid}>
        <div className={styles.card}>
          <p className={styles.metricLabel}>Total sales</p>
          <p className={styles.metricValue}>{totalSales}</p>
        </div>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <p>Orders this week</p>
            <span className={styles.muted}>Trend</span>
          </div>
          <div className={styles.chartGraph}>
            {ordersTrend.map((point) => (
              <div key={point.day} className={styles.chartBarWrapper}>
                <div className={styles.chartBar} style={{ height: `${point.value * 2}px` }} />
                <span>{point.day}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.card}>
          <p className={styles.metricLabel}>Popular items</p>
          <ul className={styles.popularList}>
            {popularItems.map((item) => (
              <li key={item.name} className={styles.popularItem}>
                <span>{item.name}</span>
                <strong>{item.count} orders</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function EarningsSection({ transactions }: { transactions: Transaction[] }) {
  const total = transactions.reduce((sum, tx) => sum + Number(tx.amount.replace(/[^0-9]/g, "")), 0);
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionLabel}>Earnings</p>
          <h2 className={styles.sectionTitle}>Revenue snapshot</h2>
        </div>
        <span className={styles.badge}>Stable</span>
      </div>
      <div className={styles.grid3}>
        <div className={styles.card}>
          <p className={styles.metricLabel}>Total earnings</p>
          <p className={styles.metricValue}>{`TSh ${total.toLocaleString()}`}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.metricLabel}>Daily average</p>
          <p className={styles.metricValue}>TSh 68,400</p>
        </div>
        <div className={styles.card}>
          <p className={styles.metricLabel}>Weekly summary</p>
          <p className={styles.metricValue}>7 days growth</p>
        </div>
      </div>
      <div className={styles.transactionsTableWrapper}>
        <table className={styles.transactionsTable}>
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.id}</td>
                <td>{tx.date}</td>
                <td>{tx.amount}</td>
                <td>{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SettingsSection({ profile, onProfileChange, onToggle }: { profile: typeof initialProfile; onProfileChange: (field: string, value: string | boolean) => void; onToggle: () => void }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionLabel}>Settings</p>
          <h2 className={styles.sectionTitle}>Restaurant profile</h2>
        </div>
        <span className={styles.badge}>{profile.open ? "Open" : "Closed"}</span>
      </div>
      <div className={styles.settingsGrid}>
        <label className={styles.fieldLabel}>
          Restaurant name
          <input
            type="text"
            value={profile.name}
            className={styles.inputField}
            onChange={(event) => onProfileChange("name", event.target.value)}
          />
        </label>
        <label className={styles.fieldLabel}>
          Location
          <input
            type="text"
            value={profile.location}
            className={styles.inputField}
            onChange={(event) => onProfileChange("location", event.target.value)}
          />
        </label>
        <label className={styles.fieldLabel}>
          Phone number
          <input
            type="text"
            value={profile.phone}
            className={styles.inputField}
            onChange={(event) => onProfileChange("phone", event.target.value)}
          />
        </label>
        <div className={styles.availabilityCard}>
          <p className={styles.metricLabel}>Restaurant availability</p>
          <div className={styles.toggleRow}>
            <span>{profile.open ? "Open for orders" : "Closed"}</span>
            <button type="button" className={styles.primaryButton} onClick={onToggle}>
              {profile.open ? "Close restaurant" : "Open restaurant"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function RestaurantDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenu);
  const [profile, setProfile] = useState(initialProfile);
  const [transactions] = useState<Transaction[]>(initialTransactions);

  const summaryMetrics = useMemo(
    () => [
      { label: "Total orders today", value: `${orders.length}`, icon: "🧾" },
      { label: "Pending orders", value: `${orders.filter((order) => order.status === "Pending").length}`, icon: "⏳" },
      { label: "Completed orders", value: `${orders.filter((order) => order.status === "Delivered").length + orders.filter((order) => order.status === "Ready").length}`, icon: "✅" },
      { label: "Total earnings", value: "TSh 378,600", icon: "💰" },
    ],
    [orders],
  );

  const totalSales = useMemo(
    () => `TSh ${orders
      .reduce((sum, order) => sum + Number(order.total.replace(/[^0-9]/g, "")), 0)
      .toLocaleString()}`,
    [orders],
  );

  const handleUpdateOrder = (id: string, status: OrderStatus) => {
    setOrders((items) => items.map((order) => (order.id === id ? { ...order, status } : order)));
  };

  const handleToggleItem = (id: string) => {
    setMenuItems((items) => items.map((item) => (item.id === id ? { ...item, available: !item.available } : item)));
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems((items) => items.filter((item) => item.id !== id));
  };

  const handleEditItem = (id: string, name: string, price: string) => {
    setMenuItems((items) => items.map((item) => (item.id === id ? { ...item, name, price } : item)));
  };

  const handleAddItem = (name: string, price: string) => {
    if (!name || !price) return;
    setMenuItems((items) => [
      ...items,
      {
        id: String(Date.now()),
        name,
        price,
        available: true,
        image: "/images/meal.svg",
      },
    ]);
  };

  const handleProfileChange = (field: string, value: string | boolean) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const renderSection = () => {
    switch (activeTab) {
      case "orders":
        return <OrdersSection orders={orders} onUpdate={handleUpdateOrder} />;
      case "menu":
        return <MenuSection items={menuItems} onToggle={handleToggleItem} onDelete={handleDeleteItem} onEdit={handleEditItem} onAdd={handleAddItem} />;
      case "analytics":
        return <AnalyticsSection totalSales={totalSales} />;
      case "earnings":
        return <EarningsSection transactions={transactions} />;
      case "settings":
        return <SettingsSection profile={profile} onProfileChange={handleProfileChange} onToggle={() => handleProfileChange("open", !profile.open)} />;
      default:
        return (
          <>
            <div className={styles.topRow}>
              <div className={styles.heroCard}>
                <div className={styles.heroBadge}>Restaurant health</div>
                <h2>Kitchen is running smoothly.</h2>
                <p>Track orders, update your menu, and monitor revenue from one screen.</p>
              </div>
              <div className={styles.quickStats}>
                <div className={styles.statCard}>
                  <p className={styles.statLabel}>Live order score</p>
                  <p className={styles.statValue}>92%</p>
                </div>
                <div className={styles.statCard}>
                  <p className={styles.statLabel}>Average prep time</p>
                  <p className={styles.statValue}>16 min</p>
                </div>
              </div>
            </div>
            <SummaryCards metrics={summaryMetrics} />
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.sectionLabel}>Orders trend</p>
                  <h2 className={styles.sectionTitle}>This week</h2>
                </div>
                <span className={styles.badge}>Auto-refresh</span>
              </div>
              <div className={styles.chartCard}>
                <div className={styles.chartGraphWide}>
                  {ordersTrend.map((point) => (
                    <div key={point.day} className={styles.chartBarWrapperWide}>
                      <div className={styles.chartBarWide} style={{ height: `${point.value * 2}px` }} />
                      <span>{point.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className={styles.pageLayout}>
      <Sidebar active={activeTab} onChange={setActiveTab} />
      <main className={styles.mainContent}>
        <TopBar restaurant={profile.name} />
        {renderSection()}
      </main>
    </div>
  );
}
