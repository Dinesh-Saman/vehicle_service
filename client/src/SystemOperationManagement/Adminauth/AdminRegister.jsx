// src/components/AdminRegister.js

import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jobCategory, setJobCategory] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/admin/register', {
        name,
        email,
        password,
        jobCategory,
        appointmentDate
      });
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Admin account has been created successfully.',
        }).then(() => {
          navigate('/admin-login'); // Redirect to login page after registration
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: response.data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'An error occurred while trying to register.',
      });
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Registration</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="jobCategory" className="form-label">Job Category</label>
          <input
            type="text"
            className="form-control"
            id="jobCategory"
            value={jobCategory}
            onChange={(e) => setJobCategory(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="appointmentDate" className="form-label">Appointment Date</label>
          <input
            type="date"
            className="form-control"
            id="appointmentDate"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default AdminRegister;
