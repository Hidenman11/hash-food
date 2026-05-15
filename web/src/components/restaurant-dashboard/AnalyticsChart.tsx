import styles from "./RestaurantDashboard.module.css";

type AnalyticsChartProps = {
  ordersTrend: { day: string; value: number }[];
  revenueGrowth: string;
  bestSellers: { name: string; volume: number }[];
};

export function AnalyticsChart({ ordersTrend, revenueGrowth, bestSellers }: AnalyticsChartProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionLabel}>Analytics</p>
          <h2 className={styles.sectionTitle}>Revenue & demand</h2>
        </div>
        <span className={styles.badge}>+{revenueGrowth} growth</span>
      </div>
      <div className={styles.analyticsGrid}>
        <div className={styles.chartPanel}>
          <p className={styles.chartLabel}>Orders this week</p>
          <div className={styles.chartBars}>
            {ordersTrend.map((point) => (
              <div key={point.day} className={styles.chartBarColumn}>
                <div className={styles.chartBarFill} style={{ height: `${point.value * 2.2}px` }} />
                <span>{point.day}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.card}>
          <p className={styles.metricLabel}>Best sellers</p>
          <ul className={styles.sellerList}>
            {bestSellers.map((item) => (
              <li key={item.name} className={styles.sellerItem}>
                <span>{item.name}</span>
                <strong>{item.volume} orders</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
