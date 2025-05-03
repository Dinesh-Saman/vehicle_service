import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWater, faOilCan, faTools, faCarAlt, faBatteryFull, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './Pages/styles/ServicePage.css';  // Import custom styles

const ServicePage = () => {
  const services = [
    {
      title: 'Washing Packages',
      description: 'Comprehensive washing packages to keep your vehicle sparkling clean.',
      icon: faWater, // Font Awesome icon
    },
    {
      title: 'Lubrication Services',
      description: 'Expert lubrication services for smooth engine performance.',
      icon: faOilCan,
    },
    {
      title: 'Treatment Services',
      description: 'Advanced treatments to enhance the longevity of your vehicle.',
      icon: faTools,
    },
    {
      title: 'Tire Rotation',
      description: 'Ensure even tire wear and extend their lifespan with our tire rotation service.',
      icon: faCarAlt,
    },
    {
      title: 'Battery Check',
      description: 'Comprehensive battery tests to keep your vehicle running smoothly.',
      icon: faBatteryFull,
    },
    {
      title: 'Vehicle Inspection',
      description: 'Thorough inspections to ensure your vehicle is safe and roadworthy.',
      icon: faCheckCircle,
    },
  ];

  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-center mb-4">Our Services</h1>
      <div className="row">
        {services.map((service, index) => (
          <div className="col-lg-4 col-md-6 mb-4" key={index}>
            <div className="service-card">
              <div className="service-icon">
                <FontAwesomeIcon icon={service.icon} size="3x" color="#dc3545" /> {/* Set icon size and color */}
              </div>
              <div className="service-content">
                <h4 className="service-title">{service.title}</h4>
                <p className="service-description">{service.description}</p>
                <a href="/services-details" className="btn btn-danger service-button">Learn More</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicePage;
