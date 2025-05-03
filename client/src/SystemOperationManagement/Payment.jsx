import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faCalendarAlt, faBuilding } from '@fortawesome/free-solid-svg-icons'; // Importing solid icons
import { faCcVisa, faCcMastercard, faCcAmex } from '@fortawesome/free-brands-svg-icons'; // Importing brand icons
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Pages/styles/Payment.css';

const Payment = () => {
  const location = useLocation();
  const { packageId, packageName, packagePrice, selectedDate } = location.state || {};
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const validateCardNumber = (number) => /^\d{12,16}$/.test(number);
  const validateCVV = (cvv) => /^\d{3}$/.test(cvv);
  const isExpiryDateValid = (date) => {
    const now = new Date();
    const [year, month] = date.split('-').map(Number);
    const expiry = new Date(year, month - 1);
    return expiry > now;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!validateCardNumber(cardNumber)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Card Number',
        text: 'Card number must be between 12 and 16 digits.',
      });
      return;
    }
    if (!validateCVV(cvv)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid CVV',
        text: 'CVV must be 3 digits.',
      });
      return;
    }
    if (!isExpiryDateValid(expiryDate)) {
      Swal.fire({
        icon: 'error',
        title: 'Expired Card',
        text: 'The card has expired.',
      });
      return;
    }
    if (!selectedBank) {
      Swal.fire({
        icon: 'error',
        title: 'Bank Selection Required',
        text: 'Please select a bank.',
      });
      return;
    }

    // Simulate a successful payment submission
    Swal.fire({
      icon: 'success',
      title: 'Payment Successful',
      text: 'Your payment details have been submitted successfully!',
    });
  };

  return (
    <div className="container mt-5">
      <div className="payment-container">
        <h3 className="text-center mb-4">Payment for Package</h3>
        <p className="text-center mb-4 selected-date">
          You selected the date: {new Date(selectedDate).toLocaleDateString()}
        </p>

        <div className="package-details text-center mb-4">
          <h4>Package Details</h4>
          <p><strong>Package Name:</strong> {packageName}</p>
          <p><strong>Total Price:</strong> ${packagePrice}</p>
        </div>

        <div className="payment-icons text-center mb-4">
          <FontAwesomeIcon icon={faCcVisa} size="2x" color="#1A1F71" title="Visa" />
          <FontAwesomeIcon icon={faCcMastercard} size="2x" color="#EB001B" title="MasterCard" />
          <FontAwesomeIcon icon={faCcAmex} size="2x" color="#00A3E0" title="American Express" />
          {/* You can add more icons here */}
        </div>

        <div className="payment-form-container">
          <form onSubmit={handlePayment}>
            <div className="mb-3">
              <label htmlFor="cardNumber" className="form-label">
                <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                className="form-control"
                maxLength="16"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
                placeholder="Enter your card number"
              />
            </div>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="cvv" className="form-label">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  className="form-control"
                  maxLength="3"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                  placeholder="123"
                />
              </div>
              <div className="col">
                <label htmlFor="expiryDate" className="form-label">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                  Expiry Date
                </label>
                <input
                  type="month"
                  id="expiryDate"
                  className="form-control"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="bankSelect" className="form-label">
                <FontAwesomeIcon icon={faBuilding} className="me-2" />
                Select Bank
              </label>
              <select
                id="bankSelect"
                className="form-select"
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                required
              >
                <option value="">Choose a bank...</option>
                <option value="boc">BOC Bank</option>
                <option value="people-commercial">People's Commercial</option>
                <option value="hnb">HNB</option>
                <option value="dfcc">DFCC</option>
                {/* Add more banks as needed */}
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Confirm Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
