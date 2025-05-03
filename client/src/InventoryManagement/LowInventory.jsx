import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Swal from "sweetalert2";

export default function LowInventory() {
  const [lowInventoryItems, setLowInventoryItems] = useState([]); // State to hold low inventory items
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    fetchLowInventoryItems(); // Fetch low inventory items when the component mounts
  }, []);

  const fetchLowInventoryItems = () => {
    axios
      .get("http://localhost:3001/inventory") // Fetch all users from the API
      .then((result) => {
        // Filter items where Quantity is less than or equal to Minimum Amount
        const lowItems = result.data.filter(
          (item) => item.Quantity <= item.MinimumAmount
        );
        setLowInventoryItems(lowItems); // Update state with low inventory items
        // Show alert if there are low inventory items
        if (lowItems.length > 0) {
          showLowInventoryAlert(lowItems);
        }
      })
      .catch((err) => console.log(err)); // Log any errors during the fetch
  };

  const showLowInventoryAlert = (items) => {
    // Create a comma-separated list of item names for the alert
    const itemNames = items.map((item) => item.ItemName).join(", ");

    // Display a SweetAlert notification
    Swal.fire({
      title: "Low Inventory Alert!",
      text: `The following items are at low inventory: ${itemNames}`,
      icon: "warning",
      confirmButtonText: "Okay",
      customClass: {
        confirmButton: "btn btn-primary", // Optional: Add custom classes for buttons
      },
    });
  };

  // Function to navigate back to inventory
  const handleBackToInventory = () => {
    navigate("/inventory"); // Use navigate to go back to the inventory page
  };

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{ backgroundColor: "transparent" }}
    >
      <div
        className="w-75 bg-white rounded p-4 shadow-lg"
        style={{ opacity: 0.9, borderRadius: "15px" }}
      >
        <h2 style={{ textAlign: "center", color: "#8B0000" }}>
          Low Inventory Items
        </h2>
        <table
          className="table table-striped"
          style={{ borderColor: "#8B0000" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#8B0000", color: "white" }}>
              <th>Item Name</th>
              <th>Item ID</th>
              <th>Quantity</th>
              <th>Minimum Amount</th>
            </tr>
          </thead>
          <tbody>
            {lowInventoryItems.map((item) => (
              <tr key={item._id}>
                <td>{item.ItemName}</td>
                <td>{item.ItemId}</td>
                <td>{item.Quantity}</td>
                <td>{item.MinimumAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handleBackToInventory}
          className="btn btn-primary"
          style={{ display: "block", margin: "0 auto", height: "auto" }} // Center the button
        >
          Back to Inventory
        </button>{" "}
        {/* Updated button */}
      </div>
    </div>
  );
}
