import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { QRCode } from 'react-qr-code'; // Import QRCode from react-qr-code
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import backgroundImage from './assets/supercars.png';
import Swal from 'sweetalert2';

function QRCodePage() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/Services") // Adjust the URL as needed
      .then((result) => {
        setServices(result.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleFilter = () => {
    const filtered = services.filter(service => service.vin === vehicleNumber);
    setFilteredServices(filtered);
  };

  const downloadPDF = () => {
    const input = document.getElementById('filtered-services-table');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 190; // Set appropriate width
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('filtered-services.pdf');

      Swal.fire({
        icon: 'success',
        title: 'successfull!',
        text: 'Qr Code downloaded successfully.',
        confirmButtonColor: '#b3202e',
        background: '#fff',
        color: '#333',
      });
    });
  };

  return (
    <div 
      style={{
        padding: '2rem',
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        color: '#fff',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color:'#fff', marginTop: '45px',fontSize: '2.5rem', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>QR Codes</h2>
      
      <div className="mb-4" style={{ maxWidth: '650px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)' }}>
          <input
            type="text"
            placeholder="Enter Vehicle Number"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            style={{
              flex: 1,
              padding: '1rem',
              border: 'none',
              outline: 'none',
              fontSize: '1.1rem',
              borderRadius: '0.5rem 0 0 0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#333',
            }}
          />
          <button 
            onClick={handleFilter} 
            style={{
              borderRadius: '0 0.5rem 0.5rem 0',
              padding: '1rem 1.5rem',
              backgroundColor: '#b3202e',
              border: 'none',
              color: '#fff',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#a1192d'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#b3202e'}
          >
            Search
          </button>
        </div>
      </div>

      {vehicleNumber && (
        <div>
          {filteredServices.length > 0 ? (
            <div>
              <table className="table" id="filtered-services-table" style={{ width: '100%', marginTop: '20px', borderRadius: '0.5rem', overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                <thead style={{ backgroundColor: '#b3202e', color: '#fff' }}>
                  <tr>
                    <th>VIN</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Parts Used</th>
                    <th>Quantity</th>
                    <th>QR Code</th> {/* New column for QR code */}
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service, index) => (
                    <tr key={index}>
                      <td>{service.vin}</td>
                      <td>{service.service}</td>
                      <td>{service.date}</td>
                      <td>{service.parts}</td>
                      <td>{service.quantity}</td>
                      <td>
                        {/* Generate QR code that links to the service details */}
                        <QRCode value={`http://localhost:3001/service/${service.vin}`} size={64} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button 
                onClick={downloadPDF} 
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  backgroundColor: '#b3202e',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  borderRadius: '0.5rem',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#a1192d'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#b3202e'}
              >
                Download PDF
              </button>
            </div>
          ) : (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>No records found for this vehicle number.</p>
          )}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          className="btn"
          onClick={() => navigate('/Servicereports')}
          style={{
            borderRadius: '0.5rem',
            padding: '10px 20px',
            backgroundColor: '#b3202e',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            margin: '0 10px',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#a1192d'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#b3202e'}
        >
          Reports
        </button>

        <button
          className="btn"
          onClick={() => navigate('/serviceDashboard')}
          style={{
            borderRadius: '0.5rem',
            padding: '10px 20px',
            backgroundColor: '#b3202e',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            margin: '0 10px',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#a1192d'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#b3202e'}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}

export default QRCodePage;
