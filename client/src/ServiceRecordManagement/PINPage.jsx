import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PINPage = () => {
  const [pin, setPin] = useState('');
  const navigate = useNavigate();
  const correctPin = '7788'; // The correct pin

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === correctPin) {
      navigate('/serviceLogin'); // Navigate to another page upon correct PIN
    } else {
      alert('Incorrect PIN, please try again.');
      setPin(''); // Clear the input field
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url('/path-to-your-background-image.jpg')`, // Optional background image
        backgroundSize: 'cover',
      }}
    >
      <div
        style={{
          padding: '2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
          Enter PIN
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'center' }}>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength="4"
              placeholder="Enter 4-digit PIN"
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                fontSize: '1.2rem',
                textAlign: 'center',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
              required
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#b3202e', // Pin button color
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Submit PIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PINPage;
