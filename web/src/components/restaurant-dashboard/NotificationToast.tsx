import styles from "./RestaurantDashboard.module.css";

type NotificationToastProps = {
  message: string | null;
};

export function NotificationToast({ message }: NotificationToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div className={styles.toastContainer} role="status" aria-live="polite">
      <div className={styles.toastCard}>
        <strong>New notification</strong>
        <p>{message}</p>
      </div>
    </div>
  );
}
