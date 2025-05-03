import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import Swal from 'sweetalert2'; // Import SweetAlert2

const UpdateSupplier = () => {
    const { id } = useParams();  // Get the supplier ID from the URL
    const navigate = useNavigate();
    const [supplier, setSupplier] = useState({
        supplierName: "",
        contactPerson: "",
        phoneNumber: "",
        address: "",
        partsRequired: "",
        quantity: "",
        additionalNote: ""
    });

    const [loading, setLoading] = useState(false);  // State to handle loading spinner
    const [errors, setErrors] = useState({});

    // Fetch the supplier data when the component loads
    useEffect(() => {
        fetchSupplierData();
    }, [id]);

    const fetchSupplierData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3001/supplier/get/${id}`);
            setSupplier(response.data.supplier);  // Update the state with the fetched data
        } catch (error) {
            console.error('Error fetching supplier data:', error);
        } finally {
            setLoading(false);
        }
    };

    const validateFields = () => {
        let tempErrors = {};
        // Validation logic for each field
        if (!supplier.supplierName.match(/^[A-Za-z\s]+$/)) {
            tempErrors.supplierName = "Supplier name should only contain letters.";
        }
        if (!supplier.contactPerson.match(/^[A-Za-z\s]+$/)) {
            tempErrors.contactPerson = "Contact person name should only contain letters.";
        }
        if (!/^\d+$/.test(supplier.phoneNumber)) {
            tempErrors.phoneNumber = "Phone number should only contain digits.";
        }
        if (!supplier.address) {
            tempErrors.address = "Address is required.";
        }
        if (!supplier.partsRequired.match(/^[A-Za-z\s,]+$/)) {
            tempErrors.partsRequired = "Parts required should only contain letters and commas.";
        }
        if (supplier.quantity <= 0) {
            tempErrors.quantity = "Quantity must be greater than zero.";
        }
        if (supplier.additionalNote && !supplier.additionalNote.match(/^[A-Za-z\s,.]+$/)) {
            tempErrors.additionalNote = "Additional note should only contain letters, commas, and periods.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;  // Return true if no errors
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSupplier({ ...supplier, [name]: value });
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
            await axios.put(`http://localhost:3001/supplier/update/${id}`, supplier);

            Swal.fire({
                icon: 'success',
                title: ' Supplier Updated Successfully!',
                text: 'The supplier has been updated.',
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
                navigate("/supplier/all");
            }, 2000);
        } catch (error) {
            console.error('Error updating supplier:', error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'An error occurred while updating the supplier!',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100" style={{ marginTop: '90px' }}>
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
                                    <i className="bi bi-pencil-square icon-color me-2"></i>Update Supplier
                                    <div className="title-underline"></div>
                                </h3>

                                <form onSubmit={handleUpdate}>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="supplierName" className="form-label">
                                                <i className="bi bi-person icon-color me-2"></i>Supplier Name
                                            </label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="supplierName" 
                                                name="supplierName"
                                                value={supplier.supplierName}
                                                onChange={handleInputChange} 
                                                required
                                            />
                                            {errors.supplierName && (
                                                <div className="text-danger mt-1">{errors.supplierName}</div>
                                            )}
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="contactPerson" className="form-label">
                                                <i className="bi bi-person-circle icon-color me-2"></i>Contact Person
                                            </label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="contactPerson" 
                                                name="contactPerson"
                                                value={supplier.contactPerson}
                                                onChange={handleInputChange} 
                                                required
                                            />
                                            {errors.contactPerson && (
                                                <div className="text-danger mt-1">{errors.contactPerson}</div>
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
                                                name="phoneNumber"
                                                value={supplier.phoneNumber}
                                                onChange={handleInputChange} 
                                                required
                                            />
                                            {errors.phoneNumber && (
                                                <div className="text-danger mt-1">{errors.phoneNumber}</div>
                                            )}
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="address" className="form-label">
                                                <i className="bi bi-house-door icon-color me-2"></i>Address
                                            </label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="address" 
                                                name="address"
                                                value={supplier.address}
                                                onChange={handleInputChange} 
                                                required
                                            />
                                            {errors.address && (
                                                <div className="text-danger mt-1">{errors.address}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                    <div className="col-md-6">
    <label htmlFor="partsRequired" className="form-label">
        <i className="bi bi-tools icon-color me-2"></i>Parts Required
    </label>
    <select 
        className="form-select" 
        id="partsRequired" 
        name="partsRequired"
        value={supplier.partsRequired}
        onChange={handleInputChange} 
        required
    >
      <option value="">Select Part</option>
<option value="Brakes">Brakes</option>
<option value="Engine Oil">Engine Oil</option>
<option value="Suspension">Suspension</option>
<option value="Tires">Tires</option>
<option value="Battery">Battery</option>
<option value="Transmission Fluid">Transmission Fluid</option>
<option value="Air Filter">Air Filter</option>
<option value="Brake Fluid">Brake Fluid</option>
<option value="Radiator">Radiator</option>
<option value="Fuel Filter">Fuel Filter</option>
<option value="Clutch">Clutch</option>
<option value="Alternator">Alternator</option>
<option value="Exhaust System">Exhaust System</option>
<option value="Spark Plugs">Spark Plugs</option>
<option value="Power Steering Fluid">Power Steering Fluid</option>
<option value="Timing Belt">Timing Belt</option>
<option value="Water Pump">Water Pump</option>
<option value="Wiper Blades">Wiper Blades</option>

    </select>
    {errors.partsRequired && (
        <div className="text-danger mt-1">{errors.partsRequired}</div>
    )}
</div>


                                        <div className="col-md-6">
                                            <label htmlFor="quantity" className="form-label">
                                                <i className="bi bi-box icon-color me-2"></i>Quantity
                                            </label>
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                id="quantity" 
                                                name="quantity"
                                                value={supplier.quantity}
                                                onChange={handleInputChange} 
                                                required
                                            />
                                            {errors.quantity && (
                                                <div className="text-danger mt-1">{errors.quantity}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="additionalNote" className="form-label">
                                            <i className="bi bi-pencil icon-color me-2"></i>Additional Note
                                        </label>
                                        <textarea 
                                            className="form-control" 
                                            id="additionalNote" 
                                            name="additionalNote"
                                            value={supplier.additionalNote}
                                            onChange={handleInputChange} 
                                        />
                                        {errors.additionalNote && (
                                            <div className="text-danger mt-1">{errors.additionalNote}</div>
                                        )}
                                    </div>

                                    <button type="submit" className="btn btn-primary w-35 mb-2">
                                        Update Supplier
                                    </button>
                                    <button type="button" className="btn btn-secondary" style={{ width: '200px' }} onClick={() => navigate("/supplier/all")}>  Back to All Suppliers</button>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateSupplier;
