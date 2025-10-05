const crypto = require('crypto-js');
const { v4: uuidv4 } = require('uuid');

class PaymentService {
  constructor() {
    this.merchantId = process.env.MERCHANT_ID || 'BOOKSTORE123';
    this.merchantKey = process.env.MERCHANT_KEY || 'your-secret-key';
    this.upiId = process.env.UPI_ID || 'bookstore@paytm';
  }

  // Generate UPI payment request
  generateUPIPaymentRequest(amount, orderId, customerInfo = {}) {
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    const paymentData = {
      merchantId: this.merchantId,
      transactionId,
      orderId,
      amount: amount.toFixed(2),
      currency: 'INR',
      upiId: this.upiId,
      customerName: customerInfo.name || 'Customer',
      customerEmail: customerInfo.email || '',
      customerPhone: customerInfo.phone || '',
      timestamp: new Date().toISOString(),
      returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/callback`,
      notifyUrl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/notify`
    };

    // Generate checksum for security
    const checksum = this.generateChecksum(paymentData);
    paymentData.checksum = checksum;

    return {
      ...paymentData,
      upiString: this.generateUPIString(paymentData),
      qrCode: this.generateQRCodeData(paymentData)
    };
  }

  // Generate UPI payment string
  generateUPIString(paymentData) {
    const { upiId, amount, transactionId, orderId } = paymentData;
    const merchantName = 'BookStore';
    const transactionNote = `Payment for Order ${orderId}`;
    
    return `upi://pay?pa=${upiId}&pn=${merchantName}&am=${amount}&cu=INR&tn=${transactionNote}&tr=${transactionId}`;
  }

  // Generate QR code data
  generateQRCodeData(paymentData) {
    return this.generateUPIString(paymentData);
  }

  // Generate checksum for payment security
  generateChecksum(paymentData) {
    const { merchantId, transactionId, orderId, amount, currency } = paymentData;
    const dataString = `${merchantId}|${transactionId}|${orderId}|${amount}|${currency}|${this.merchantKey}`;
    return crypto.SHA256(dataString).toString();
  }

  // Verify payment callback
  verifyPaymentCallback(callbackData) {
    const { transactionId, status, checksum } = callbackData;
    
    // Verify checksum
    const expectedChecksum = this.generateChecksum(callbackData);
    if (checksum !== expectedChecksum) {
      throw new Error('Invalid payment callback - checksum mismatch');
    }

    return {
      transactionId,
      status: status === 'success' ? 'completed' : 'failed',
      paymentTime: new Date(),
      verified: true
    };
  }

  // Simulate UPI payment verification (for demo purposes)
  simulateUPIPaymentVerification(transactionId) {
    // In a real implementation, this would call the UPI gateway API
    // For demo purposes, we'll simulate a successful payment after a delay
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 90% success rate
        const isSuccess = Math.random() > 0.1;
        resolve({
          transactionId,
          status: isSuccess ? 'completed' : 'failed',
          paymentTime: new Date(),
          gatewayResponse: {
            responseCode: isSuccess ? '00' : '01',
            responseMessage: isSuccess ? 'Transaction successful' : 'Transaction failed',
            gatewayTransactionId: `GT${Date.now()}${Math.random().toString(36).substr(2, 5)}`
          }
        });
      }, 2000); // 2 second delay to simulate real payment processing
    });
  }

  // Get payment status
  async getPaymentStatus(transactionId) {
    // In a real implementation, this would query the payment gateway
    // For demo purposes, we'll return a mock status
    return {
      transactionId,
      status: 'completed',
      paymentTime: new Date(),
      amount: 0, // This would be fetched from the database
      gatewayTransactionId: `GT${transactionId}`
    };
  }

  // Process refund
  async processRefund(transactionId, amount, reason = 'Customer request') {
    // In a real implementation, this would call the payment gateway's refund API
    const refundId = `REF${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    return {
      refundId,
      transactionId,
      amount,
      status: 'processed',
      processedAt: new Date(),
      reason
    };
  }
}

module.exports = new PaymentService();
