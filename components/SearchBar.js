import { useState, useEffect } from 'react';
import { categories, products } from '../data/products';
import { useCart } from '../context/CartContext';
import styles from './SearchBar.module.css';

const SearchBar = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) => {
  const [barcodeMode, setBarcodeMode] = useState(false);
  const { handleBarcodeInput } = useCart();

  // Handle barcode scanning
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (barcodeMode) {
        // Prevent default behavior when in barcode mode
        e.preventDefault();
        
        if (e.key === 'Enter') {
          setBarcodeMode(false);
          setSearchTerm('');
          return;
        }

        // Handle barcode input
        const scanned = handleBarcodeInput(e.key, products);
        if (scanned) {
          setBarcodeMode(false);
          setSearchTerm('');
        }
      }
    };

    if (barcodeMode) {
      document.addEventListener('keypress', handleKeyPress);
      return () => document.removeEventListener('keypress', handleKeyPress);
    }
  }, [barcodeMode, handleBarcodeInput]);

  const toggleBarcodeMode = () => {
    setBarcodeMode(!barcodeMode);
    if (!barcodeMode) {
      setSearchTerm('');
    }
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Check if input looks like a barcode (numeric and long enough)
    if (value.length >= 8 && /^\d+$/.test(value)) {
      const matchedProduct = products.find(product => 
        product.barcode && product.barcode.includes(value)
      );
      
      if (matchedProduct) {
        handleBarcodeInput(value, products);
        setSearchTerm('');
      }
    }
  };

  return (
    <div className={styles.searchBar}>
      <div className={styles.searchInput}>
        <input
          type="text"
          placeholder={barcodeMode ? "Barcode scanning active - scan or type barcode..." : "Search products or scan barcode..."}
          value={searchTerm}
          onChange={handleSearchInput}
          className={`${styles.input} ${barcodeMode ? styles.barcodeActive : ''}`}
          autoFocus={barcodeMode}
        />
        <button 
          className={`${styles.barcodeButton} ${barcodeMode ? styles.active : ''}`}
          onClick={toggleBarcodeMode}
          title="Toggle barcode scanning mode"
        >
          📷
        </button>
        <span className={styles.searchIcon}>🔍</span>
      </div>
      
      <div className={styles.categories}>
        {categories.map(category => (
          <button
            key={category}
            className={`${styles.categoryButton} ${
              selectedCategory === category ? styles.active : ''
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {barcodeMode && (
        <div className={styles.barcodeStatus}>
          📷 Barcode scanning active - Ready to scan
        </div>
      )}
    </div>
  );
};

export default SearchBar;