import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const InventorySummary = () => {
  const [summary, setSummary] = useState({
    totalItems: 0,
    outOfStockItems: 0,
    outOfStockItemNames: [],
    mostUsedItems: [],
  });

  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    // Fetch inventory data for summary
    axios.get('http://localhost:3001/inventory')
      .then((response) => {
        const items = response.data;
        const totalItems = items.length;

        // Calculate out of stock items and their names
        const outOfStockItems = items.filter(item => item.Quantity === 0);
        const outOfStockItemNames = outOfStockItems.map(item => item.ItemName); // Get names of out of stock items

        // Filter and sort most used items with quantity greater than 10
        const mostUsedItems = items
          .filter(item => item.Quantity > 10) // Only include items with Quantity > 10
          .sort((a, b) => b.Quantity - a.Quantity) // Sort by quantity in descending order
          .slice(0, 5); // Take the top 5 most used items

        setSummary({
          totalItems,
          outOfStockItems: outOfStockItems.length,
          outOfStockItemNames,
          mostUsedItems
        });
      })
      .catch(err => console.error(err));
  }, []);

  const cardData = [
    { title: "Total Items", value: summary.totalItems },
    { title: "Out of Stock", value: summary.outOfStockItems > 0 
        ? summary.outOfStockItemNames.join(', ') 
        : "No out of stock items" }, // Show names of out of stock items
    { title: "Most Used Items", value: summary.mostUsedItems.length > 0 
        ? summary.mostUsedItems.map(item => `${item.ItemName} - ${item.Quantity}`).join(', ') 
        : "No items with quantity > 10" }, // Handle case when no items qualify
  ];

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '90px 0',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div style={{ padding: '4rem', color: '#f0f0f0', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: "3rem", 
          marginBottom: "3rem", 
          textShadow: "3px 3px 8px rgba(0, 0, 0, 0.9)", 
          color: "#ffc857" 
        }}>
          Inventory Summary
        </h1>

        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
          {cardData.map((card, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                width: "320px",
                borderRadius: "20px",
                padding: "25px",
                textAlign: "center",
                boxShadow: "0 8px 40px rgba(0, 0, 0, 0.6)",
                marginBottom: "30px",
                transition: "transform 0.3s",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Typography variant="h5" sx={{ color: "#ffc857", marginBottom: "10px" }}>
                {card.title}
              </Typography>
              <Typography variant="body1" sx={{ color: "#f7f7f7" }}>
                {card.value}
              </Typography>
            </Box>
          ))}
        </div>

        {/* Back Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/inventoryDashboard')} // Navigate to the inventory dashboard
          sx={{ marginTop: "20px", borderRadius: "10px", padding: "10px 20px" }}
        >
          Back to Inventory Dashboard
        </Button>
      </div>
    </div>
  );
};

export default InventorySummary;
