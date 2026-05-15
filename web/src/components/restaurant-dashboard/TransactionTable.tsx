import styles from "./RestaurantDashboard.module.css";
import type { Transaction } from "./types";

type TransactionTableProps = {
  transactions: Transaction[];
  daily: string;
  weekly: string;
  monthly: string;
};

export function TransactionTable({ transactions, daily, weekly, monthly }: TransactionTableProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionLabel}>Earnings</p>
          <h2 className={styles.sectionTitle}>Payout history</h2>
        </div>
        <span className={styles.badge}>Live tracking</span>
      </div>
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Daily</p>
          <p className={styles.summaryValue}>{daily}</p>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Weekly</p>
          <p className={styles.summaryValue}>{weekly}</p>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Monthly</p>
          <p className={styles.summaryValue}>{monthly}</p>
        </div>
      </div>
      <div className={styles.transactionsTableWrapper}>
        <table className={styles.transactionsTable}>
          <thead>
            <tr>
              <th>Order ID</th>
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
