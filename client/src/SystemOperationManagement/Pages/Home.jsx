import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/Home.css'; // Import CSS file for styling

const Home = () => {
  // Function to automatically change background images
  useEffect(() => {
    const heroSection = document.querySelector('.hero-section');
    const images = [
      '../../Pages/images/view-car-running-high-speed.jpg',
      '../../Pages/images/view-car-running-high-speed (1).jpg',
      '../../Pages/images/view-car-running-high-speed (2).jpg',
      '../../Pages/images/view-wheel-car-running-high-speed.jpg'
    ];
    
    let currentIndex = 0;

    const changeBackgroundImage = () => {
      currentIndex = (currentIndex + 1) % images.length; // Move to the next image in the array
      heroSection.style.backgroundImage = `url(${images[currentIndex]})`;
    };

    const intervalId = setInterval(changeBackgroundImage, 3000); // Change every 3 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return (
    <div className="container-fluid">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content" style={{ marginTop: '100px', padding: '20px' }}>
          <h1>Welcome to Our Car Service Center</h1>
          <p>Book your service now for the best care of your vehicle.</p>
          <Link to="/register" className="btn btn-primary">Join Us Today!</Link>
        </div>
      </section>

      {/* Service Highlights Section */}
      <section className="services-section text-center py-5">
        <h2 className="section-title">Our Services</h2>
        <p className="section-description">Explore a wide range of services we offer to keep your vehicle in top shape</p>
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="service-card card shadow">
              <div className="card-body">
                <h5 className="card-title">Washing Packages</h5>
                <p className="card-text">Choose from our variety of washing packages.</p>
                <Link to="/services/washing-packages" className="btn btn-primary">Learn More</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="service-card card shadow">
              <div className="card-body">
                <h5 className="card-title">Lubrication Services</h5>
                <p className="card-text">Keep your vehicle running smoothly with our lubrication services.</p>
                <Link to="/services/lubrication" className="btn btn-primary">Learn More</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="service-card card shadow">
              <div className="card-body">
                <h5 className="card-title">Treatment Services</h5>
                <p className="card-text">Enhance your vehicle's performance with our treatment services.</p>
                <Link to="/services/treatment" className="btn btn-primary">Learn More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-section" style={{ padding: '20px', marginTop: '20px' }}>
        <h2>Contact Us</h2>
        <p>Contact us for any inquiries or to schedule your service appointment.</p>
        <Link to="/contact" className="btn btn-primary">Contact Us</Link>
      </section>
    </div>
  );
};

export default Home;
