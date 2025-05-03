import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Swal from "sweetalert2";
import { FaSignInAlt, FaUserShield, FaUser } from "react-icons/fa";
import carImage from "../systemoperationmanagement/assets/levaggio.png";
import backgroundImage from "../systemoperationmanagement/assets/bg4.jpg";

const admins = [
  {
    name: "System Operation Manager",
    password: "pasindu",
    redirectTo: "/packageDashboard",
  },
  { name: "Supplier Manager", password: "senura", redirectTo: "/sdashboard" },
  { name: "Employee Manager", password: "vihanga", redirectTo: "/dashboard" },
  {
    name: "Service Record Manager",
    password: "imal",
    redirectTo: "/serviceDashboard",
  },
  {
    name: "Trainee Coordinator",
    password: "manthi",
    redirectTo: "/Tdashboard",
  },
  {
    name: "Customer Affairs Manager",
    password: "amanda",
    redirectTo: "/ManagerDashboard",
  },
  { name: "Appointment Manager", password: "imal", redirectTo: "/AppTable" },
  {
    name: "Inventory Manager",
    password: "senura",
    redirectTo: "/inventoryDashboard",
  },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isAdmin) {
      const admin = admins.find((admin) => admin.name === selectedAdmin);
      if (admin) {
        if (password !== admin.password) {
          Swal.fire("Error", "Incorrect admin password", "error");
          setLoading(false);
          return;
        }
        navigate(admin.redirectTo);
        setLoading(false);
        return;
      } else {
        Swal.fire("Error", "Please select an admin", "error");
        setLoading(false);
        return;
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/auth/login",
          { email, password }
        );
        const { token, userId } = response.data;

        localStorage.setItem("authToken", token);
        Swal.fire({
          title: "Success",
          text: "Login successful",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate(`/profile/${userId}`);
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: err.response?.data?.message || "Server error",
          icon: "error",
          confirmButtonColor: "#8B0000",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="card shadow-lg p-4 w-100 border-0"
        style={{
          maxWidth: "450px",
          borderRadius: "15px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(5px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          marginTop: "40px",
          marginBottom:'40px'
        }}
      >
        <div className="text-center mb-4">
          <img
            src={carImage}
            alt="Levaggio"
            style={{ 
              width: "120px", 
              borderRadius: "25%",
              border: "3px solid #8B0000",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
            }}
          />
          <h1
            className="mt-3"
            style={{
              color: "#8B0000",
              fontWeight: "bold",
              fontSize: "2.5rem",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Levaggio
          </h1>
          <h2 
            className="mb-4" 
            style={{ 
              color: "#333",
              fontWeight: "600",
              fontSize: "1.5rem",
            }}
          >
            Welcome Back
          </h2>
        </div>
        
        <form onSubmit={handleLogin}>
          {!isAdmin ? (
            <>
              <div className="mb-4">
                <label className="form-label fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent">
                    <i className="bi bi-envelope-fill text-muted"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={{
                      borderLeft: "none",
                      borderRadius: "0.375rem",
                    }}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent">
                    <i className="bi bi-lock-fill text-muted"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    style={{
                      borderLeft: "none",
                      borderRadius: "0.375rem",
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="form-label fw-semibold">Admin Role</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent">
                    <FaUserShield className="text-muted" />
                  </span>
                  <select
                    className="form-select"
                    value={selectedAdmin}
                    onChange={(e) => setSelectedAdmin(e.target.value)}
                    required
                  >
                    <option value="">Select admin role...</option>
                    {admins.map((admin, index) => (
                      <option key={index} value={admin.name}>
                        {admin.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-semibold">Admin Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent">
                    <i className="bi bi-key-fill text-muted"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    style={{
                      borderLeft: "none",
                      borderRadius: "0.375rem",
                    }}
                  />
                </div>
              </div>
            </>
          )}
          
          <div className="mb-4 form-check d-flex align-items-center">
            <input
              type="checkbox"
              className="form-check-input me-2"
              id="isAdmin"
              checked={isAdmin}
              onChange={() => {
                setIsAdmin(!isAdmin);
                setSelectedAdmin("");
                setEmail("");
                setPassword("");
              }}
              style={{
                width: "1.2em",
                height: "1.2em",
                cursor: "pointer",
              }}
            />
            <label 
              className="form-check-label fw-medium" 
              htmlFor="isAdmin"
              style={{ cursor: "pointer" }}
            >
              {isAdmin ? (
                <span className="d-flex align-items-center">
                  <FaUser className="me-2" /> Switch to User Login
                </span>
              ) : (
                <span className="d-flex align-items-center">
                  <FaUserShield className="me-2" /> Login as Admin
                </span>
              )}
            </label>
          </div>
          
          <button
            type="submit"
            className="btn w-100 py-2 fw-bold"
            style={{
              backgroundColor: "#8B0000",
              color: "#fff",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              border: "none",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            disabled={loading}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#6B0000";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.15)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#8B0000";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
            }}
          >
            {loading ? (
              <div className="d-flex justify-content-center align-items-center">
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Authenticating...
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center">
                <FaSignInAlt className="me-2" />
                {isAdmin ? "Admin Login" : "User Login"}
              </div>
            )}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-muted mb-0">
            Don't have an account?{" "}
            <a 
              href="/register" 
              style={{
                color: "#8B0000",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Register here
            </a>
          </p>
          <p className="text-muted mt-2">
            <a 
              href="/forgot-password" 
              style={{
                color: "#8B0000",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Forgot password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;