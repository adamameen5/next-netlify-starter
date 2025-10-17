import { useCart } from '../context/CartContext';
import { salespeople } from '../data/products';
import styles from './Cart.module.css';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    updateSalesperson,
    clearCart, 
    getCartTotal,
    getCartItemCount,
    setIsCheckoutMode,
    createNewBill,
    pauseBill,
    onHoldBills,
    activeBillId
  } = useCart();

  const handleCheckout = () => {
    setIsCheckoutMode(true);
  };

  const handleNewBill = () => {
    createNewBill();
  };

  const handlePauseBill = () => {
    pauseBill();
  };

  const onHoldCount = Object.keys(onHoldBills).length;

  return (
    <div className={styles.cart}>
      <div className={styles.header}>
        <div className={styles.billInfo}>
          <h2>Bill #{activeBillId}</h2>
          <span className={styles.itemCount}>({getCartItemCount()} items)</span>
        </div>
        <div className={styles.billActions}>
          <button 
            className={styles.newBillButton}
            onClick={handleNewBill}
            title="Start new bill"
          >
            📄 New
          </button>
          {cartItems.length > 0 && (
            <button 
              className={styles.pauseBillButton}
              onClick={handlePauseBill}
              title="Pause current bill"
            >
              ⏸️ Pause
            </button>
          )}
        </div>
      </div>

      {onHoldCount > 0 && (
        <div className={styles.onHoldInfo}>
          📋 {onHoldCount} bill{onHoldCount > 1 ? 's' : ''} on hold
        </div>
      )}

      <div className={styles.items}>
        {cartItems.length === 0 ? (
          <p className={styles.emptyCart}>Cart is empty</p>
        ) : (
          <>
            <div className={styles.tableHeader}>
              <div className={styles.headerItem}>Item</div>
              <div className={styles.headerQty}>Qty</div>
              <div className={styles.headerSalesperson}>Salesperson</div>
              <div className={styles.headerTotal}>Total</div>
              <div className={styles.headerActions}></div>
            </div>
            {cartItems.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemInfo}>
                  <h4>{item.name}</h4>
                  <p className={styles.itemPrice}>${item.price.toFixed(2)} per {item.unit}</p>
                </div>
                
                <div className={styles.quantityControls}>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className={styles.quantityButton}
                  >
                    -
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className={styles.quantityButton}
                  >
                    +
                  </button>
                </div>

                <div className={styles.salespersonSelect}>
                  <select 
                    value={item.salesperson || ''} 
                    onChange={(e) => updateSalesperson(item.id, e.target.value)}
                    className={styles.salespersonDropdown}
                  >
                    <option value="">Select...</option>
                    {salespeople.map(person => (
                      <option key={person.id} value={person.name}>
                        {person.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.itemTotal}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className={styles.removeButton}
                  title="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className={styles.footer}>
          <div className={styles.actions}>
            <button 
              className={styles.clearButton}
              onClick={clearCart}
            >
              Clear All
            </button>
          </div>
          <div className={styles.total}>
            <strong>Total: ${getCartTotal().toFixed(2)}</strong>
          </div>
          <button 
            className={styles.checkoutButton}
            onClick={handleCheckout}
          >
            💳 Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;