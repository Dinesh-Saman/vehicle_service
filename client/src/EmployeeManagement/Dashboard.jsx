import React from 'react';
import { Link } from 'react-router-dom';
import PackageHeader from './components/PackageHeader'; // Import the PackageHeader component


function Dashboard() {
  return (
    <div style={styles.background}>
      <PackageHeader /> {/* Add PackageHeader at the top */}

      <div style={styles.card}>
        <h2 style={styles.heading}>Employee Manager Dashboard</h2>

        {/* Horizontal aligned clickable images */}
        <div style={styles.imageContainer}>
          <Link to="/users">
            <img
              src="https://thumbs.dreamstime.com/b/word-writing-register-now-business-concept-online-sale-join-membership-written-price-tag-paper-black-vintage-background-110895714.jpg"
              alt="Go to Users"
              style={styles.iconImage}
              className="icon-image" // Added class name for event listeners
            />
            <div style={styles.label}>Register</div>
          </Link>

          <Link to="/attendance">
            <img
              src="https://t3.ftcdn.net/jpg/02/55/44/78/360_F_255447888_MeZjWc2j4rcQPaXWeDBNMGLIrfQ0LmzY.jpg"
              alt="Go to Attendance"
              style={styles.iconImage}
              className="icon-image" // Added class name for event listeners
            />
            <div style={styles.label}>Attendance</div>
          </Link>

          <Link to="/payments">
            <img
              src="https://media.istockphoto.com/id/2078490118/photo/businessman-using-laptop-to-online-payment-banking-and-online-shopping-financial-transaction.webp?b=1&s=612x612&w=0&k=20&c=8LGWUELmhR8_4M1OQPElcC4njmGEzxNnKpMh3Tu3ft8="
              alt="Go to Payments"
              style={styles.iconImage}
              className="icon-image" // Added class name for event listeners
            />
            <div style={styles.label}>Payments</div>
          </Link>
        </div>
      </div>
     
    </div>
  );
}

const styles = {
  background: {
    display: 'flex',
    flexDirection: 'column', // Changed to column to fit header and footer
    justifyContent: 'center',
    alignItems: 'center',
    height: '120vh',
    backgroundImage: 'url("https://i.pinimg.com/564x/9f/73/23/9f7323561e6afd468a3b94f85168c9e1.jpg")', // Add your background image URL
    backgroundSize: 'cover', // Make sure the image covers the entire background
    backgroundPosition: 'center', // Center the image
    backgroundRepeat: 'no-repeat', // Prevent repeating the background image
  },
  card: {
    padding: '30px',
    width: '1300px',
    borderRadius: '20px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
    backgroundColor: 'rgba(232, 232, 232, 0.5)',
    textAlign: 'center',
  },
  heading: {
    fontSize: '30px',
    marginBottom: '30px',
    color: '#000000',
    fontWeight: 'bold',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  iconImage: {
    width: '300px',
    height: '200px',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  label: {
    marginTop: '10px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#000000',
  },
};

export default Dashboard;
