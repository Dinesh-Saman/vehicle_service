import React, { useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

const DeletePackage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3001/package/delete/${id}`);
            console.log("Package deleted successfully.");
            navigate("/"); // Navigate to the homepage or any relevant route after successful deletion
            window.alert("Package record deleted successfully."); // Display alert
        } catch (error) {
            console.error('Error deleting package:', error);
        }
    };

    console.log("ID:", id); // Log the ID to check if it's correctly received

    return (
        <div className="container mt-5">
            <h2>Delete Package</h2>
            <p>Are you sure you want to delete this package?</p>
            <button className="btn btn-danger me-2" onClick={handleDelete}>Yes, Delete</button>
            <Link to="/" className="btn btn-secondary">Cancel</Link>
        </div>
    );
};

export default DeletePackage;
