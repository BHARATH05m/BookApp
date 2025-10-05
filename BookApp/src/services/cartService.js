import api from './api';

export const addToCart = async ({ bookId, title, author, price, imageUrl }) => {
  const { data } = await api.post('/cart/add', { bookId, title, author, price, imageUrl });
  return data.item;
};

export const getCart = async (userId) => {
  // Backend uses authenticateToken middleware, so userId comes from token
  // Pass userId as query param if needed as fallback
  const { data } = await api.get('/cart', { params: { userId } });
  return data.items;
};

export const removeCartItem = async (itemId) => {
  const { data } = await api.delete(`/cart/${itemId}`);
  return data;
};

export const checkoutCart = async (addressData = null, transactionId = null) => {
  const payload = {};
  if (addressData) {
    payload.address = addressData;
  }
  if (transactionId) {
    payload.transactionId = transactionId;
  }
  const { data } = await api.post('/cart/checkout', payload);
  return data;
};

export const getPurchasedItems = async () => {
  const { data } = await api.get('/cart/admin/purchased');
  return data;
};


