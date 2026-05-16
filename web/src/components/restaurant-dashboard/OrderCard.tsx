import styles from "./RestaurantDashboard.module.css";
import type { Order, OrderStatus } from "./types";

type OrderCardProps = {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
};

const statusColors: Record<OrderStatus, string> = {
  Pending: styles.statusPending,
  Preparing: styles.statusPreparing,
  Ready: styles.statusReady,
  Delivered: styles.statusDelivered,
};

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const canAdvance = order.status !== "Delivered";
  const nextStatus = order.status === "Pending" ? "Preparing" : order.status === "Preparing" ? "Ready" : order.status === "Ready" ? "Delivered" : "Delivered";

  return (
    <article className={styles.orderCard}>
      <div className={styles.orderMetaRow}>
        <div>
          <p className={styles.orderId}>{order.id}</p>
          <p className={styles.orderSubtitle}>{order.customer} • Table {order.table}</p>
        </div>
        <div className={styles.orderStatusGroup}>
          <span className={`${styles.statusBadge} ${statusColors[order.status]}`}>{order.status}</span>
          <span className={styles.orderEta}>{order.eta}</span>
        </div>
      </div>
      <div className={styles.orderDetails}>{order.items.join(" • ")}</div>
      <div className={styles.orderFooterRow}>
        <div>
          <p className={styles.orderTotal}>{order.total}</p>
          <p className={styles.orderTime}>Placed {order.placedAt}</p>
        </div>
        <div className={styles.orderActionsRow}>
          {canAdvance ? (
            <button type="button" className={styles.primaryButton} onClick={() => onStatusChange(order.id, nextStatus)}>
              {nextStatus === "Delivered" ? "Complete" : `Move to ${nextStatus}`}
            </button>
          ) : (
            <button type="button" className={styles.secondaryButton} disabled>
              Delivered
            </button>
          )}
          <button type="button" className={styles.outlineButton} onClick={() => onStatusChange(order.id, "Delivered")}>Finish</button>
        </div>
      </div>
    </article>
  );
}
