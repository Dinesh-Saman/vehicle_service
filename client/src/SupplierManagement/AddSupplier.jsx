import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import Swal from 'sweetalert2'; // Import SweetAlert2
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import '../SystemOperationManagement/Pages/styles/AddSupplier.css';  // CSS file for additional styling
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function AddSupplier() {
    const navigate = useNavigate(); // Initialize useNavigate
    const [supplierName, setSupplierName] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [partsRequired, setPartsRequired] = useState("");
    const [quantity, setQuantity] = useState("");
    const [additionalNote, setAdditionalNote] = useState("");

    const [supplierNameError, setSupplierNameError] = useState("");
    const [contactPersonError, setContactPersonError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [quantityError, setQuantityError] = useState("");

    // Validation: Only allow letters and spaces for supplier name
    const handleSupplierNameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        setSupplierName(value);
        if (!value) setSupplierNameError('Supplier name is required.');
        else setSupplierNameError('');
    };

    // Validation: Only allow letters and spaces for contact person
    const handleContactPersonChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        setContactPerson(value);
        if (!value) setContactPersonError('Contact person is required.');
        else setContactPersonError('');
    };

    // Validation: Phone number should be numeric and have exactly 10 digits
    const handlePhoneNumberChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length !== 10) {
            setPhoneNumberError("Phone number must have exactly 10 digits.");
        } else {
            setPhoneNumberError("");
        }
        setPhoneNumber(value);
    };

    // Validation: Quantity should be greater than 0
    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value <= 0) {
            setQuantityError("Quantity must be greater than zero.");
        } else {
            setQuantityError("");
        }
        setQuantity(e.target.value);
    };

    // Submit function
    function sendData(e) {
        e.preventDefault();

        // Check for validation errors
        if (supplierNameError || contactPersonError || phoneNumberError || quantityError) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please correct the errors before submitting.',
                confirmButtonText: 'OK'
            });
            return; // Prevent submission if validation fails
        }

        const newSupplier = {
            supplierName,
            contactPerson,
            phoneNumber,
            address,
            partsRequired,
            quantity: parseInt(quantity, 10),
            additionalNote,
        };

        axios.post("http://localhost:3001/supplier/add", newSupplier)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    text: 'The supplier has been added successfully!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate("/supplier/all"); // Redirect to All Suppliers page
                });

                // Reset form fields after successful submission
                setSupplierName("");
                setContactPerson("");
                setPhoneNumber("");
                setAddress("");
                setPartsRequired("");
                setQuantity("");
                setAdditionalNote("");
            })
            .catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: 'An error occurred: ' + err.message,
                    confirmButtonText: 'OK'
                });
            });
    }

    return (
        <div className="d-flex align-items-center justify-content-center vh-100" style={{ marginTop: '90px' }}>
            <div className="row w-100">
                <div className="col-md-8 col-lg-6 mx-auto">
                    <div className="card border-5 shadow rounded-4 bg-light bg-opacity-75">
                        <div className="card-body p-4">
                            <h3 className="text-center mb-4 position-relative">
                                <i className="bi bi-plus-circle icon-color me-2"></i>Add New Supplier
                                <div className="title-underline"></div>
                            </h3>

                            <form onSubmit={sendData}>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="supplierName" className="form-label">
                                            <i className="bi bi-shop icon-color me-2"></i>Supplier Name
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="supplierName" 
                                            placeholder="Enter Supplier Name"
                                            value={supplierName}
                                            onChange={handleSupplierNameChange} 
                                            required
                                        />
                                        {supplierNameError && (
                                            <div className="text-danger mt-1">{supplierNameError}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="contactPerson" className="form-label">
                                            <i className="bi bi-person icon-color me-2"></i>Contact Person
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="contactPerson" 
                                            placeholder="Enter Contact Person"
                                            value={contactPerson}
                                            onChange={handleContactPersonChange} 
                                            required
                                        />
                                        {contactPersonError && (
                                            <div className="text-danger mt-1">{contactPersonError}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="phoneNumber" className="form-label">
                                            <i className="bi bi-telephone icon-color me-2"></i>Phone Number
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="phoneNumber" 
                                            placeholder="Enter Phone Number"
                                            value={phoneNumber}
                                            onChange={handlePhoneNumberChange} 
                                            required
                                        />
                                        {phoneNumberError && (
                                            <div className="text-danger mt-1">{phoneNumberError}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="address" className="form-label">
                                            <i className="bi bi-geo-alt icon-color me-2"></i>Address
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="address" 
                                            placeholder="Enter Address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">

                                <div className="col-md-6">
  <label htmlFor="partsRequired" className="form-label">
    <i className="bi bi-tools icon-color me-2"></i>Parts Required
  </label>
  <div className="dropdown">
    <button
      className="btn btn-secondary dropdown-toggle form-control"
      type="button"
      id="dropdownParts"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {partsRequired || 'Select Part'} {/* Show the selected part or default text */}
    </button>
    <ul className="dropdown-menu" aria-labelledby="dropdownParts">
      <li><button className="dropdown-item" onClick={() => setPartsRequired('Oil Filters')}><i className="bi bi-droplet me-2"></i>Oil Filters</button></li>
      <li><button className="dropdown-item" onClick={() => setPartsRequired('Air Filters')}><i className="bi bi-wind me-2"></i>Air Filters</button></li>
      <li><button className="dropdown-item" onClick={() => setPartsRequired('Spark Plugs')}><i className="bi bi-lightning me-2"></i>Spark Plugs</button></li>
      <li><button className="dropdown-item" onClick={() => setPartsRequired('Timing Belts/Chains')}><i className="bi bi-clock me-2"></i>Timing Belts/Chains</button></li>
      <li><button className="dropdown-item" onClick={() => setPartsRequired('Gaskets and Seals')}><i className="bi bi-wrench me-2"></i>Gaskets and Seals</button></li>
      <li><button className="dropdown-item" onClick={() => setPartsRequired('Transmission Fluid')}><i className="bi bi-sliders me-2"></i>Transmission Fluid</button></li>
      <li><button className="dropdown-item" onClick={() => setPartsRequired('Brake Pads')}><i className="bi bi-stop-circle me-2"></i>Brake Pads</button></li>
      <li><button className="dropdown-item" onClick={() => setPartsRequired('Clutch Kits')}><i className="bi bi-cup me-2"></i>Clutch Kits</button></li>
      <li><button className="dropdown-item" onClick={() => setPartsRequired('Brake Rotors/Discs')}><i className="bi bi-circle me-2"></i>Brake Rotors/Discs</button></li>
      <li><button className="dropdown-item" onClick={() => setPartsRequired('Shocks and Struts')}><i className="bi bi-shield me-2"></i>Shocks and Struts</button></li>
      <li><button className="dropdown-item" onClick={() => setPartsRequired('Bushings')}><i className="bi bi-square me-2"></i>Bushings</button></li>
      <li><button className="dropdown-item" onClick={() => setPartsRequired('Steering Rack and Pinion')}><i className="bi bi-arrow-up-right-circle me-2"></i>Steering Rack and Pinion</button></li>
      <li><button className="dropdown-item" onClick={() => setPartsRequired('Catalytic Converters')}><i className="bi bi-leaf me-2"></i>Catalytic Converters</button></li>
      <li><button className="dropdown-item" onClick={() => setPartsRequired('Exhaust Pipes')}><i className="bi bi-pipe me-2"></i>Exhaust Pipes</button></li>
      <li><button className="dropdown-item" onClick={() => setPartsRequired('Thermostats')}><i className="bi bi-thermometer-half me-2"></i>Thermostats</button></li>
      <li><button className="dropdown-item" onClick={() => setPartsRequired('Fuel Injectors')}><i className="bi bi-fuel-pump me-2"></i>Fuel Injectors</button></li>
      <li><button className="dropdown-item" onClick={() => setPartsRequired('Seats and Seat Belts')}><i className="bi bi-belt me-2"></i>Seats and Seat Belts</button></li>
      <li><button className="dropdown-item" onClick={() => setPartsRequired('Windshields and Windows')}><i className="bi bi-square-fill me-2"></i>Windshields and Windows</button></li>
      <li><button className="dropdown-item" onClick={() => setPartsRequired('Bumpers')}><i className="bi bi-rectangle me-2"></i>Bumpers</button></li>
    </ul>
  </div>
</div>

                                   

                                    <div className="col-md-6">
                                        <label htmlFor="quantity" className="form-label">
                                            <i className="bi bi-hash icon-color me-2"></i>Quantity
                                        </label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id="quantity" 
                                            placeholder="Enter Quantity"
                                            value={quantity}
                                            onChange={handleQuantityChange} 
                                            required
                                        />
                                        {quantityError && (
                                            <div className="text-danger mt-1">{quantityError}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="additionalNote" className="form-label">
                                        <i className="bi bi-file-earmark-text icon-color me-2"></i>Additional Notes
                                    </label>
                                    <textarea 
                                        className="form-control" 
                                        id="additionalNote" 
                                        rows="3"
                                        value={additionalNote}
                                        onChange={(e) => setAdditionalNote(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="d-flex justify-content-start align-items-center mt-3">
                                <div className="d-flex justify-content-center align-items-center mt-3">
    <button 
        type="submit" 
        className="btn btn-primary me-3" 
        style={{ 
            width: "150px", 
            height: "40px", 
            borderRadius: "8px", 
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" 
        }}
    >
        <i className="bi bi-plus-circle me-2"></i>Add Supplier
    </button>

    <button 
        type="button" 
        className="btn btn-custom" 
        style={{ 
            width: "200px", 
            height: "40px", 
            backgroundColor: "#6c757d", 
            color: "#fff", 
            borderColor: "#6c757d", 
            borderRadius: "8px", 
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease"
        }} 
        onClick={() => navigate("/sdashboard")}
        onMouseEnter={(e) => e.target.style.backgroundColor = "#5a6268"}
        onMouseLeave={(e) => e.target.style.backgroundColor = "#6c757d"}
    >
        <i className="bi bi-speedometer2"></i> Go to Dashboard
    </button>
</div>

</div>


                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
