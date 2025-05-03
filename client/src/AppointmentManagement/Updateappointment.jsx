import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FiCalendar, FiClock, FiUser, FiMail, FiPhone, FiTruck, FiEdit } from "react-icons/fi";
import backgroundImage from '../SystemOperationManagement/assets/bg1.jpg';
import './updateappointment.css';

function Updateappointment() {
  const { id } = useParams();
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
  const [initialValues, setInitialValues] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);
  const [vehicleModels, setVehicleModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    return errors;
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

  useEffect(() => {
    axios.get(`http://localhost:3001/appointments/${id}`)
      .then(result => {
        const appointment = result.data;
        setCustomerName(appointment.customerName);
        setVehicleModel(appointment.vehicleModel);
        setAppointmentDate(appointment.appointmentDate);
        setAppointmentTime(appointment.appointmentTime);
        setPhonenumber(appointment.Phonenumber);
        setEmail(appointment.email);
        
        // Initialize service types
        const updatedServiceTypes = { ...serviceTypes };
        appointment.serviceType.forEach(service => {
          if (updatedServiceTypes.hasOwnProperty(service)) {
            updatedServiceTypes[service] = true;
          }
        });
        setServiceTypes(updatedServiceTypes);
        
        setInitialValues(appointment);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }, [id]);

  const hasChanges = () => {
    const currentServiceTypes = Object.keys(serviceTypes).filter(service => serviceTypes[service]);
    return (
      customerName !== initialValues.customerName ||
      vehicleModel !== initialValues.vehicleModel ||
      JSON.stringify(currentServiceTypes) !== JSON.stringify(initialValues.serviceType) ||
      appointmentDate !== initialValues.appointmentDate ||
      appointmentTime !== initialValues.appointmentTime ||
      Phonenumber !== initialValues.Phonenumber ||
      email !== initialValues.email
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please correct the highlighted fields.',
      });
      return;
    }

    if (!hasChanges()) {
      Swal.fire({
        icon: 'info',
        title: 'No Changes Detected',
        text: 'There are no changes to save.',
      });
      return;
    }

    const selectedServices = Object.keys(serviceTypes).filter(service => serviceTypes[service]);
    const totalPrice = selectedServices.reduce((total, service) => total + servicePrices[service], 0);

    axios.put(`http://localhost:3001/Updateappointments/${id}`, {
      customerName,
      vehicleModel,
      serviceType: selectedServices,
      appointmentDate,
      appointmentTime,
      Phonenumber,
      email,
      servicePrice: totalPrice,
    })
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Appointment Updated',
        text: 'The appointment has been updated successfully!',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        navigate("/AppTable");
      });
    })
    .catch(err => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'An error occurred while updating the appointment.',
      });
      console.log(err);
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

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading appointment details...</p>
      </div>
    );
  }

  return (
    <div className="appointment-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="appointment-overlay"></div>
      <div className="appointment-card">
        <div className="appointment-header">
          <h2>Update Appointment</h2>
          <p className="subtitle">Modify the details below to update your vehicle service</p>
        </div>

        <form onSubmit={handleSubmit} className="appointment-form">
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customerName"><FiUser /> Customer Name</label>
              <input
                type="text"
                className="form-control"
                id="customerName"
                placeholder="John Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="vehicleModel"><FiTruck /> Vehicle Model</label>
              <select
                className="form-select"
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
            </div>
          </div>

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
            <div className="form-group">
              <label htmlFor="appointmentDate"><FiCalendar /> Appointment Date</label>
              <input
                type="date"
                className="form-control"
                id="appointmentDate"
                value={appointmentDate}
                min={getTodayDate()}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="appointmentTime"><FiClock /> Appointment Time</label>
              <select
                className="form-select"
                id="appointmentTime"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
              >
                <option value="">Select time</option>
                {renderAvailableTimes()}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="Phonenumber"><FiPhone /> Phone Number</label>
              <input
                type="text"
                className="form-control"
                id="Phonenumber"
                placeholder="1234567890"
                value={Phonenumber}
                maxLength={10}
                onChange={(e) => setPhonenumber(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email"><FiMail /> Email Address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-submit">
            <button type="submit" className="btn btn-primary">
              <FiEdit /> Update Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Updateappointment;