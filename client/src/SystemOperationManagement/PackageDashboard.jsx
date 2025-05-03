import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import backgroundImage from './assets/cardash.jpg';
import axios from "axios";
import PeopleIcon from '@mui/icons-material/People'; // Import icon for users
import PackageIcon from '@mui/icons-material/Assignment'; // Import icon for packages
import AddIcon from '@mui/icons-material/AddCircle'; // Import icon for adding a package
import UpdateIcon from '@mui/icons-material/Update'; // Import icon for updating a package
import BookIcon from '@mui/icons-material/Book'; // Import icon for booking a package
import { Box, Typography } from "@mui/material"; // Import Box and Typography from Material-UI
import dashImage from '../systemoperationmanagement/assets/top-view-man-repairing-car.jpg';

const PackageDashboard = () => {
  const [packageCount, setPackageCount] = useState(0);
  const [userCount, setUserCount] = useState(0); // State to hold user count
  const [bookingCount, setBookingCount] = useState(0); // State to hold booking count

  useEffect(() => {
    fetchPackageCount();
    fetchUserCount();
    fetchBookingCount();
  }, []);

  const fetchPackageCount = async () => {
    try {
      const response = await axios.get("http://localhost:3001/package/");
      setPackageCount(response.data.length);
    } catch (error) {
      console.error("Error fetching package count:", error);
    }
  };

  const fetchUserCount = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:3001/api/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserCount(response.data.length);
    } catch (error) {
      console.error("Error fetching user count:", error);
      if (error.response && error.response.status === 401) {
        alert("Unauthorized access! Please log in.");
      }
    }
  };

  const fetchBookingCount = async () => {
    try {
      const storedReceipts = JSON.parse(localStorage.getItem('receipts')) || [];
      setBookingCount(storedReceipts.length);
    } catch (error) {
      console.error("Error fetching booking count:", error);
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center min-vh-100" 
      style={{
        backgroundImage: `url(${dashImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '90px 0', // Space between header and footer
      }}
    >
      <div
        style={{
          backgroundSize: "cover",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
          minHeight: "100vh",
          padding: "4rem",
          color: "#f0f0f0",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <h1 style={{ 
          textAlign: "center", 
          fontSize: "3.5rem", 
          marginTop: "30px", 
          marginBottom: "3rem", 
          textShadow: "3px 3px 8px rgba(0, 0, 0, 0.9)", 
          color: "#ffc857" 
        }}>
          Package & User Management Dashboard
        </h1>

        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
          {[ 
            { title: `All Packages ${packageCount}`, description: "All available packages.", link: "/view-packages", icon: <PackageIcon fontSize="large" /> },
            { title: `All Users ${userCount}`, description: "Manage users.", link: "/users2", icon: <PeopleIcon fontSize="large" /> },
            { title: `Booking Packages ${bookingCount}`, description: "View all booked packages.", link: "/receipt-table", icon: <BookIcon fontSize="large" /> },
            { title: "Add Package", description: "Create a new service package.", link: "/add-package", icon: <AddIcon fontSize="large" /> },
            { title: "Update Package", description: "Modify existing packages.", link: "/update-package/:id", icon: <UpdateIcon fontSize="large" /> },
          ].map((card, index) => (
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
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
                {card.icon}
              </Box>
              <Typography variant="h5" sx={{ color: "#ffc857", marginBottom: "10px" }}>
                {card.title}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: "20px", color: "#f7f7f7" }}>
                {card.description}
              </Typography>
              <Link
                to={card.link}
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
                Go to {card.title.split(" ")[0]}
              </Link>
            </Box>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackageDashboard;
