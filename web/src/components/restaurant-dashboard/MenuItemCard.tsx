import styles from "./RestaurantDashboard.module.css";
import type { MenuItem } from "./types";
import { SafeImage } from "@/components/ui/SafeImage";

type MenuItemCardProps = {
  item: MenuItem;
  onToggleAvailable: (id: string) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
};

export function MenuItemCard({ item, onToggleAvailable, onEdit, onDelete }: MenuItemCardProps) {
  return (
    <article className={styles.menuCard}>
      <div className={styles.menuImageWrap}>
        <SafeImage className={styles.menuImage} src={item.image} alt={item.name} fill sizes="150px" />
      </div>
      <div className={styles.menuBody}>
        <div className={styles.menuHeader}>
          <div>
            <p className={styles.menuCategory}>{item.category}</p>
            <h3 className={styles.menuTitle}>{item.name}</h3>
          </div>
          <span className={item.available ? styles.availableBadge : styles.outOfStockBadge}>
            {item.available ? "Available" : "Out of stock"}
          </span>
        </div>
        <p className={styles.menuPrice}>{item.price}</p>
        <div className={styles.menuMetaRow}>
          <span>{item.stock}</span>
          <button type="button" className={styles.linkButton} onClick={() => onToggleAvailable(item.id)}>
            {item.available ? "Disable" : "Enable"}
          </button>
        </div>
        <div className={styles.menuActions}>
          <button type="button" className={styles.primaryButton} onClick={() => onEdit(item)}>
            Edit
          </button>
          <button type="button" className={styles.outlineButton} onClick={() => onDelete(item.id)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
