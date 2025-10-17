import { useState } from 'react';
import { useCart } from '../context/CartContext';
import styles from './ProductGrid.module.css';

const ProductGrid = ({ products, searchTerm, selectedCategory }) => {
  const { addToCart } = useCart();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart(product);
    }
  };

  return (
    <div className={styles.grid}>
      {filteredProducts.map(product => (
        <div 
          key={product.id} 
          className={`${styles.productCard} ${product.stock <= 0 ? styles.outOfStock : ''}`}
          onClick={() => handleAddToCart(product)}
        >
          <div className={styles.productImage}>
            <span className={styles.placeholder}>📦</span>
          </div>
          <div className={styles.productInfo}>
            <h3 className={styles.productName}>{product.name}</h3>
            <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
            <p className={styles.productStock}>Stock: {product.stock}</p>
            <span className={styles.category}>{product.category}</span>
          </div>
          {product.stock <= 0 && (
            <div className={styles.outOfStockOverlay}>
              Out of Stock
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;