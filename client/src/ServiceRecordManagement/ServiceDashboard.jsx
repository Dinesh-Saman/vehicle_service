import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from './assets/Carwash-Prague-czech-adriatech-13.jpg';

const ServiceDashboard = () => {
  return (
    <div
      style={{
        backgroundSize: "cover",
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
        minHeight: "100vh",
        padding: "4rem",
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", fontSize: "3rem",marginTop:"30px", marginBottom: "3rem", textShadow: "4px 4px 6px rgba(0, 0, 0, 0.8)" }}>
        Vehicle Service Station Dashboard
      </h1>

      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
        {/* Card Component */}
        {[
          { title: "Manage Services", description: "View, Add, and Update service records.", link: "/serviceRecords" },
          { title: "Service Reports", description: "Generate and download reports on vehicle services.", link: "/Servicereports" },
          { title: "Parts Usage", description: "View charts showing parts usage in services.", link: "/servicepartsusage" },
          { title: "QR Code Records", description: "Generate QR codes for service records.", link: "/serviceeqrCodes" },
        ].map((card, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              width: "300px",
              borderRadius: "20px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 6px 30px rgba(0, 0, 0, 0.4)",
              marginBottom: "30px",
              transition: "transform 0.3s",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h3 style={{ color: "#f7c08a", fontSize: "1.5rem", marginBottom: "20px" }}>{card.title}</h3>
            <p style={{ fontSize: "1rem", marginBottom: "20px" }}>{card.description}</p>
            <Link
              to={card.link}
              style={{
                backgroundColor: "#b3202e",
                color: "#fff",
                padding: "12px 25px",
                borderRadius: "10px",
                textDecoration: "none",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
                transition: "background-color 0.3s, box-shadow 0.3s",
                fontSize: "1rem",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#8c1c27";
                e.target.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.6)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#b3202e";
                e.target.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.5)";
              }}
            >
              Go to {card.title.split(" ")[0]}
            </Link>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
        <Link
          to="/SerDescription"
          style={{
            backgroundColor: "#b3202e",
            color: "#fff",
            padding: "12px 25px",
            borderRadius: "10px",
            textDecoration: "none",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
            transition: "background-color 0.3s, box-shadow 0.3s",
            fontSize: "1.2rem",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#8c1c27";
            e.target.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.6)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#b3202e";
            e.target.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.5)";
          }}
        >
          Service Details
        </Link>
      </div>
    </div>
  );
};

export default ServiceDashboard;
