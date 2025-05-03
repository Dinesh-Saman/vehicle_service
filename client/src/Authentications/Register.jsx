// Register.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Swal from 'sweetalert2';

import logo from '../systemoperationmanagement/assets/Levaggio.png'; // Adjust the path as necessary
//import carImage1 from '../systemoperationmanagement/assets/crossroad-car-safari-scene.jpg'; // Image 1
import carImage2 from '../systemoperationmanagement/assets/bg1.jpg'; // Image 2
import carImage3 from '../systemoperationmanagement/assets/bg2.jpg'; // Image 2
import carImage4 from '../systemoperationmanagement/assets/bg5.jpg'; // Image 2
import carImage5 from '../systemoperationmanagement/assets/bg4.jpg'; // Image 2

const images = [ carImage2,carImage3,carImage4,carImage5];

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(images[0]);
  const navigate = useNavigate();

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % images.length;
      setBackgroundImage(images[index]);
    }, 5000); // Change image every 3 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const validateUsername = (username) => /^[A-Za-z\s]+$/.test(username);
  const validateEmail = (email) => /^[a-zA-Z][a-zA-Z0-9._%+-]*@gmail\.com$/.test(email);
  const validatePassword = (password) => password.length >= 5 && password.length <= 10;

  const handleUsernameChange = (e) => {
    const input = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setUsername(input);
    setUsernameError(!validateUsername(input) ? 'Username must only contain letters and spaces.' : '');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (usernameError || !validateEmail(email) || !validatePassword(password)) {
      Swal.fire('Error', 'Please fill in all fields correctly.', 'error');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        username,
        email,
        password,
        vehicleType,
      });
      Swal.fire('Success', 'Registration successful', 'success');
      navigate('/login');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Server error', 'error');
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center min-vh-100" 
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '90px 0', // Space between header and footer
      }}
    >
      <div className="card shadow-lg p-4 w-100 border-0" 
        style={{ 
          maxWidth: '400px',  // Minimized width
          borderRadius: '12px', 
          backgroundColor: '#ffffff90',
          transition: 'transform 0.3s ease',
          overflow: 'hidden', // Ensure no scroll bars
          marginTop:'10px'
        }}
      >
        <div className="text-center mb-4">
          <img 
            src={logo} 
            alt="Levaggio Logo" 
            className="img-fluid rounded-circle" 
            style={{ width: '80px', height: '80px', objectFit: 'cover', border: '2px solid #8B0000' }} 
          />
        </div>
        <h2 className="text-center mb-3" style={{ color: '#8B0000', fontWeight: 'bold', fontSize: '1.5rem' }}>
          Create an Account
        </h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label text-muted">Username</label>
            <input
              type="text"
              className="form-control border-danger rounded-pill"
              value={username}
              onChange={handleUsernameChange}
              required
              placeholder="Enter a username"
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            />
            {usernameError && <div className="text-danger">{usernameError}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Email</label>
            <input
              type="email"
              className="form-control border-danger rounded-pill"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@gmail.com"
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control border-danger rounded-pill"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="5-10 characters"
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Vehicle Type</label>
            <select
              className="form-select border-danger rounded-pill"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              required
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            >
              <option value="Car">Car</option>
              <option value="Van">Van</option>
              <option value="Suv">SUV</option>
              <option value="Truck">Truck</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-danger w-100 py-2 rounded-pill mb-3"
            style={{ backgroundColor: '#8B0000', borderColor: '#8B0000', fontWeight: 'bold', transition: 'background-color 0.3s ease' }}
          >
            Register
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-decoration-none" style={{ color: '#8B0000' }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
