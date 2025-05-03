import { useState } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import PackageHeader from './components/PackageHeader'; // Import the PackageHeader component
import Footer from './components/Footer'; // Import the Footer component

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if(email === 'paman@gmail.com' && password === '123') {
      window.location.href = '/dashboard';
    } else {
      alert('Invalid credentials');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div>
      {/* Adding the PackageHeader */}
      <PackageHeader />

      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow" style={{ width: '500px', borderRadius: '10px' }}>
          <h2 className="card-title text-center">Sign-In</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter Email"
                autoComplete='off'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter Password"
                autoComplete='off'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-success w-100">Log in</button>
          </form>
          <p className="text-center mt-3 small">
            You agree to our terms and policies
          </p>
          <button type="button" className="btn btn-light w-100">Create Account</button>
        </div>
      </div>

      {/* Adding the Footer */}
      <Footer />
    </div>
  );
}

export default Login;
