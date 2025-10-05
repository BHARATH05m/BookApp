import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { initiateUPIPayment, verifyUPIPayment } from '../services/paymentService';
import './UPIPayment.css';

const UPIPayment = ({ totalAmount, onPaymentSuccess, onPaymentCancel, addressData }) => {
  const [paymentStatus, setPaymentStatus] = useState('initializing'); // initializing, pending, processing, success, failed
  const [transactionId, setTransactionId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [upiId, setUpiId] = useState('bookstore@paytm'); // Default UPI ID
  const [customUpiId, setCustomUpiId] = useState('');
  const [showCustomUpi, setShowCustomUpi] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timeout
  const [upiString, setUpiString] = useState('');

  // Initialize payment
  useEffect(() => {
    initializePayment();
  }, []);

  const initializePayment = async () => {
    try {
      setPaymentStatus('initializing');
      const currentUpiId = showCustomUpi ? customUpiId : upiId;
      const response = await initiateUPIPayment(currentUpiId);
      
      setTransactionId(response.transactionId);
      setOrderId(response.orderId);
      setUpiString(response.upiString);
      setPaymentStatus('pending');
    } catch (error) {
      console.error('Payment initialization error:', error);
      setPaymentStatus('failed');
    }
  };

  // Timer countdown
  useEffect(() => {
    if (paymentStatus === 'pending' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && paymentStatus === 'pending') {
      setPaymentStatus('failed');
    }
  }, [timeLeft, paymentStatus]);

  const handlePaymentSuccess = async () => {
    try {
      setPaymentStatus('processing');
      const response = await verifyUPIPayment(transactionId);
      
      if (response.success) {
        setPaymentStatus('success');
        setTimeout(() => {
          onPaymentSuccess(transactionId);
        }, 2000);
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentStatus('failed');
    }
  };

  const handlePaymentFailure = () => {
    setPaymentStatus('failed');
  };

  const handleRetryPayment = () => {
    setPaymentStatus('initializing');
    setTimeLeft(300);
    initializePayment();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="upi-payment-modal">
      <div className="upi-payment-content">
        <div className="upi-payment-header">
          <h3>UPI Payment</h3>
          <button className="close-btn" onClick={onPaymentCancel}>×</button>
        </div>

        {paymentStatus === 'pending' && (
          <div className="upi-payment-body">
            <div className="payment-info">
              <div className="amount-section">
                <h4>Amount to Pay</h4>
                <div className="amount">₹{totalAmount.toFixed(2)}</div>
              </div>
              
              {addressData && (
                <div className="delivery-info">
                  <h4>Delivery Address</h4>
                  <div className="address-details">
                    <p><strong>{addressData.fullName}</strong></p>
                    <p>{addressData.address}</p>
                    <p>{addressData.city}, {addressData.state} - {addressData.pincode}</p>
                    <p>Phone: {addressData.phone}</p>
                    {addressData.landmark && <p>Landmark: {addressData.landmark}</p>}
                  </div>
                </div>
              )}
              
              <div className="transaction-info">
                <p><strong>Transaction ID:</strong> {transactionId}</p>
                <p><strong>Time Left:</strong> <span className="timer">{formatTime(timeLeft)}</span></p>
              </div>
            </div>

            <div className="upi-options">
              <div className="upi-id-section">
                <label>
                  <input 
                    type="radio" 
                    name="upiOption" 
                    checked={!showCustomUpi}
                    onChange={() => setShowCustomUpi(false)}
                  />
                  Use Default UPI ID: {upiId}
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="upiOption" 
                    checked={showCustomUpi}
                    onChange={() => setShowCustomUpi(true)}
                  />
                  Use Custom UPI ID
                </label>
                {showCustomUpi && (
                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g., yourname@paytm)"
                    value={customUpiId}
                    onChange={(e) => setCustomUpiId(e.target.value)}
                    className="custom-upi-input"
                  />
                )}
              </div>
            </div>

            <div className="qr-section">
              <h4>Scan QR Code with any UPI App</h4>
              <div className="qr-container">
                <QRCode 
                  value={upiString} 
                  size={200}
                  level="M"
                />
              </div>
              <p className="qr-instruction">
                Open any UPI app (PhonePe, Google Pay, Paytm, etc.) and scan this QR code
              </p>
            </div>

            <div className="payment-actions">
              <button 
                className="success-btn"
                onClick={handlePaymentSuccess}
              >
                I have paid successfully
              </button>
              <button 
                className="failure-btn"
                onClick={handlePaymentFailure}
              >
                Payment failed
              </button>
            </div>
          </div>
        )}

        {paymentStatus === 'initializing' && (
          <div className="payment-processing">
            <div className="spinner"></div>
            <h4>Initializing Payment...</h4>
            <p>Please wait while we set up your payment.</p>
          </div>
        )}

        {paymentStatus === 'processing' && (
          <div className="payment-processing">
            <div className="spinner"></div>
            <h4>Processing Payment...</h4>
            <p>Please wait while we verify your payment.</p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="payment-success">
            <div className="success-icon">✓</div>
            <h4>Payment Successful!</h4>
            <p>Transaction ID: {transactionId}</p>
            <p>Your order has been confirmed.</p>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="payment-failed">
            <div className="failed-icon">✗</div>
            <h4>Payment Failed</h4>
            <p>Your payment could not be processed or timed out.</p>
            <div className="retry-actions">
              <button className="retry-btn" onClick={handleRetryPayment}>
                Try Again
              </button>
              <button className="cancel-btn" onClick={onPaymentCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UPIPayment;
