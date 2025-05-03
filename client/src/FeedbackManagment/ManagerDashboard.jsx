import React from 'react';
import { useNavigate } from 'react-router-dom';

// Optionally, if you want to use icons, you can install react-icons
// npm install react-icons
import { FaComments, FaChartBar } from 'react-icons/fa';

const ManagerDashboard = () => {
  const navigate = useNavigate();

  const handleManageFeedback = () => {
    navigate('/managerView');
  };

  const handleViewSummary = () => {
    navigate('/pages/FeedbackSummary');
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundImage: 'url("https://mir-s3-cdn-cf.behance.net/project_modules/fs/97dd4867044643.5b2ba78f68553.jpg")',
      color: 'white',
      fontFamily: "'Montserrat', sans-serif",
      textAlign: 'center',
      padding: '20px',
      boxSizing: 'border-box',
    },
    title: {
      fontSize: '3rem',
      fontWeight: '700',
      marginBottom: '50px',
      textShadow: '3px 3px 6px rgba(0, 0, 0, 0.3)',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '15px',
      padding: '15px 30px',
      fontSize: '18px',
      fontWeight: '600',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      color: 'white',
      backgroundColor: '#8B0000',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s ease',
      width: '220px',
    },
    buttonHover: {
      backgroundColor: '#FF6347',
      transform: 'translateY(-3px)',
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
    },
    buttonIcon: {
      marginRight: '10px',
      fontSize: '1.2em',
    },
    footer: {
      position: 'absolute',
      bottom: '10px',
      fontSize: '0.9rem',
      color: '#f0f0f0',
    },
  };

  return (
    
    <div style={styles.container}>
      <h1 style={styles.title}>Feedback Management Dashboard</h1>
      <button
        style={styles.button}
        onClick={handleManageFeedback}
        onMouseOver={(e) => {
          Object.assign(e.currentTarget.style, styles.buttonHover);
        }}
        onMouseOut={(e) => {
          Object.assign(e.currentTarget.style, styles.button);
        }}
      >
        {/* Uncomment the line below if using react-icons */}
        {/* <FaComments style={styles.buttonIcon} /> */}
        Manage Feedback
      </button>
      <button
        style={styles.button}
        onClick={handleViewSummary}
        onMouseOver={(e) => {
          Object.assign(e.currentTarget.style, styles.buttonHover);
        }}
        onMouseOut={(e) => {
          Object.assign(e.currentTarget.style, styles.button);
        }}
      >
        {/* Uncomment the line below if using react-icons */}
        {/* <FaChartBar style={styles.buttonIcon} /> */}
        View Summary
      </button>
      
    </div>
  );
};

export default ManagerDashboard;
