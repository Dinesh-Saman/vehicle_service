import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faCar, faTools, faCogs, faTachometerAlt, 
  faOilCan, faBatteryHalf, faWrench, faGasPump, faKey, faTruck,
  faCalendarAlt, faTag, faClock, faUsers, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { faCcVisa, faCcMastercard, faPaypal } from '@fortawesome/free-brands-svg-icons';
import { Modal, Button, Card, Form, Badge, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';
import './ViewAllPackages.css'; // Custom CSS file

// Sample images for background
import carImage1 from '../systemoperationmanagement/assets/bg4.jpg'; // Image 1
import carImage2 from '../systemoperationmanagement/assets/bg6.jpg'; // Image 2
import carImage3 from '../systemoperationmanagement/assets/bg7.jpg'; // Image 2
import carImage4 from '../systemoperationmanagement/assets/bg8.jpg'; // Image 2
import carImage5 from '../systemoperationmanagement/assets/bg9.jpg'; // Image 2


const images = [carImage1, carImage2, carImage3, carImage4, carImage5];

const ViewAllPackages = () => {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(images[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const navigate = useNavigate();

  const predefinedIcons = [
    faCar, faTools, faCogs, faTachometerAlt, faOilCan, 
    faBatteryHalf, faWrench, faGasPump, faKey, faTruck,
  ];

  // Rotate background images
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % images.length;
      setBackgroundImage(images[index]);
    }, 8000);
    return () => clearInterval(interval);
  }, [images]);

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get("http://localhost:3001/package/");
        setPackages(response.data);
        setFilteredPackages(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching packages:", error);
        Swal.fire('Error!', 'Failed to fetch packages.', 'error');
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Filter and sort packages
  useEffect(() => {
    let filtered = packages.filter((pkg) =>
      pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered = filtered.filter((pkg) =>
      pkg.price >= priceRange[0] && pkg.price <= priceRange[1]
    );

    if (sortOption === "max-price") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "min-price") {
      filtered.sort((a, b) => a.price - b.price);
    }

    setFilteredPackages(filtered);
  }, [searchTerm, packages, sortOption, priceRange]);

  // Notification functions
  const notifyUnavailable = () => toast.error('This package cannot be booked at the moment.');
  const notifyBookingSuccess = () => toast.success('Package booked successfully!');

  // Handle booking click
  const handleBookClick = (pkg) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Not Logged In',
        text: 'Please log in to book a package.',
        confirmButtonText: 'Login',
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    if (pkg.availability && pkg.maxCustomers > 0) {
      setSelectedPackage(pkg);
      setShowModal(true);
    } else {
      notifyUnavailable();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'This package cannot be booked at the moment.',
      });
    }

    if (pkg.maxCustomers === 0) {
      Swal.fire({
        title: 'Oops!',
        text: 'All slots are finished!',
        icon: 'error',
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else if (pkg.maxCustomers === 1) {
      Swal.fire({
        title: 'Hurry up!',
        html: `<i class="fas fa-exclamation-triangle" style="color: orange;"></i> Only 1 slot available!`,
        icon: 'info',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setShowModal(false);
    setCardNumber('');
    setCvv('');
    setExpiryDate('');
    setSelectedBank('');
    setSelectedDate(new Date());
  };

  // Handle date change with validation
  const handleDateChange = (date) => {
    const today = new Date();
    if (date < today) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date',
        text: 'Please select a future date.',
        confirmButtonColor: '#3085d6'
      });
    } else {
      setSelectedDate(date);
    }
  };

  // Process payment and booking
  const handleProceedToPayment = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Not Logged In',
        text: 'Please log in to proceed with payment.',
        confirmButtonText: 'Login',
      }).then(() => {
        navigate('/register');
      });
      return;
    }

    // Validate payment details
    if (!cardNumber || !cvv || !expiryDate || !selectedBank) {
      Swal.fire('Validation Error', 'Please fill out all payment details.', 'warning');
      return;
    }

    if (!/^\d{3}$/.test(cvv)) {
      Swal.fire('Validation Error', 'Invalid CVV number.', 'warning');
      return;
    }

    if (cardNumber.replace(/\s+/g, '').length !== 16) {
      Swal.fire('Validation Error', 'Invalid card number.', 'warning');
      return;
    }

    const today = new Date();
    const [expiryMonth, expiryYear] = expiryDate.split('/');
    if (
      !expiryMonth ||
      !expiryYear ||
      expiryMonth < 1 ||
      expiryMonth > 12 ||
      parseInt(expiryYear) < parseInt(today.getFullYear().toString().slice(-2))
    ) {
      Swal.fire('Validation Error', 'Please enter a valid expiry date.', 'warning');
      return;
    }

    try {
      const userId = getUserIdFromToken(token);
      if (!userId) {
        Swal.fire('Error', 'Invalid token. Please log in again.', 'error');
        navigate('/register');
        return;
      }

      // Calculate pricing
      const originalPrice = selectedPackage.price;
      const discount = selectedPackage.discount || 0;
      const discountAmount = (originalPrice * discount) / 100;
      const totalPrice = originalPrice - discountAmount;

      const bookingData = {
        packageId: selectedPackage._id,
        selectedDate: selectedDate.toISOString(),
        payment: {
          amount: totalPrice,
          paymentMethod: selectedBank,
          cardNumber: cardNumber.replace(/\s+/g, ''),
          cvv: cvv,
          expiryDate: expiryDate,
          receiptId: generateReceiptId(),
        },
      };

      // Update package availability
      const updatedMaxCustomers = selectedPackage.maxCustomers - 1;
      const updatedAvailability = updatedMaxCustomers > 0;

      await axios.put(`http://localhost:3001/package/update/${selectedPackage._id}`, {
        maxCustomers: updatedMaxCustomers,
        availability: updatedAvailability,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local state
      setPackages(prevPackages => prevPackages.map(pkg =>
        pkg._id === selectedPackage._id
          ? { ...pkg, maxCustomers: updatedMaxCustomers, availability: updatedAvailability }
          : pkg
      ));

      // Generate receipt
      const receiptData = {
        receiptId: bookingData.payment.receiptId,
        packageName: selectedPackage.packageName,
        originalPrice: originalPrice.toFixed(2),
        discount: discount,
        discountAmount: discountAmount.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
        bookingDate: selectedDate.toLocaleDateString(),
        paymentMethod: selectedBank,
      };

      // Save receipt
      const existingReceipts = JSON.parse(localStorage.getItem('receipts')) || [];
      existingReceipts.push(receiptData);
      localStorage.setItem('receipts', JSON.stringify(existingReceipts));

      // Generate PDF receipt
      const receiptElement = document.createElement('div');
      receiptElement.className = 'receipt-pdf';
      receiptElement.innerHTML = `
        <div class="receipt-header">
          <h4>Levaggio</h4>
          <h2>Receipt</h2>
        </div>
        <div class="receipt-body">
          <p><strong>Package Name:</strong> ${selectedPackage.packageName}</p>
          <p><strong>Original Price:</strong> $${originalPrice.toFixed(2)}</p>
          <p><strong>Discount:</strong> ${discount}% (-$${discountAmount.toFixed(2)})</p>
          <p><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</p>
          <p><strong>Date of Booking:</strong> ${selectedDate.toLocaleDateString()}</p>
          <p><strong>Payment Method:</strong> ${selectedBank}</p>
          <p><strong>Receipt ID:</strong> ${bookingData.payment.receiptId}</p>
        </div>
        <div class="receipt-footer">
          <p>Thank you for your booking!</p>
        </div>
      `;

      document.body.appendChild(receiptElement);

      await html2canvas(receiptElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10);
        pdf.save(`receipt_${bookingData.payment.receiptId}.pdf`);
      });

      document.body.removeChild(receiptElement);

      notifyBookingSuccess();

      Swal.fire({
        icon: 'success',
        title: 'Payment Successful!',
        text: `Your payment of $${totalPrice.toFixed(2)} has been processed successfully.`,
      }).then(() => {
        handleCloseModal();
        navigate('/');
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      Swal.fire('Error!', error.response?.data?.message || 'Payment processing failed.', 'error');
    }
  };

  // Helper functions
  const getUserIdFromToken = (token) => {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.userId;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const generateReceiptId = () => {
    return 'RCPT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(value);
  };

  const handleExpiryDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').replace(/(.{2})(.{2})/, '$1/$2');
    setExpiryDate(value);
  };

  return (
    <div 
      className="view-all-packages-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="container main-content">
        <div className="header-section text-center mb-5">
          <h1 className="page-title">Our Service Packages</h1>
          <p className="page-subtitle">Choose the perfect package for your vehicle</p>
          
          <div className="search-filter-section">
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-controls">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="filter-select"
              >
                <option value="default">Sort By</option>
                <option value="max-price">Price: High to Low</option>
                <option value="min-price">Price: Low to High</option>
              </select>
              
              <select
                value={priceRange.join(',')}
                onChange={(e) => setPriceRange(e.target.value.split(',').map(Number))}
                className="filter-select"
              >
                <option value="0,1500">All Prices</option>
                <option value="0,100">Under $100</option>
                <option value="100,500">$100 - $500</option>
                <option value="500,1000">$500 - $1000</option>
                <option value="1000,1500">Over $1000</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-spinner">
            <Spinner animation="border" variant="primary" />
            <p>Loading packages...</p>
          </div>
        ) : filteredPackages.length > 0 ? (
          <div className="packages-grid">
            {filteredPackages.map((pkg, index) => (
              <div 
                key={pkg._id} 
                className={`package-card ${hoveredCard === index ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="card-icon">
                  <FontAwesomeIcon icon={predefinedIcons[index % predefinedIcons.length]} />
                </div>
                
                <div className="card-body">
                  <h3 className="card-title">{pkg.packageName}</h3>
                  
                  <div className="package-details">
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faTag} />
                      <span>${pkg.price}</span>
                    </div>
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faClock} />
                      <span>{pkg.duration} hours</span>
                    </div>
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faUsers} />
                      <span>{pkg.maxCustomers} slots left</span>
                    </div>
                    {pkg.discount > 0 && (
                      <div className="discount-badge">
                        <Badge bg="success">{pkg.discount}% OFF</Badge>
                      </div>
                    )}
                  </div>
                  
                  <p className="card-description">{pkg.description || 'Premium service package'}</p>
                  
                  <div className="card-actions">
                    <Link 
                      to={`/view-package/${pkg._id}`} 
                      className="btn btn-outline-primary action-btn"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => handleBookClick(pkg)}
                      className={`btn btn-primary action-btn ${pkg.maxCustomers === 0 ? 'disabled' : ''}`}
                      disabled={pkg.maxCustomers === 0}
                    >
                      Book Now
                    </button>
                  </div>
                  
                  {pkg.maxCustomers === 0 && (
                    <div className="availability-alert">
                      <FontAwesomeIcon icon={faCheckCircle} />
                      <span>Fully Booked</span>
                    </div>
                  )}
                  {pkg.maxCustomers === 1 && (
                    <div className="availability-warning">
                      <FontAwesomeIcon icon={faCheckCircle} />
                      <span>Last Slot!</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <FontAwesomeIcon icon={faSearch} size="3x" />
            <h4>No packages found</h4>
            <p>Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Book Package</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPackage && (
            <div className="booking-modal-content">
              <div className="package-summary">
                <h4>{selectedPackage.packageName}</h4>
                <div className="price-section">
                  <span className="original-price">${selectedPackage.price}</span>
                  {selectedPackage.discount > 0 && (
                    <>
                      <span className="discount-price">
                        ${(selectedPackage.price * (1 - selectedPackage.discount / 100)).toFixed(2)}
                      </span>
                      <span className="discount-badge">
                        {selectedPackage.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="package-description">{selectedPackage.description}</p>
              </div>
              
              <div className="booking-form">
                <div className="form-section">
                  <h5>Appointment Date</h5>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="MMMM d, yyyy"
                    className="form-control date-picker"
                    minDate={new Date()}
                    popperPlacement="bottom"
                  />
                </div>
                
                <div className="form-section">
                  <h5>Payment Method</h5>
                  <div className="payment-methods">
                    <button
                      type="button"
                      className={`payment-method ${selectedBank === 'Visa' ? 'active' : ''}`}
                      onClick={() => setSelectedBank('Visa')}
                    >
                      <FontAwesomeIcon icon={faCcVisa} size="2x" />
                      <span>Visa</span>
                    </button>
                    <button
                      type="button"
                      className={`payment-method ${selectedBank === 'MasterCard' ? 'active' : ''}`}
                      onClick={() => setSelectedBank('MasterCard')}
                    >
                      <FontAwesomeIcon icon={faCcMastercard} size="2x" />
                      <span>MasterCard</span>
                    </button>
                    <button
                      type="button"
                      className={`payment-method ${selectedBank === 'PayPal' ? 'active' : ''}`}
                      onClick={() => setSelectedBank('PayPal')}
                    >
                      <FontAwesomeIcon icon={faPaypal} size="2x" />
                      <span>PayPal</span>
                    </button>
                  </div>
                </div>
                
                <div className="form-section">
                  <h5>Card Details</h5>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Expiry Date (MM/YY)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={expiryDate}
                          onChange={handleExpiryDateChange}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>CVV</label>
                        <input
                          type="text"
                          className="form-control"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                          placeholder="123"
                          maxLength="3"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="payment-summary">
                  <div className="summary-item">
                    <span>Package Price:</span>
                    <span>${selectedPackage.price}</span>
                  </div>
                  {selectedPackage.discount > 0 && (
                    <div className="summary-item discount">
                      <span>Discount ({selectedPackage.discount}%):</span>
                      <span>-${(selectedPackage.price * selectedPackage.discount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-item total">
                    <span>Total Amount:</span>
                    <span>${(selectedPackage.price * (1 - selectedPackage.discount / 100)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleProceedToPayment}>
            Confirm & Pay
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewAllPackages;