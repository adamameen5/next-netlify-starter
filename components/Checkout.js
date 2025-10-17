import { useState } from 'react';
import { useCart } from '../context/CartContext';
import styles from './Checkout.module.css';

const Checkout = () => {
  const { 
    cartItems, 
    getCartTotal, 
    clearCart, 
    setIsCheckoutMode 
  } = useCart();
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const total = getCartTotal();
  const tax = total * 0.08; // 8% tax rate
  const finalTotal = total + tax;
  const change = paymentMethod === 'cash' ? (parseFloat(cashReceived) || 0) - finalTotal : 0;

  const handlePayment = async () => {
    if (paymentMethod === 'cash' && (parseFloat(cashReceived) || 0) < finalTotal) {
      alert('Insufficient cash received');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const id = 'TXN' + Date.now();
      setTransactionId(id);
      setShowReceipt(true);
      setIsProcessing(false);
    }, 2000);
  };

  const handleNewSale = () => {
    clearCart();
    setIsCheckoutMode(false);
    setShowReceipt(false);
    setCashReceived('');
    setTransactionId('');
  };

  const handleBack = () => {
    setIsCheckoutMode(false);
  };

  if (showReceipt) {
    return (
      <div className={styles.receipt}>
        <div className={styles.receiptHeader}>
          <h2>🧾 Receipt</h2>
          <p>Transaction ID: {transactionId}</p>
          <p>Date: {new Date().toLocaleString()}</p>
        </div>

        <div className={styles.receiptItems}>
          {cartItems.map(item => (
            <div key={item.id} className={styles.receiptItem}>
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className={styles.receiptTotals}>
          <div className={styles.receiptLine}>
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className={styles.receiptLine}>
            <span>Tax (8%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className={styles.receiptLine}>
            <strong>Total:</strong>
            <strong>${finalTotal.toFixed(2)}</strong>
          </div>
          {paymentMethod === 'cash' && (
            <>
              <div className={styles.receiptLine}>
                <span>Cash Received:</span>
                <span>${parseFloat(cashReceived).toFixed(2)}</span>
              </div>
              <div className={styles.receiptLine}>
                <span>Change:</span>
                <span>${change.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        <div className={styles.receiptFooter}>
          <p>Payment Method: {paymentMethod.toUpperCase()}</p>
          <p>Thank you for your business!</p>
          <button 
            className={styles.newSaleButton}
            onClick={handleNewSale}
          >
            New Sale
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkout}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={handleBack}
        >
          ← Back
        </button>
        <h2>Checkout</h2>
      </div>

      <div className={styles.orderSummary}>
        <h3>Order Summary</h3>
        {cartItems.map(item => (
          <div key={item.id} className={styles.summaryItem}>
            <span>{item.name} x{item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        
        <div className={styles.totals}>
          <div className={styles.totalLine}>
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className={styles.totalLine}>
            <span>Tax (8%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className={styles.totalLine}>
            <strong>Total:</strong>
            <strong>${finalTotal.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <div className={styles.payment}>
        <h3>Payment Method</h3>
        <div className={styles.paymentMethods}>
          <label className={styles.paymentOption}>
            <input
              type="radio"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>💵 Cash</span>
          </label>
          <label className={styles.paymentOption}>
            <input
              type="radio"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>💳 Card</span>
          </label>
        </div>

        {paymentMethod === 'cash' && (
          <div className={styles.cashInput}>
            <label>Cash Received:</label>
            <input
              type="number"
              step="0.01"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              placeholder="0.00"
              className={styles.cashAmount}
            />
            {cashReceived && (
              <div className={styles.change}>
                <strong>
                  Change: ${change >= 0 ? change.toFixed(2) : '0.00'}
                </strong>
                {change < 0 && (
                  <span className={styles.insufficient}>
                    (Insufficient - Need ${Math.abs(change).toFixed(2)} more)
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        <button 
          className={styles.payButton}
          onClick={handlePayment}
          disabled={isProcessing || (paymentMethod === 'cash' && change < 0)}
        >
          {isProcessing ? 'Processing...' : `Pay $${finalTotal.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;