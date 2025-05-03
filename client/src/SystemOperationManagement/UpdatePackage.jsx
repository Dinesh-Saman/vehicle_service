import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import Swal from 'sweetalert2'; // Import SweetAlert2
import './Pages/styles/UpdatePackage.css'; // Import custom CSS

const UpdatePackage = () => {
    const { id } = useParams();  // Get the package ID from the URL
    const navigate = useNavigate();
    const [pkg, setPkg] = useState({
        packageName: "",
        price: "",
        category: "",
        discount: "",
        description: "",
        availability: true, // Default value as true
        duration: "",
        maxCustomers: "",
        termsAndConditions: ""
    });

    const [loading, setLoading] = useState(false);  // State to handle loading spinner
    const [errors, setErrors] = useState({});

    // Fetch the package data when the component loads
    useEffect(() => {
        fetchPackageData();
    }, [id]);

    const fetchPackageData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3001/package/get/${id}`);
            setPkg(response.data.pkg);  // Update the state with the fetched data
        } catch (error) {
            console.error('Error fetching package data:', error);
        } finally {
            setLoading(false);
        }
    };

    const validateFields = () => {
        let tempErrors = {};
        // Validation logic for each field
        if (!pkg.packageName.match(/^[A-Za-z\s]+$/)) {
            tempErrors.packageName = "Package name should only contain letters.";
        }
        if (pkg.price <= 0) {
            tempErrors.price = "Price must be greater than zero.";
        }
        if (pkg.discount < 1 || pkg.discount > 100) {
            tempErrors.discount = "Discount must be between 1 and 100.";
        }
        if (!pkg.description.match(/^[A-Za-z\s]+$/)) {
            tempErrors.description = "Description should only contain letters.";
        }
        if (pkg.duration <= 0) {
            tempErrors.duration = "Duration must be greater than zero.";
        }
        if (pkg.maxCustomers <= 0) {
            tempErrors.maxCustomers = "Max customers must be greater than zero.";
        }
        if (!pkg.termsAndConditions.match(/^[A-Za-z\s]+$/)) {
            tempErrors.termsAndConditions = "Terms and Conditions should only contain letters.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;  // Return true if no errors
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPkg({ ...pkg, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!validateFields()) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please correct the errors in the form before submitting!',
            });
            return;
        }

        setLoading(true);
        try {
            await axios.put(`http://localhost:3001/package/update/${id}`, pkg);

            Swal.fire({
                icon: 'success',
                title: ' Package Updated Successfully!',
                text: 'The package has been updated.',
                confirmButtonText: 'OK',
                backdrop: `
                    rgba(0,0,123,0.4)
                    url("https://i.gifer.com/origin/5d/5d6ae5c25d1cfedcf8a5b2fef0c77b8f.gif")
                    left top
                    no-repeat
                `,
                customClass: {
                    popup: 'border-radius-15'
                }
            });

            setTimeout(() => {
                navigate("/all-packages");
            }, 2000);
        } catch (error) {
            console.error('Error updating package:', error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'An error occurred while updating the package!',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center" 
        style={{ height: 'calc(100vh + 20px)', marginTop: '90px', overflow: 'hidden' }}>
       {/* Your content goes here */}

   
            {loading ? (
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            ) : (
                <div className="row w-100">
                    <div className="col-md-8 col-lg-6 mx-auto">
                        <div className="card border-5 shadow rounded-4 bg-light bg-opacity-75">
                            <div className="card-body p-4">
                                <h3 className="text-center mb-4 position-relative">
                                    <i className="bi bi-pencil-square icon-color me-2"></i>Update Package
                                    <div className="title-underline"></div>
                                </h3>

                                <form onSubmit={handleUpdate}>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="packageName" className="form-label">
                                                <i className="bi bi-tag icon-color me-2"></i>Package Name
                                            </label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="packageName" 
                                                name="packageName"
                                                value={pkg.packageName}
                                                onChange={handleInputChange} 
                                                required
                                            />
                                            {errors.packageName && (
                                                <div className="text-danger mt-1">{errors.packageName}</div>
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
                                                name="price"
                                                value={pkg.price}
                                                onChange={handleInputChange} 
                                                required
                                            />
                                            {errors.price && (
                                                <div className="text-danger mt-1">{errors.price}</div>
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
                                                name="category"
                                                value={pkg.category}
                                                onChange={handleInputChange}
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
                                                name="discount"
                                                value={pkg.discount}
                                                onChange={handleInputChange} 
                                                required
                                            />
                                            {errors.discount && (
                                                <div className="text-danger mt-1">{errors.discount}</div>
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
                                                name="description"
                                                value={pkg.description}
                                                onChange={handleInputChange} 
                                                required
                                            />
                                            {errors.description && (
                                                <div className="text-danger mt-1">{errors.description}</div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="availability" className="form-label">
                                                <i className="bi bi-check-circle icon-color me-2"></i>Availability
                                            </label>
                                            <select 
                                                className="form-select" 
                                                id="availability"
                                                name="availability"
                                                value={pkg.availability}
                                                onChange={(e) => handleInputChange({ target: { name: 'availability', value: e.target.value === 'true' }})}
                                                required
                                            >
                                                <option value="true">Available</option>
                                                <option value="false">Not Available</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="duration" className="form-label">
                                                <i className="bi bi-clock icon-color me-2"></i>Duration (days)
                                            </label>
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                id="duration" 
                                                name="duration"
                                                value={pkg.duration}
                                                onChange={handleInputChange} 
                                                required
                                            />
                                            {errors.duration && (
                                                <div className="text-danger mt-1">{errors.duration}</div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="maxCustomers" className="form-label">
                                                <i className="bi bi-person-circle icon-color me-2"></i>Max Customers
                                            </label>
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                id="maxCustomers" 
                                                name="maxCustomers"
                                                value={pkg.maxCustomers}
                                                onChange={handleInputChange} 
                                                required
                                            />
                                            {errors.maxCustomers && (
                                                <div className="text-danger mt-1">{errors.maxCustomers}</div>
                                            )}
                                        </div>
                                    </div>

                                   

                                    <div className="text-center">
                                        <button 
                                            type="submit" 
                                            className="btn btn-success btn-lg"
                                            style={{ backgroundColor: '#28a745' }} // Custom color
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdatePackage;
