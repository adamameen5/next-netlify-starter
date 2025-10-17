import { useState, useEffect } from 'react';
import styles from './SalesReport.module.css';

// Mock sales data - in a real app, this would come from a database
const generateMockSales = () => {
  const sales = [];
  const products = ['Coffee', 'Sandwich', 'Energy Drink', 'Chips', 'Salad', 'Soda'];
  
  for (let i = 0; i < 20; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    sales.push({
      id: `TXN${1000 + i}`,
      date: date.toISOString(),
      items: products.slice(0, Math.floor(Math.random() * 3) + 1).map(product => ({
        name: product,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: (Math.random() * 10 + 1).toFixed(2)
      })),
      total: (Math.random() * 50 + 5).toFixed(2),
      paymentMethod: Math.random() > 0.5 ? 'cash' : 'card'
    });
  }
  
  return sales.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const SalesReport = () => {
  const [sales] = useState(generateMockSales());
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [showDetails, setShowDetails] = useState({});

  const filterSales = (sales, period) => {
    const now = new Date();
    let startDate;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        return sales;
    }

    return sales.filter(sale => new Date(sale.date) >= startDate);
  };

  const filteredSales = filterSales(sales, filterPeriod);
  
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
  const averageTransaction = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;
  const totalTransactions = filteredSales.length;

  const toggleDetails = (saleId) => {
    setShowDetails(prev => ({
      ...prev,
      [saleId]: !prev[saleId]
    }));
  };

  return (
    <div className={styles.salesReport}>
      <div className={styles.header}>
        <h2>📊 Sales Report</h2>
        <select 
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
          className={styles.periodFilter}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <h3>💰 Total Revenue</h3>
          <p className={styles.amount}>${totalRevenue.toFixed(2)}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>🧾 Total Transactions</h3>
          <p className={styles.count}>{totalTransactions}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>📈 Average Transaction</h3>
          <p className={styles.average}>${averageTransaction.toFixed(2)}</p>
        </div>
      </div>

      <div className={styles.salesList}>
        <h3>Recent Transactions</h3>
        {filteredSales.length === 0 ? (
          <p className={styles.noSales}>No sales found for the selected period.</p>
        ) : (
          filteredSales.map(sale => (
            <div key={sale.id} className={styles.saleItem}>
              <div 
                className={styles.saleHeader}
                onClick={() => toggleDetails(sale.id)}
              >
                <div className={styles.saleInfo}>
                  <span className={styles.transactionId}>{sale.id}</span>
                  <span className={styles.saleDate}>
                    {new Date(sale.date).toLocaleDateString()} {new Date(sale.date).toLocaleTimeString()}
                  </span>
                </div>
                <div className={styles.saleAmount}>
                  <span>${sale.total}</span>
                  <span className={styles.paymentMethod}>
                    {sale.paymentMethod === 'cash' ? '💵' : '💳'}
                  </span>
                </div>
                <span className={styles.expandIcon}>
                  {showDetails[sale.id] ? '▲' : '▼'}
                </span>
              </div>

              {showDetails[sale.id] && (
                <div className={styles.saleDetails}>
                  <h4>Items:</h4>
                  {sale.items.map((item, index) => (
                    <div key={index} className={styles.saleItem}>
                      <span>{item.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SalesReport;