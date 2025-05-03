import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const PackageHeader = () => {
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  useEffect(() => {
    setRole('user');
  }, []);

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
          navigate('/admin-register');
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
          navigate('/add-package');
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
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fs-4 fw-bold me-4" to="/" style={{ color: '#3498db' }}>
          Levaggio
        </Link>

        <div className="d-flex align-items-center w-100">
          <ul className="navbar-nav flex-row flex-grow-1">
            <li className="nav-item me-3">
              <Link className="nav-link text-dark" to="/">Home</Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link text-dark" to="/SerDescription">Services</Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link text-dark" to="/all-packages">Packages</Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link text-dark" to="/AboutUs">About Us</Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link text-dark" to="/feedbackDashboard/allFeed">FeedBacks</Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link text-dark" to="/login">Sign In</Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link text-dark" to="/register">Register</Link>
            </li>
          </ul>

          <form className="d-flex ms-auto">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              style={{ width: '200px' }}
            />
          </form>
        </div>
      </div>
    </nav>
  );
};

export default PackageHeader;