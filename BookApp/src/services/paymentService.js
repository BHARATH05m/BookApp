import api from './api';

export const initiateUPIPayment = async (upiId) => {
  const { data } = await api.post('/payments/upi/initiate', { upiId });
  return data;
};

export const verifyUPIPayment = async (transactionId) => {
  const { data } = await api.post('/payments/upi/verify', { transactionId });
  return data;
};

export const getPaymentStatus = async (transactionId) => {
  const { data } = await api.get(`/payments/status/${transactionId}`);
  return data;
};

export const processRefund = async (orderId, amount, reason) => {
  const { data } = await api.post('/payments/refund', { orderId, amount, reason });
  return data;
};
