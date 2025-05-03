// src/PartDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './PartDetails.css'; // You can create a CSS file for styling

function PartDetails() {
  const [partDetails, setPartDetails] = useState(null);
  const { state } = useLocation(); // Get the passed state from the navigation

  useEffect(() => {
    if (state && state.part) {
      // Fetch part details based on the part name received
      axios
        .get(`http://localhost:3001/Parts/${state.part}`)
        .then((response) => {
          setPartDetails(response.data);
        })
        .catch((error) => {
          toast.error("Failed to fetch part details.");
        });
    }
  }, [state]);

  if (!partDetails) {
    return <div>Loading...</div>; // Optionally show a loading state
  }

  return (
    <div className="part-details-container">
      <h2>Part Details</h2>
      <h3>{partDetails.name}</h3>
      <p><strong>Description:</strong> {partDetails.description}</p>
      <p><strong>Manufacturer:</strong> {partDetails.manufacturer}</p>
      <p><strong>Price:</strong> Rs. {partDetails.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
      <ToastContainer />
    </div>
  );
}

export default PartDetails;
