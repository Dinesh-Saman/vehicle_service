import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const SupplierDashboard = () => {
  const cards = [
    {
      title: "Add Supplier",
      description: "Add new supplier details.",
      link: "/supplier/add",
    },
    {
      title: "All Suppliers",
      description: "View and manage all suppliers.",
      link: "/supplier/all",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "50px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "3rem",
          marginBottom: "3rem",
          color: "#fff",
          textShadow: "4px 4px 6px rgba(0, 0, 0, 0.8)",
        }}
      >
        Supplier Manage Dashboard
      </h1>

      <div
        className="d-flex justify-content-around flex-wrap"
        style={{ gap: "20px" }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className="card text-center m-3"
            style={{
              width: "20rem",
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              boxShadow: "0 6px 30px rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              transition: "transform 0.3s, box-shadow 0.3s",
              padding: "20px",
            }}
          >
            <div className="card-body">
              <h3
                className="card-title"
                style={{ marginBottom: "20px", color: "#f7c08a" }}
              >
                {card.title}
              </h3>
              <p className="card-text" style={{ marginBottom: "20px" }}>
                {card.description}
              </p>
              <Link
                to={card.link}
                className="btn"
                style={{
                  backgroundColor: "#b3202e",
                  color: "#fff",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontSize: "1rem",
                  padding: "10px 20px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
                  transition: "background-color 0.3s, box-shadow 0.3s",
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierDashboard;
