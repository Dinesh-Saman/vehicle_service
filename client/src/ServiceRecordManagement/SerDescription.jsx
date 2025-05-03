import React, { useState } from 'react';
import backgroundImage from './assets/supercars.png';

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const services = [
    { title: 'Oil Change', description: 'Replacing engine oil and oil filter to ensure smooth engine operation.', icon: '🛢️' },
    { title: 'Fluid Checks', description: 'Checking and topping up or replacing fluids like coolant, brake fluid, and more.', icon: '🧴' },
    { title: 'Tire Services', description: 'Tire rotation, balancing, alignment, and replacement.', icon: '🚗' }, // Changed icon
    { title: 'Battery Services', description: 'Battery inspection, testing, charging, or replacement.', icon: '🔋' },
    { title: 'Brake Services', description: 'Inspection, repair, or replacement of brake pads, rotors, and brake fluid.', icon: '🛑' },
    { title: 'Engine Repairs', description: 'Repairing or replacing parts such as spark plugs, belts, gaskets, etc.', icon: '⚙️' },
    { title: 'Transmission Services', description: 'Inspection, repair, or replacement of the transmission system.', icon: '⏩' },
    { title: 'Suspension Repair', description: 'Fixing issues related to shocks, struts, control arms, and more.', icon: '🔄' },
    { title: 'Exhaust System', description: 'Fixing or replacing exhaust pipes, mufflers, and catalytic converters.', icon: '💨' },
    { title: 'Diagnostic Checks', description: 'Using diagnostic tools to check for problems in the vehicle.', icon: '🔍' },
    { title: 'Electrical Repairs', description: 'Fixing or replacing components like alternators, starters, and wiring.', icon: '⚡' },
    { title: 'AC/Heating Repair', description: 'Repairing issues related to HVAC systems.', icon: '❄️' },
    { title: 'Engine Diagnostics', description: 'Checking engine performance with computerized tools.', icon: '💻' },
    { title: 'Emission Testing', description: 'Ensuring the vehicle meets environmental regulations.', icon: '🌱' },
    { title: 'Engine Tuning', description: 'Adjusting engine components for optimal performance.', icon: '🎛️' },
    { title: 'Bodywork', description: 'Repairing dents, scratches, or damage to the vehicle body.', icon: '🔨' },
    { title: 'Glass Repair', description: 'Fixing or replacing broken or damaged windows or windshields.', icon: '🪟' },
    { title: 'Paint Services', description: 'Repainting or touch-up services for the car exterior.', icon: '🎨' },
    { title: 'Tire Installation', description: 'Installing new tires or repairing existing ones.', icon: '🛠️' },
    { title: 'Wheel Alignment', description: 'Ensuring proper wheel alignment for safety and performance.', icon: '🎯' },
    { title: 'TPMS Service', description: 'Inspecting and repairing the Tire Pressure Monitoring System.', icon: '⚠️' },
    { title: 'State Inspections', description: 'Conducting mandatory state inspections for roadworthiness.', icon: '📝' },
    { title: 'Pre-purchase Checks', description: 'Inspecting used vehicles to assess condition before purchase.', icon: '🔎' },
    { title: 'Safety Checks', description: 'Checking lights, wipers, seat belts, and other safety equipment.', icon: '✅' },
    { title: 'EV Services', description: 'Maintenance and repair for hybrid or electric cars.', icon: '🔌' },
    { title: 'Performance Mods', description: 'Upgrading vehicles with custom exhausts, suspension, etc.', icon: '🏎️' },
    { title: 'Fleet Services', description: 'Maintenance and repair services for business vehicle fleets.', icon: '🚗' },
    { title: 'Detailing Services', description: 'Professional interior and exterior cleaning and protection.', icon: '✨' }, // New service card
  ];

  const handleClick = (service) => {
    setSelectedService(service);
  };

  return (
    <div style={{
      padding: '2rem',
      fontFamily: "'Poppins', sans-serif",
      color: '#333',
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      backgroundAttachment: 'fixed',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <h2 style={{
          textAlign: 'center',
          marginTop: '20px',
          color: '#ffffff',
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          letterSpacing: '1px',
        }}>
          Premium Vehicle Services
        </h2>

        <p style={{
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '1.2rem',
          maxWidth: '800px',
          margin: '0 auto 2rem',
          lineHeight: '1.6',
        }}>
          Discover our comprehensive range of automotive services designed to keep your vehicle performing at its best.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem',
        }}>
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => handleClick(service)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                padding: '1.5rem',
                borderRadius: '15px',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(245,245,245,0.9))',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s ease-in-out',
                color: '#b3202e',
                position: 'relative',
                overflow: 'hidden',
                transform: hoveredCard === index ? 'translateY(-10px)' : 'translateY(0)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '1rem',
                transition: 'transform 0.3s ease',
                transform: hoveredCard === index ? 'scale(1.2)' : 'scale(1)',
              }}>
                {service.icon}
              </div>
              <h3 style={{
                fontSize: '1.4rem',
                margin: '0 0 0.5rem 0',
                fontWeight: 'bold',
                color: '#b3202e',
                position: 'relative',
                zIndex: 2,
              }}>
                {service.title}
              </h3>
              <p style={{
                fontSize: '1rem',
                margin: '0',
                color: '#555',
                position: 'relative',
                zIndex: 2,
              }}>
                {service.description}
              </p>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '5px',
                background: 'linear-gradient(90deg, #b3202e, #ff6b6b)',
                transform: hoveredCard === index ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.3s ease',
              }} />
            </div>
          ))}
        </div>

        {selectedService && (
          <div
            style={{
              marginTop: '3rem',
              padding: '2rem',
              borderRadius: '15px',
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#333',
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
              maxWidth: '800px',
              margin: '3rem auto',
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease',
              borderLeft: '5px solid #b3202e',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginRight: '1rem',
              }}>
                {selectedService.icon}
              </div>
              <h3 style={{ 
                fontSize: '2rem', 
                margin: 0,
                color: '#b3202e',
              }}>
                {selectedService.title}
              </h3>
            </div>
            <p style={{ 
              fontSize: '1.2rem',
              lineHeight: '1.6',
            }}>
              {selectedService.description}
            </p>
            <button
              onClick={() => setSelectedService(null)}
              style={{
                marginTop: '1.5rem',
                padding: '0.8rem 1.5rem',
                background: '#b3202e',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 8px rgba(179, 32, 46, 0.3)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#8a1a24';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#b3202e';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Close Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;