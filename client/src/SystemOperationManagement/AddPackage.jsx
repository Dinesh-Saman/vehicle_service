import React, { useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2'; // Import SweetAlert2
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons

export default function AddPackage() {
    const [packageName, setPackageName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [discount, setDiscount] = useState("");
    const [description, setDescription] = useState("");
    const [availability, setAvailability] = useState(true);
    const [duration, setDuration] = useState("");
    const [maxCustomers, setMaxCustomers] = useState("");
    const [termsAndConditions, setTermsAndConditions] = useState("");

    const [packageNameError, setPackageNameError] = useState("");
    const [priceError, setPriceError] = useState("");
    const [discountError, setDiscountError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [termsAndConditionsError, setTermsAndConditionsError] = useState("");
    const [durationError, setDurationError] = useState("");
    const [maxCustomersError, setMaxCustomersError] = useState("");

    // Validation: Only allow letters and spaces for package name
    const handlePackageNameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        setPackageName(value);
        if (!value) setPackageNameError('Package name is required.');
        else setPackageNameError('');
    };

    // Validation: Price can't be negative or zero
    function handlePriceChange(e) {
        const value = parseFloat(e.target.value);
        if (value <= 0) {
            setPriceError("Price must be greater than zero.");
        } else {
            setPriceError("");
        }
        setPrice(e.target.value);
    }

    // Validation: Discount should be between 1 and 100
    function handleDiscountChange(e) {
        const value = parseFloat(e.target.value);
        if (value <= 0 || value > 100) {
            setDiscountError("Discount must be between 1 and 100.");
        } else {
            setDiscountError("");
        }
        setDiscount(e.target.value);
    }

    // Validation: Only strings allowed for description
    const handleDescriptionChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        setDescription(value);
        if (!value) setDescriptionError('Description is required.');
        else setDescriptionError('');
    };

    // Validation: Only strings allowed for terms and conditions
    function handleTermsAndConditionsChange(e) {
        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        setTermsAndConditions(value);
        if (!value) setTermsAndConditionsError("Terms and Conditions can only contain letters and spaces.");
        else setTermsAndConditionsError('');
    }

    // Validation: Duration can't be negative or zero
    function handleDurationChange(e) {
        const value = parseFloat(e.target.value);
        if (value <= 0) {
            setDurationError("Duration must be greater than zero.");
        } else {
            setDurationError("");
        }
        setDuration(e.target.value);
    }

    // Validation: Max Customers can't be zero or negative
    function handleMaxCustomersChange(e) {
        const value = parseInt(e.target.value, 10);
        if (value <= 0) {
            setMaxCustomersError("Max customers must be greater than zero.");
        } else {
            setMaxCustomersError("");
        }
        setMaxCustomers(e.target.value);
    }

    // Submit function with all validations
    function sendData(e) {
        e.preventDefault();

        if (
            packageNameError || priceError || discountError || descriptionError ||
            termsAndConditionsError || durationError || maxCustomersError
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please correct the errors before submitting.',
                confirmButtonText: 'OK'
            });
            return; // Prevent submission if validation fails
        }

        const newPackage = {
            packageName,
            price: parseFloat(price),
            category,
            discount: parseFloat(discount),
            description,
            availability,
            duration: parseFloat(duration),
            maxCustomers: parseInt(maxCustomers, 10),
            termsAndConditions
        };

        axios.post("http://localhost:3001/package/add", newPackage)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    text: 'The package has been added successfully!',
                    confirmButtonText: 'OK'
                });

                // Reset form fields
                setPackageName("");
                setPrice("");
                setCategory("");
                setDiscount("");
                setDescription("");
                setAvailability(true);
                setDuration("");
                setMaxCustomers("");
                setTermsAndConditions("");
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
        <div className="d-flex align-items-center justify-content-center" 
        style={{ height: 'calc(100vh + 20px)', marginTop: '90px', overflow: 'hidden' }}>
       {/* Your content goes here */}

   
            <div className="row w-100">
                <div className="col-md-8 col-lg-6 mx-auto">
                    <div className="card border-5 shadow rounded-4 bg-light bg-opacity-75">
                        <div className="card-body p-4">
                            <h3 className="text-center mb-4 position-relative">
                                <i className="bi bi-plus-circle icon-color me-2"></i>Add New Package
                                <div className="title-underline"></div>
                            </h3>

                            <form onSubmit={sendData}>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="packageName" className="form-label">
                                            <i className="bi bi-tag icon-color me-2"></i>Package Name
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="packageName" 
                                            placeholder="Enter Package Name"
                                            value={packageName}
                                            onChange={handlePackageNameChange} 
                                            required
                                        />
                                        {packageNameError && (
                                            <div className="text-danger mt-1">{packageNameError}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="price" className="form-label">
                                            <i className="bi bi-cash icon-color me-2"></i>Price
                                        </label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id="price" 
                                            placeholder="Enter Price" 
                                            value={price}
                                            onChange={handlePriceChange} 
                                            required
                                        />
                                        {priceError && (
                                            <div className="text-danger mt-1">{priceError}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="category" className="form-label">
                                            <i className="bi bi-tags icon-color me-2"></i>Category
                                        </label>
                                        <select 
                                            className="form-select" 
                                            id="category"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Basic">Basic</option>
                                            <option value="Standard">Standard</option>
                                            <option value="Premium">Premium</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="discount" className="form-label">
                                            <i className="bi bi-percent icon-color me-2"></i>Discount
                                        </label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id="discount" 
                                            placeholder="Enter Discount" 
                                            value={discount}
                                            onChange={handleDiscountChange} 
                                            required
                                        />
                                        {discountError && (
                                            <div className="text-danger mt-1">{discountError}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="description" className="form-label">
                                            <i className="bi bi-file-text icon-color me-2"></i>Description
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="description" 
                                            placeholder="Enter Description" 
                                            value={description}
                                            onChange={handleDescriptionChange} 
                                            required
                                        />
                                        {descriptionError && (
                                            <div className="text-danger mt-1">{descriptionError}</div>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="duration" className="form-label">
                                            <i className="bi bi-clock icon-color me-2"></i>Duration (in hours)
                                        </label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id="duration" 
                                            placeholder="Enter Duration"
                                            value={duration}
                                            onChange={handleDurationChange} 
                                            required
                                        />
                                        {durationError && (
                                            <div className="text-danger mt-1">{durationError}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="maxCustomers" className="form-label">
                                            <i className="bi bi-people icon-color me-2"></i>Max Customers
                                        </label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id="maxCustomers" 
                                            placeholder="Enter Max Customers" 
                                            value={maxCustomers}
                                            onChange={handleMaxCustomersChange} 
                                            required
                                        />
                                        {maxCustomersError && (
                                            <div className="text-danger mt-1">{maxCustomersError}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="termsAndConditions" className="form-label">
                                            <i className="bi bi-file-earmark-text icon-color me-2"></i>Terms and Conditions
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="termsAndConditions" 
                                            placeholder="Enter Terms and Conditions"
                                            value={termsAndConditions}
                                            onChange={handleTermsAndConditionsChange} 
                                            required
                                        />
                                        {termsAndConditionsError && (
                                            <div className="text-danger mt-1">{termsAndConditionsError}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-check mb-3">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        checked={availability} 
                                        onChange={() => setAvailability(!availability)} 
                                        id="availability"
                                    />
                                    <label className="form-check-label" htmlFor="availability">
                                        Available
                                    </label>
                                </div>

                                <div className="text-center">
                                <div className="text-center" style={{ marginTop: '-10px' }}>
                                                           



                                <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '400px' }}>
    <button 
        type="submit" 
        className="w-100 py-2"
        style={{
            backgroundColor: '#28a745', // Bright green color
            backgroundImage: 'linear-gradient(to right, #28a745, #36d27c)', // Gradient effect
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '12px', // Slightly larger rounded corners
            boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.2)', // Slightly larger shadow
            border: 'none',
            transition: 'background-color 0.3s ease',
            width: '100%', // Full width within its container
            maxWidth: '200px' // Limits max width for better control
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#36d27c'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
    >
        Add Package
    </button>

    <button 
        type="button"
        className="w-100 py-2"
        style={{
            backgroundColor: '#dc3545', // Bright red color for the return button
            backgroundImage: 'linear-gradient(to right, #dc3545, #ff6b6b)', // Gradient effect
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '12px', // Slightly larger rounded corners
            boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.2)', // Slightly larger shadow
            border: 'none',
            transition: 'background-color 0.3s ease',
            width: '100%', // Full width within its container
            maxWidth: '200px', // Limits max width for better control
            marginLeft: '10px' // Adds space between the buttons
        }}
        onClick={() => window.location.href = '/view-packages'} // Adjust URL as needed
        onMouseOver={(e) => e.target.style.backgroundColor = '#ff6b6b'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
    >
        Return
    </button>
</div>


    
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
