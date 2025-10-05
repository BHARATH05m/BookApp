import React, { useState, useEffect } from 'react';
import { getPurchasedItems } from '../services/cartService';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await getPurchasedItems();
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
        alert('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="container admin-orders">
      <h1>User Orders</h1>
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Books Bought</th>
              <th>Total Amount</th>
              <th>Order Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-orders">No orders found</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td className="username-cell">
                    <strong>{order.userId?.username || 'Unknown User'}</strong>
                  </td>
                  <td className="books-cell">
                    <div className="books-list">
                      {order.items.map((item, index) => (
                        <div key={index} className="book-item">
                          <div className="book-cover-small">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.title} />
                            ) : (
                              <span>📘</span>
                            )}
                          </div>
                          <div className="book-details">
                            <div className="book-title">{item.title}</div>
                            <div className="book-author">by {item.author}</div>
                            <div className="book-price">₹{item.price.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="total-cell">
                    <strong>₹{order.totalAmount.toFixed(2)}</strong>
                  </td>
                  <td className="date-cell">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="status-cell">
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
