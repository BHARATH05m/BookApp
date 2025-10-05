import api from './api';

export const createOrder = async () => {
  try {
    const response = await api.post('/api/orders');
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getUserOrders = async (userId) => {
  try {
    const response = await api.get(`/api/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const response = await api.get('/api/orders/admin');
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};
