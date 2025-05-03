import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/admin/login', { email, password });
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'You are now logged in as an admin.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate('/add-package');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid email or password.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'An error occurred while trying to log in.',
      });
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("https://img.freepik.com/free-photo/mechanic-hand-checking-fixing-broken-car-car-service-garage_146671-19718.jpg?t=st=1746289441~exp=1746293041~hmac=f7f3fec0be4c3c040de8e4bfe1ad2f6c634e692b82c16671000e26aa147dd8e0&w=996")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '20px',
        backdropFilter: 'brightness(0.8)',
      }}
    >
      <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <div className="card-body p-4">
          <h3 className="card-title text-center mb-4 text-primary fw-bold">Admin Login</h3>
          <form onSubmit={handleLogin}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingEmail"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="floatingEmail">Email address</label>
            </div>
            <div className="form-floating mb-4">
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
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 d-flex justify-content-center align-items-center"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
