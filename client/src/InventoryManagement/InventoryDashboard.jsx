// src/InventoryDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material'; // Import Box and Typography from Material-UI
import InventoryIcon from '@mui/icons-material/Inventory'; // Import icon for inventory
import AddIcon from '@mui/icons-material/Add'; // Import icon for adding item
import AlertIcon from '@mui/icons-material/Warning'; // Import icon for low inventory
import SummaryIcon from '@mui/icons-material/Assessment'; // Import icon for summary
import dashImage from '../systemoperationmanagement/assets/top-view-man-repairing-car.jpg'; // Background image

const InventoryDashboard = () => {
  return (
    <div 
      style={{
        backgroundImage: `url(${dashImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '90px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          padding: "4rem",
          color: "#f0f0f0",
          fontFamily: "'Poppins', sans-serif",
          borderRadius: "20px",
          boxShadow: "0 8px 40px rgba(0, 0, 0, 0.6)",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1 style={{ 
          textAlign: "center", 
          fontSize: "3.5rem", 
          marginBottom: "3rem", 
          color: "#ffc857" 
        }}>
          Inventory Manager Dashboard
        </h1>

        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: '30px' }}>
          <Card title="Inventory" link="/inventory" icon={<InventoryIcon fontSize="large" />} />
          <Card title="Add Item" link="/inventorycreate" icon={<AddIcon fontSize="large" />} />
          <Card title="Low Inventory" link="/low-inventory" icon={<AlertIcon fontSize="large" />} />
          <Card title="Summary" link="/summary" icon={<SummaryIcon fontSize="large" />} />
        </div>
      </div>
    </div>
  );
};

// Reusable Card component
const Card = ({ title, link, icon }) => {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        width: "320px",
        borderRadius: "20px",
        padding: "25px",
        textAlign: "center",
        boxShadow: "0 8px 40px rgba(0, 0, 0, 0.6)",
        transition: "transform 0.3s",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
        {icon}
      </Box>
      <Typography variant="h5" sx={{ color: "#ffc857", marginBottom: "10px" }}>
        {title}
      </Typography>
      <Link
        to={link}
        style={{
          backgroundColor: "#348aa7",
          color: "#fff",
          padding: "14px 30px",
          borderRadius: "10px",
          textDecoration: "none",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.6)",
          transition: "background-color 0.3s, box-shadow 0.3s",
          fontSize: "1rem",
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#2b6b7f";
          e.target.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.7)";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#348aa7";
          e.target.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.6)";
        }}
      >
        Go to {title}
      </Link>
    </Box>
  );
};

export default InventoryDashboard;
