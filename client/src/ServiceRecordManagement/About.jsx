import React from "react";

// About Us Component
const AboutUs = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>About Us</h1>
      <p style={styles.since}>Since 2010</p> {/* New paragraph for "Since 2010" */}

      <div style={styles.infoSection}>
        <div style={styles.descriptionSection}>
          <p style={styles.description}>
            Welcome to <span style={styles.highlight}>Lavaggio</span>, your trusted partner in vehicle service and repair. 
            With years of experience in the industry, we specialize in delivering 
            top-notch automotive care with a focus on customer satisfaction. 
            Our expert team is dedicated to providing comprehensive services 
            including routine maintenance, complex repairs, and premium detailing 
            solutions. At Lavaggio, we combine cutting-edge technology and expert 
            craftsmanship to ensure your vehicle stays in top condition. 
            Our mission is to offer reliable, efficient, and high-quality service 
            that you can count on.
          </p>
        </div>

        <div style={styles.directorSection}>
          <h2 style={styles.teamHeader}>Meet Our Directors</h2>
          <div style={styles.directorContainer}>
            <div style={styles.director}>
              <img 
                src="https://i.pinimg.com/564x/b6/fd/22/b6fd228ba4e85088d91b91c7c7797a17.jpg"  
                alt="Director 1" 
                style={styles.photo} 
              />
              <h3 style={styles.directorName}>John Doe</h3>
              <p style={styles.role}>Chief Executive Officer</p>
            </div>

            <div style={styles.director}>
              <img 
                src="https://i.pinimg.com/564x/50/f6/84/50f684471ba2830106f04520e88c9ed8.jpg"  
                alt="Director 2" 
                style={styles.photo} 
              />
              <h3 style={styles.directorName}>Jane Smith</h3>
              <p style={styles.role}>Chief Operations Officer</p>
            </div>

            <div style={styles.director}>
              <img 
                src="https://i.pinimg.com/564x/ff/32/56/ff3256978cd81cb519d48aa4ac67baab.jpg"  
                alt="Director 3" 
                style={styles.photo} 
              />
              <h3 style={styles.directorName}>Mark Williams</h3>
              <p style={styles.role}>Chief Technical Officer</p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.missionSection}>
        <h2 style={styles.missionHeader}>Our Mission</h2>
        <p style={styles.missionDescription}>
          At Lavaggio, we are committed to excellence and integrity in all our services. 
          Our goal is to ensure that every customer leaves satisfied and their vehicle in optimal condition.
        </p>
      </div>

      <div style={styles.visionSection}>
        <h2 style={styles.visionHeader}>Our Vision</h2>
        <p style={styles.visionDescription}>
          To be the leading automotive service provider, recognized for our commitment to quality and innovation.
        </p>
      </div>
    </div>
  );
};

// Inline CSS Styles
const styles = {
  container: {
    padding: '40px',
    fontFamily: '"Roboto", sans-serif',
    backgroundColor: '#f9f9f9',
    color: '#333',
    textAlign: 'center',
  },
  header: {
    color: '#b3202e',
    fontSize: '40px',
    marginBottom: '10px',
    marginTop: '35px', // Updated margin-top for header
    letterSpacing: '2px',
    textTransform: 'uppercase',
    animation: 'fadeIn 1s ease',
    fontWeight: 'bold', // Bold styling for the header
  },
  since: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#b3202e',
    animation: 'fadeIn 1s ease', // Animation for "Since 2010"
    marginBottom: '20px', // Space below "Since 2010"
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  descriptionSection: {
    maxWidth: '800px',
    margin: '0 auto 40px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
    animation: 'slideIn 0.8s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)', // Scale effect on hover
    },
  },
  description: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#555',
  },
  highlight: {
    color: '#b3202e',
    fontWeight: 'bold',
  },
  teamHeader: {
    color: '#b3202e',
    fontSize: '28px',
    marginBottom: '20px',
    animation: 'fadeIn 1s ease',
  },
  directorSection: {
    width: '100%',
    padding: '20px 0',
  },
  directorContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  director: {
    width: '250px',
    textAlign: 'center',
    margin: '20px',
    transition: 'transform 0.3s ease',
  },
  photo: {
    width: '100%',
    height: '340px', // Fixed height for uniformity
    objectFit: 'cover', // Ensure images fill the box without distortion
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.3s ease',
  },
  directorName: {
    fontSize: '22px',
    marginTop: '10px',
    color: '#b3202e',
    fontWeight: 'bold',
    animation: 'fadeIn 1s ease',
  },
  role: {
    fontSize: '16px',
    color: '#777',
    marginBottom: '30px',
  },
  missionSection: {
    marginTop: '40px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    animation: 'fadeIn 1s ease',
  },
  missionHeader: {
    color: '#b3202e',
    fontSize: '28px',
    marginBottom: '10px',
  },
  missionDescription: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#555',
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  visionSection: {
    marginTop: '40px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    animation: 'fadeIn 1s ease',
  },
  visionHeader: {
    color: '#b3202e',
    fontSize: '28px',
    marginBottom: '10px',
  },
  visionDescription: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#555',
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
};

// Adding Keyframes for animations
const stylesKeyframes = `
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  @keyframes slideIn {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = stylesKeyframes;
document.head.appendChild(styleSheet);

export default AboutUs;
