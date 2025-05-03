import React from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

const DeleteSupplier = () => {
    const { id } = useParams();  // Get the supplier ID from the URL
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3001/supplier/delete/${id}`); // Send DELETE request to server
            console.log("Supplier deleted successfully.");
            navigate("/"); // Navigate to the homepage or any relevant route after successful deletion
            window.alert("Supplier record deleted successfully."); // Display alert
        } catch (error) {
            console.error('Error deleting supplier:', error);
            window.alert("An error occurred while deleting the supplier."); // Display error alert
        }
    };

    console.log("ID:", id); // Log the ID to check if it's correctly received

    return (
        <div className="container mt-5">
            <h2>Delete Supplier</h2>
            <p>Are you sure you want to delete this supplier?</p>
            <button className="btn btn-danger me-2" onClick={handleDelete}>Yes, Delete</button>
            <Link to="/" className="btn btn-secondary">Cancel</Link>
        </div>
    );
};

export default DeleteSupplier;
