import { useState } from 'react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductGrid from './ProductGrid';
import SearchBar from './SearchBar';
import Cart from './Cart';
import Checkout from './Checkout';
import SalesReport from './SalesReport';
import OnHoldBills from './OnHoldBills';
import styles from './POSSystem.module.css';

const POSSystem = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeView, setActiveView] = useState('pos');
  const [showOnHoldBills, setShowOnHoldBills] = useState(false);
  const { isCheckoutMode, onHoldBills } = useCart();

  const onHoldCount = Object.keys(onHoldBills).length;

  if (isCheckoutMode) {
    return <Checkout />;
  }

  return (
    <div className={styles.posSystem}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>🏪 Textile Shop POS</h1>
        </div>
        <nav className={styles.navigation}>
          <button 
            className={`${styles.navButton} ${activeView === 'pos' ? styles.active : ''}`}
            onClick={() => setActiveView('pos')}
          >
            🛒 Sales
          </button>
          <button 
            className={`${styles.navButton} ${activeView === 'reports' ? styles.active : ''}`}
            onClick={() => setActiveView('reports')}
          >
            📊 Reports
          </button>
          {onHoldCount > 0 && (
            <button 
              className={styles.onHoldButton}
              onClick={() => setShowOnHoldBills(true)}
            >
              📋 On Hold ({onHoldCount})
            </button>
          )}
        </nav>
      </header>

      {activeView === 'pos' ? (
        <div className={styles.posLayout}>
          <div className={styles.leftPanel}>
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <div className={styles.productsContainer}>
              <ProductGrid
                products={products}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>
          
          <div className={styles.rightPanel}>
            <Cart />
          </div>
        </div>
      ) : (
        <div className={styles.reportsView}>
          <SalesReport />
        </div>
      )}

      {showOnHoldBills && (
        <OnHoldBills onClose={() => setShowOnHoldBills(false)} />
      )}
    </div>
  );
};

export default POSSystem;