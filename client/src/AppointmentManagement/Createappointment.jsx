import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Createappointment.css';
import backgroundImage from '../SystemOperationManagement/assets/bg1.jpg'; // Import your background image

function Createappointment() {
  const [customerName, setCustomerName] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [serviceTypes, setServiceTypes] = useState({
    "Full Service": false,
    "Bodywash": false,
    "Oil Change": false,
    "Engine Check": false,
  });
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [Phonenumber, setPhonenumber] = useState("");
  const [email, setEmail] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [vehicleModels, setVehicleModels] = useState([]);
  const navigate = useNavigate();

  const servicePrices = {
    "Full Service": 100,
    "Bodywash": 50,
    "Oil Change": 70,
    "Engine Check": 120,
  };

  const serviceIcons = {
    "Full Service": "bi-wrench",
    "Bodywash": "bi-droplet",
    "Oil Change": "bi-fuel-pump",
    "Engine Check": "bi-gear"
  };

  const serviceDescriptions = {
    "Full Service": "Complete vehicle inspection and maintenance",
    "Bodywash": "Exterior cleaning and detailing",
    "Oil Change": "Engine oil and filter replacement",
    "Engine Check": "Comprehensive engine diagnostics"
  };

  const validate = () => {
    const errors = {};
    if (!customerName.trim() || !/^[a-zA-Z\s]+$/.test(customerName)) {
      errors.customerName = "Customer name is required and should only contain letters.";
    }
    if (!vehicleModel.trim()) {
      errors.vehicleModel = "Vehicle model is required.";
    }
    if (!appointmentDate) {
      errors.appointmentDate = "Appointment date is required.";
    }
    if (!appointmentTime) {
      errors.appointmentTime = "Appointment time is required.";
    }
    if (!/^\d{10}$/.test(Phonenumber)) {
      errors.Phonenumber = "Phone number must be a valid 10-digit number.";
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email must be a valid email address.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchBookedTimes = (appointmentDate) => {
    if (appointmentDate) {
      axios.get(`http://localhost:3001/BookedTimes/${appointmentDate}`)
        .then((result) => {
          setBookedTimes(result.data);
        })
        .catch((err) => console.log(err));
    }
  };

  const fetchVehicleModels = () => {
    const models = ["Toyota Corolla", "Honda Civic", "Ford F-150", "Tesla Model S", "BMW 3 Series"];
    setVehicleModels(models);
  };

  // Get today's date in YYYY-MM-DD format for the date input min attribute
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchVehicleModels();
    fetchBookedTimes(appointmentDate);
  }, [appointmentDate]);

  const handleWhatsAppMessage = () => {
    const message = `Appointment Details:
    Customer Name: ${customerName}
    Vehicle Model: ${vehicleModel}
    Services: ${Object.keys(serviceTypes).filter(service => serviceTypes[service]).join(", ")}
    Appointment Date: ${appointmentDate}
    Appointment Time: ${appointmentTime}
    Phone Number: ${Phonenumber}
    Email: ${email}`;

    const whatsappNumber = "+94705225121";
    const whatsappURL = `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    
    window.open(whatsappURL, "_blank");
  };

  const Submit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!validate()) return;

    const selectedServices = Object.keys(serviceTypes).filter((service) => serviceTypes[service]);
    const totalPrice = selectedServices.reduce((total, service) => total + servicePrices[service], 0);

    axios
      .post("http://localhost:3001/Createappointment", {
        customerName,
        vehicleModel,
        serviceType: selectedServices,
        appointmentDate,
        appointmentTime,
        Phonenumber,
        email,
        servicePrice: totalPrice,
      })
      .then((result) => {
        handleWhatsAppMessage();
        navigate("/");
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          setErrorMessage(err.response.data.message);
        } else {
          setErrorMessage("An error occurred while creating the appointment.");
        }
      });
  };

  const renderAvailableTimes = () => {
    const times = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00`;
      times.push(time);
    }

    return times.map((time) => (
      <option key={time} value={time} disabled={bookedTimes.includes(time)}>
        {time} {bookedTimes.includes(time) ? "(Booked)" : ""}
      </option>
    ));
  };

  return (
    <div className="appointment-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="appointment-overlay"></div>
      <div className="appointment-card">
        <div className="appointment-header">
          <h2>Schedule Your Appointment</h2>
          <p className="subtitle">Fill in the details below to book your vehicle service</p>
        </div>

        <form onSubmit={Submit} className="appointment-form">
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          
          <div className="form-row">
            {/* Customer Name Input */}
            <div className="form-group">
              <label htmlFor="customerName">Customer Name</label>
              <input
                type="text"
                className={`form-control ${validationErrors.customerName ? 'is-invalid' : ''}`}
                id="customerName"
                placeholder="John Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              {validationErrors.customerName && <div className="invalid-feedback">{validationErrors.customerName}</div>}
            </div>

            {/* Vehicle Model Dropdown */}
            <div className="form-group">
              <label htmlFor="vehicleModel">Vehicle Model</label>
              <select
                className={`form-select ${validationErrors.vehicleModel ? 'is-invalid' : ''}`}
                id="vehicleModel"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
              >
                <option value="">Select your vehicle</option>
                {vehicleModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              {validationErrors.vehicleModel && <div className="invalid-feedback">{validationErrors.vehicleModel}</div>}
            </div>
          </div>

          {/* Service Types Checkboxes - Enhanced Section */}
          <div className="form-group services-group">
            <label>Select Services</label>
            <div className="service-types-grid">
              {Object.keys(serviceTypes).map((service) => (
                <div 
                  key={service} 
                  className={`service-card ${serviceTypes[service] ? 'selected' : ''}`}
                  onClick={() => {
                    setServiceTypes({
                      ...serviceTypes,
                      [service]: !serviceTypes[service],
                    });
                  }}
                >
                  <div className="service-icon">
                    <i className={`bi ${serviceIcons[service]}`}></i>
                  </div>
                  <div className="service-content">
                    <h5>{service}</h5>
                    <p className="service-description">{serviceDescriptions[service]}</p>
                    <p className="service-price">${servicePrices[service]}</p>
                  </div>
                  <input
                    type="checkbox"
                    className="service-checkbox"
                    checked={serviceTypes[service]}
                    onChange={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-row">
            {/* Appointment Date */}
            <div className="form-group">
              <label htmlFor="appointmentDate">Appointment Date</label>
              <input
                type="date"
                className={`form-control ${validationErrors.appointmentDate ? 'is-invalid' : ''}`}
                id="appointmentDate"
                value={appointmentDate}
                min={getTodayDate()}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
              {validationErrors.appointmentDate && <div className="invalid-feedback">{validationErrors.appointmentDate}</div>}
            </div>

            {/* Appointment Time */}
            <div className="form-group">
              <label htmlFor="appointmentTime">Appointment Time</label>
              <select
                className={`form-select ${validationErrors.appointmentTime ? 'is-invalid' : ''}`}
                id="appointmentTime"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
              >
                <option value="">Select time</option>
                {renderAvailableTimes()}
              </select>
              {validationErrors.appointmentTime && <div className="invalid-feedback">{validationErrors.appointmentTime}</div>}
            </div>
          </div>

          <div className="form-row">
            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="Phonenumber">Phone Number</label>
              <input
                type="text"
                className={`form-control ${validationErrors.Phonenumber ? 'is-invalid' : ''}`}
                id="Phonenumber"
                placeholder="1234567890"
                value={Phonenumber}
                maxLength={10}
                onChange={(e) => setPhonenumber(e.target.value)}
              />
              {validationErrors.Phonenumber && <div className="invalid-feedback">{validationErrors.Phonenumber}</div>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                id="email"
                placeholder="example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {validationErrors.email && <div className="invalid-feedback">{validationErrors.email}</div>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-submit">
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-calendar-check"></i> Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Createappointment;