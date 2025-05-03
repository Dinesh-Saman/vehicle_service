import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import '../Pages/styles/PaymentContainer.css';

const PaymentContainer = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    // Retrieve the package details from localStorage
    const pkg = JSON.parse(localStorage.getItem('selectedPackage'));
    setSelectedPackage(pkg);
  }, []);

  const handlePayment = () => {
    // Handle payment processing logic here
    alert('Payment Successful!');
    // Optionally clear the selected package from localStorage after payment
    localStorage.removeItem('selectedPackage');
  };

  return (
    <div className="payment-container">
      <h3 className="text-center mb-4">Payment Information</h3>
      {selectedPackage ? (
        <div className="payment-card">
          <h5>Package Name: {selectedPackage.packageName}</h5>
          <p><strong>Price:</strong> ${selectedPackage.price}</p>
          <p><strong>Category:</strong> {selectedPackage.category}</p>
          <p><strong>Discount:</strong> {selectedPackage.discount}%</p>
          <button className="btn btn-success" onClick={handlePayment}>Pay Now</button>
        </div>
      ) : (
        <p>No package selected for payment.</p>
      )}
    </div>
  );
};

export default PaymentContainer;
