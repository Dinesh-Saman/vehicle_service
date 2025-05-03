import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
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
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate('/admin-login');
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
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        backgroundImage:
          'url("https://img.freepik.com/premium-photo/modern-car-repair-station-with-large-number-lifts-specialized-equipment-diagnostics-service-repair-car_283617-3978.jpg?w=996")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '20px',
      }}
    >
      <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '600px', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <div className="card-body p-4">
          <h3 className="card-title text-center mb-4 text-primary fw-bold">Admin Registration</h3>
          <form onSubmit={handleRegister}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingName"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label htmlFor="floatingName">Name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingEmail"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="floatingEmail">Email address</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingJobCategory"
                placeholder="Job Category"
                value={jobCategory}
                onChange={(e) => setJobCategory(e.target.value)}
                required
              />
              <label htmlFor="floatingJobCategory">Job Category</label>
            </div>
            <div className="form-floating mb-4">
              <input
                type="date"
                className="form-control"
                id="floatingDate"
                placeholder="Appointment Date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
              />
              <label htmlFor="floatingDate">Appointment Date</label>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 d-flex justify-content-center align-items-center"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
