import { useState, useContext, createContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [bills, setBills] = useState({});
  const [activeBillId, setActiveBillId] = useState('bill-1');
  const [onHoldBills, setOnHoldBills] = useState({});
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [barcodeBuffer, setBarcodeBuffer] = useState('');

  // Initialize first bill if needed
  const initializeBill = (billId) => {
    if (!bills[billId]) {
      setBills(prev => ({
        ...prev,
        [billId]: {
          id: billId,
          items: [],
          createdAt: new Date(),
          salesperson: null
        }
      }));
    }
  };

  // Get current active bill
  const getActiveBill = () => {
    if (!bills[activeBillId]) {
      initializeBill(activeBillId);
    }
    return bills[activeBillId] || { items: [], salesperson: null };
  };

  const addToCart = (product, quantity = 1, salesperson = null) => {
    const currentBill = getActiveBill();
    setBills(prev => {
      const existingItem = currentBill.items.find(item => item.id === product.id);
      
      let updatedItems;
      if (existingItem) {
        updatedItems = currentBill.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity, salesperson: salesperson || item.salesperson }
            : item
        );
      } else {
        updatedItems = [...currentBill.items, { ...product, quantity, salesperson }];
      }

      return {
        ...prev,
        [activeBillId]: {
          ...currentBill,
          items: updatedItems
        }
      };
    });
  };

  const removeFromCart = (productId) => {
    const currentBill = getActiveBill();
    setBills(prev => ({
      ...prev,
      [activeBillId]: {
        ...currentBill,
        items: currentBill.items.filter(item => item.id !== productId)
      }
    }));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const currentBill = getActiveBill();
    setBills(prev => ({
      ...prev,
      [activeBillId]: {
        ...currentBill,
        items: currentBill.items.map(item =>
          item.id === productId
            ? { ...item, quantity }
            : item
        )
      }
    }));
  };

  const updateSalesperson = (productId, salesperson) => {
    const currentBill = getActiveBill();
    setBills(prev => ({
      ...prev,
      [activeBillId]: {
        ...currentBill,
        items: currentBill.items.map(item =>
          item.id === productId
            ? { ...item, salesperson }
            : item
        )
      }
    }));
  };

  const clearCart = () => {
    const currentBill = getActiveBill();
    setBills(prev => ({
      ...prev,
      [activeBillId]: {
        ...currentBill,
        items: []
      }
    }));
  };

  const getCartTotal = () => {
    const currentBill = getActiveBill();
    return currentBill.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    const currentBill = getActiveBill();
    return currentBill.items.reduce((count, item) => count + item.quantity, 0);
  };

  // Bill management functions
  const createNewBill = () => {
    const newBillId = `bill-${Date.now()}`;
    initializeBill(newBillId);
    setActiveBillId(newBillId);
    return newBillId;
  };

  const pauseBill = () => {
    const currentBill = getActiveBill();
    if (currentBill.items.length > 0) {
      setOnHoldBills(prev => ({
        ...prev,
        [activeBillId]: {
          ...currentBill,
          pausedAt: new Date()
        }
      }));
      // Remove from active bills
      setBills(prev => {
        const newBills = { ...prev };
        delete newBills[activeBillId];
        return newBills;
      });
      // Create new bill
      createNewBill();
    }
  };

  const recallBill = (billId) => {
    if (onHoldBills[billId]) {
      // Move bill back to active
      setBills(prev => ({
        ...prev,
        [billId]: onHoldBills[billId]
      }));
      // Remove from hold
      setOnHoldBills(prev => {
        const newHoldBills = { ...prev };
        delete newHoldBills[billId];
        return newHoldBills;
      });
      setActiveBillId(billId);
    }
  };

  const deleteBill = (billId) => {
    setOnHoldBills(prev => {
      const newHoldBills = { ...prev };
      delete newHoldBills[billId];
      return newHoldBills;
    });
  };

  // Barcode scanning
  const handleBarcodeInput = (input, products) => {
    const newBuffer = barcodeBuffer + input;
    setBarcodeBuffer(newBuffer);

    // Clear buffer after 100ms of no input
    setTimeout(() => setBarcodeBuffer(''), 100);

    // Check if buffer matches any product barcode
    const matchedProduct = products.find(product => 
      product.barcode && newBuffer.includes(product.barcode)
    );

    if (matchedProduct) {
      addToCart(matchedProduct, 1);
      setBarcodeBuffer('');
      return true;
    }
    return false;
  };

  const value = {
    // Current cart/bill
    cartItems: getActiveBill().items,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateSalesperson,
    clearCart,
    getCartTotal,
    getCartItemCount,
    
    // Bill management
    bills,
    activeBillId,
    onHoldBills,
    createNewBill,
    pauseBill,
    recallBill,
    deleteBill,
    setActiveBillId,
    
    // Checkout
    isCheckoutMode,
    setIsCheckoutMode,
    
    // Barcode scanning
    handleBarcodeInput,
    barcodeBuffer
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};