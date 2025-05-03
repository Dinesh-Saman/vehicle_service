import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom"; // Added Link for navigation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTachometerAlt,
  faUser,
  faBoxes,
  faCog,
  faSignOutAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"; // Import icons

const SidebarWrapper = ({ children }) => {
  const location = useLocation(); // Get the current route
  const [isSidebarVisible, setSidebarVisible] = useState(false); // State for sidebar visibility

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  // Only show the sidebar on specific routes
  const shouldShowSidebar =
    location.pathname === "/view-packages" ||
    location.pathname === "/add-package" ||
    location.pathname.startsWith("/update-package/") ||
    location.pathname === "/users";

  return (
    <div style={{ display: "flex", position: "relative", minHeight: "100vh" }}>
      {shouldShowSidebar && (
        <>
          {/* Toggle Menu Icon */}
          {!isSidebarVisible && (
            <div
              className="menu-icon"
              style={{
                cursor: "pointer",
                padding: "15px",
                position: "fixed",
                top: "100px",
                left: "25px",
                zIndex: 1000,
                color: "#fff",
              }}
              onClick={toggleSidebar}
            >
              <FontAwesomeIcon icon={faBars} size="lg" />
            </div>
          )}

          {/* Sidebar */}
          {isSidebarVisible && (
            <div
              className="dashboard"
              style={{
                position: "fixed",
                top: "100px", // Moved down the sidebar container
                left: "0",
                width: "250px",
                backgroundColor: "rgba(255, 255, 255, 0.9)", // Light background with transparency
                borderRight: "2px solid #dee2e6",
                display: "flex",
                flexDirection: "column",
                height: "calc(100% - 100px)", // Adjust height according to the new top
                zIndex: 999,
                transition: "transform 0.3s ease-in-out",
              }}
            >
              {/* Close icon */}
              <button
                onClick={toggleSidebar}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "10px",
                  alignSelf: "flex-end",
                  fontSize: "1.5rem",
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>

              {/* Sidebar content */}
              <h4
                className="text-center p-3 bg-dark text-white"
                style={{ margin: "0", paddingTop: "10px" }}
              >
                Dashboard
              </h4>

              <Link to="/dashboard" style={{ textDecoration: "none" }}>
                <div
                  className="sidebar-item"
                  style={{
                    borderBottom: "1px solid #dee2e6",
                    padding: "25px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faTachometerAlt} size="lg" />
                  <span className="ms-2">OBD Scanner</span>
                </div>
              </Link>

              <Link to="/users" style={{ textDecoration: "none" }}>
                <div
                  className="sidebar-item"
                  style={{
                    borderBottom: "1px solid #dee2e6",
                    padding: "30px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faUser} size="lg" />
                  <span className="ms-2">Users</span>
                </div>
              </Link>

              <Link to="/view-packages" style={{ textDecoration: "none" }}>
                <div
                  className="sidebar-item"
                  style={{
                    borderBottom: "1px solid #dee2e6",
                    padding: "30px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faBoxes} size="lg" />
                  <span className="ms-2">Packages</span>
                </div>
              </Link>

              <div
                className="sidebar-item"
                style={{
                  borderBottom: "1px solid #dee2e6",
                  padding: "30px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon icon={faCog} size="lg" />
                <span className="ms-2">Settings</span>
              </div>
              <Link to="/" style={{ textDecoration: "none" }}>
                <div
                  className="sidebar-item"
                  style={{
                    padding: "30px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
                  <span className="ms-2">Sign Out</span>
                </div>
              </Link>
            </div>
          )}
        </>
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          paddingLeft: isSidebarVisible ? "310px" : "0px",
          paddingTop: "20px",
          transition: "padding-left 0.3s ease",
        }}
      >
        {children} {/* This will render your main app content */}
      </div>
    </div>
  );
};

export default SidebarWrapper;
