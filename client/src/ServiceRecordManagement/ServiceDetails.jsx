import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ServiceDetails() {
  const { vin } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/service/${vin}`)
      .then(response => {
        setService(response.data);
      })
      .catch(err => console.log(err));
  }, [vin]);

  if (!service) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8f9fa' }}>
      <h2>Service Details for VIN: {service.vin}</h2>
      <p><strong>Service:</strong> {service.service}</p>
      <p><strong>Date:</strong> {service.date}</p>
      <p><strong>Parts Used:</strong> {service.parts}</p>
      <p><strong>Quantity:</strong> {service.quantity}</p>
      {/* Add any other details you want to display */}
    </div>
  );
}

export default ServiceDetails;
