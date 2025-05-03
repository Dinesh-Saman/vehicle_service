import { useState } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Removed logout icon as it is not used
import Swal from 'sweetalert2'; // Import SweetAlert2
import backgroundImage from './assets/supercars.png';

function ServiceLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); 

  const validateForm = () => {
    if (!email || !password) {
      setErrorMessage('All fields are required');
      return false;
    }
    if (!email.includes('@')) {
      setErrorMessage('Invalid email. Email must contain @ symbol');
      return false;
    }
    if (!/^\d{4}$/.test(password)) {
      setErrorMessage('Password does not match with username');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const userCredentials = {
      'akash@gmail.com': { password: '2002', page: '/serviceDashboard' },
      'madora@gmail.com': { password: '2001', page: '/traineedashboard' },
      'paman@gmail.com': { password: '2001', page: '/Dashboard' },
      'amanda@gmail.com': { password: '2001', page: '/managerView' },
      'lashan@gmail.com': { password: '2002', page: '/inventory' },
      'pasindu@gmail.com': { password: '2002', page: '/packageDashboard' },
      'imal@gmail.com': { password: '2002', page: '/appointment' },
      'dimuth@gmail.com': { password: '2002', page: '/sdashboard' },
    };

    // Check hardcoded credentials first
    if (userCredentials[email] && userCredentials[email].password === password) {
      Swal.fire({ // SweetAlert for successful login
        title: 'Success!',
        text: 'Login successful',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate(userCredentials[email].page);
      });
    } else {
      // If credentials are incorrect, check the backend
      fetch('http://localhost:3002/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Login failed');
          }
          return response.json();
        })
        .then((data) => {
          // Check if backend response indicates invalid credentials
          if (data.success === false) {
            Swal.fire({ // Show error message in SweetAlert
              title: 'Login Failed',
              text: data.message || 'Invalid credentials',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          } else {
            // Handle successful login from the backend
            Swal.fire({
              title: 'Success!',
              text: 'Login successful',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(() => {
              navigate(data.page); // Assuming your backend sends a page property
            });
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          Swal.fire({ // Show generic error in case of fetch failure
            title: 'Error',
            text: 'An error occurred during login. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        });
    }
  };

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="lcard p-4 shadow" style={{ width: '400px', borderRadius: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <h1
          className="mb-5"
          style={{
            textAlign: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
            color: '#8B0000',
          }}
        >
          Sign-in
        </h1>
        <p className="text-center mt-1 small">
          Hello sir, sign-in to access the service operations.
        </p>
        <br />
        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="email" className="form-label" style={{ fontWeight: 'bold' }}>Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter Email"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label" style={{ fontWeight: 'bold' }}>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              id="password"
              placeholder="Enter Password"
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '38px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                color: '#8B0000',
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button
            type="submit"
            className="btn btn-success w-100"
            style={{
              backgroundColor: '#8B0000',
              border: 'none',
              transition: 'background-color 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Log in
          </button>
        </form>
        <br />
        <button type="button" className="btn btn-light w-100">Create Account</button>
      </div>
    </div>
  );
}

export default ServiceLogin;
