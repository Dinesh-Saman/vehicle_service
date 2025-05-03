// src/components/PackageHeader.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios for API calls
import 'bootstrap/dist/css/bootstrap.min.css';

const PackageHeader = () => {
  const [role, setRole] = useState('user'); // Default to "user"
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Example: Update role dynamically if needed
    setRole('admin'); // Set to 'admin' for admin view, or 'user' for user view
  }, []);

  const [showServicesDropdown, setShowServicesDropdown] = useState(false);

  const handleMouseEnter = () => setShowServicesDropdown(true);
  const handleMouseLeave = () => setShowServicesDropdown(false);

  const linkStyle = {
    fontSize: role === "user" ? '1.125rem' : '1rem',
    padding: role === "user" ? '0.75rem 1.5rem' : '0.5rem 1rem',
    marginRight: role === "user" ? '1.5rem' : '1rem',
  };

  const handleAddPackageClick = () => {
    if (role !== 'admin') {
      Swal.fire({
        title: 'Admin Access Required',
        text: 'Please log in to add a package. If you do not have an account, you can create one.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Register'
      }).then((result) => {
        if (result.isConfirmed) {
          showLoginPrompt();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          navigate('/admin-register'); // Redirect to registration page
        }
      });
    }
  };

  const showLoginPrompt = () => {
    Swal.fire({
      title: 'Admin Login',
      html: `
        <input id="email" class="swal2-input" placeholder="Email">
        <input id="password" type="password" class="swal2-input" placeholder="Password">
      `,
      confirmButtonText: 'Login',
      focusConfirm: false,
      preConfirm: () => {
        const email = Swal.getPopup().querySelector('#email').value;
        const password = Swal.getPopup().querySelector('#password').value;
        return { email: email, password: password };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        loginAdmin(result.value.email, result.value.password);
      }
    });
  };

  const loginAdmin = async (email, password) => {
    try {
      const response = await axios.post('/api/admin/login', { email, password });
      if (response.data.success) {
        setRole('admin');
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'You are now logged in as an admin.',
        }).then(() => {
          navigate('/add-package'); // Redirect to "Add Package" page
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid email or password.'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'An error occurred while trying to log in.'
      });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fs-4 fw-bold" to="/" style={{ color: '#3498db' }}>
          Levaggio
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 mb-lg-0 w-100 d-flex justify-content-center">
            <li className="nav-item">
              <Link className="nav-link text-dark fw-bold" to="/" aria-current="page" style={linkStyle}>
                Home
              </Link>
            </li>
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle text-dark fw-bold"
                to="/services"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={linkStyle}
              >
                Services
              </Link>
              {showServicesDropdown && (
                <ul className="dropdown-menu show" aria-labelledby="navbarDropdown">
                  <li><Link className="dropdown-item" to="/services/washing-packages">Washing Packages</Link></li>
                  <li><Link className="dropdown-item" to="/services/lubrication">Lubrication Services</Link></li>
                  <li><Link className="dropdown-item" to="/services/treatment">Treatment Services</Link></li>
                </ul>
              )}
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-bold" to="/all-packages" style={linkStyle}>Packages</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-bold" to="/about" style={linkStyle}>About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-bold" to="/gallery" style={linkStyle}>FeedBacks</Link>
            </li>

            {/* Conditionally show "Add Package" and "Package-List" for admin */}
            {role === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-dark fw-bold" to="/add-package" onClick={handleAddPackageClick} style={linkStyle}>Add Package</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark fw-bold" to="/view-packages" style={linkStyle}>Package-List</Link>
                </li>
              </>
            )}

            <li className="nav-item">
              <Link className="nav-link text-dark fw-bold" to="/login" style={linkStyle}>Sign In</Link>
            </li>
          </ul>

          {/* Search form */}
          <form className="d-flex ms-auto">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default PackageHeader;