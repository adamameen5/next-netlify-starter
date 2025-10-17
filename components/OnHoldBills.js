import { useCart } from '../context/CartContext';
import styles from './OnHoldBills.module.css';

const OnHoldBills = ({ onClose }) => {
  const { onHoldBills, recallBill, deleteBill } = useCart();

  const onHoldBillsList = Object.values(onHoldBills);

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const getBillTotal = (bill) => {
    return bill.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getBillItemCount = (bill) => {
    return bill.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>📋 On Hold Bills</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          {onHoldBillsList.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No bills on hold</p>
            </div>
          ) : (
            <div className={styles.billsList}>
              {onHoldBillsList.map(bill => (
                <div key={bill.id} className={styles.billCard}>
                  <div className={styles.billHeader}>
                    <h3>Bill #{bill.id}</h3>
                    <span className={styles.pausedTime}>
                      Paused: {formatDate(bill.pausedAt)}
                    </span>
                  </div>

                  <div className={styles.billInfo}>
                    <div className={styles.billStats}>
                      <span>{getBillItemCount(bill)} items</span>
                      <span className={styles.billTotal}>
                        Total: ${getBillTotal(bill).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.billItems}>
                    {bill.items.slice(0, 3).map(item => (
                      <div key={item.id} className={styles.billItem}>
                        <span className={styles.itemName}>
                          {item.name} × {item.quantity}
                        </span>
                        <span className={styles.itemPrice}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    {bill.items.length > 3 && (
                      <div className={styles.moreItems}>
                        +{bill.items.length - 3} more items
                      </div>
                    )}
                  </div>

                  <div className={styles.billActions}>
                    <button 
                      className={styles.recallButton}
                      onClick={() => {
                        recallBill(bill.id);
                        onClose();
                      }}
                    >
                      📥 Recall
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => deleteBill(bill.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnHoldBills;