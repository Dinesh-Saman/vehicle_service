import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWater, 
  faOilCan, 
  faTools, 
  faCarAlt, 
  faBatteryFull, 
  faCheckCircle,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import './ServicePage.css';

const ServicePage = () => {
  const services = [
    {
      title: 'Washing Packages',
      description: 'Comprehensive washing packages to keep your vehicle sparkling clean inside and out. Choose from our basic, premium, or deluxe packages.',
      icon: faWater,
      color: '#3498db'
    },
    {
      title: 'Lubrication Services',
      description: 'Expert lubrication services for smooth engine performance. We use only high-quality lubricants to protect your engine components.',
      icon: faOilCan,
      color: '#e67e22'
    },
    {
      title: 'Treatment Services',
      description: 'Advanced treatments to enhance the longevity of your vehicle. Includes paint protection, rust proofing, and interior conditioning.',
      icon: faTools,
      color: '#9b59b6'
    },
    {
      title: 'Tire Rotation',
      description: 'Ensure even tire wear and extend their lifespan with our professional tire rotation service. Includes pressure check and visual inspection.',
      icon: faCarAlt,
      color: '#2ecc71'
    },
    {
      title: 'Battery Check',
      description: 'Comprehensive battery tests to keep your vehicle running smoothly. We check charge level, connections, and overall battery health.',
      icon: faBatteryFull,
      color: '#f1c40f'
    },
    {
      title: 'Vehicle Inspection',
      description: 'Thorough 50-point inspections to ensure your vehicle is safe and roadworthy. Perfect for pre-purchase evaluations.',
      icon: faCheckCircle,
      color: '#e74c3c'
    },
  ];

  return (
    <div className="service-page-container">
      <div className="header-card-container">
        <div className="header-card">
          <div className="service-page-header">
            <h1>Our Premium Services</h1>
            <p className="subtitle">Professional care for your vehicle with our comprehensive range of services</p>
          </div>
        </div>
      </div>

      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div 
              className="service-icon-container"
              style={{ backgroundColor: `${service.color}20` }} // 20% opacity of the color
            >
              <FontAwesomeIcon 
                icon={service.icon} 
                className="service-icon" 
                style={{ color: service.color }} 
              />
            </div>
            <div className="service-content">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <a href="/services-details" className="service-link">
                Learn More <FontAwesomeIcon icon={faArrowRight} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="service-cta">
        <h2>Ready to give your vehicle the care it deserves?</h2>
        <p>Book an appointment today and experience our premium services</p>
        <button className="cta-button">Schedule Service</button>
      </div>
    </div>
  );
};

export default ServicePage;