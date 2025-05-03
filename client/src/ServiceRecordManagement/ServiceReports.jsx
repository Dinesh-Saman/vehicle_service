import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from 'react-router-dom'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ServiceReports.css'; // Import the CSS file

function ServiceReports() {
  const [totalServices, setTotalServices] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [mostCommonParts, setMostCommonParts] = useState([]);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [serviceFilter, setServiceFilter] = useState('');
  const [serviceStatusFilter, setServiceStatusFilter] = useState(''); // New state for service status filter

  const navigate = useNavigate();

  const handleTotalServicesClick = () => {
    navigate('/ServiceInfographic'); // Navigate to the infographic page
  };

  const handleMostCommonlyUsedParts = () => {
    navigate('/PartsUsageTable'); // Navigate to the parts usage page
  };

  const handleRevenueAreaChart = () => {
    navigate('/RevenueAreaChart'); // Navigate to the revenue area chart page
  };

  const handlePartClick = (part) => {
    navigate('/PartDetails', { state: { part } }); // Navigate to PartDetails and pass the part
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const result = await axios.get("http://localhost:3001/Services");
        const servicesData = result.data;
        setServices(servicesData);
        setFilteredServices(servicesData); // Initialize filtered services

        // Calculate total services completed
        setTotalServices(servicesData.length);

        // Calculate total revenue
        const revenue = servicesData.reduce((acc, service) => acc + service.price, 0);
        setTotalRevenue(revenue);

        // Calculate most commonly used parts
        const partCount = {};
        servicesData.forEach(service => {
          if (service.parts) {
            service.parts.split(', ').forEach(part => {
              partCount[part] = (partCount[part] || 0) + 1;
            });
          }
        });
        const sortedParts = Object.entries(partCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5); // Get top 5 commonly used parts
        setMostCommonParts(sortedParts);
      } catch (error) {
        toast.error("Failed to fetch service records.");
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    let filtered = services;

    // Filter by date range
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(service => {
        const serviceDate = new Date(service.date);
        return serviceDate >= new Date(dateRange.start) && serviceDate <= new Date(dateRange.end);
      });
    }

    // Filter by service type
    if (serviceFilter) {
      filtered = filtered.filter(service => service.service.toLowerCase().includes(serviceFilter.toLowerCase()));
    }

    // Filter by service status
    if (serviceStatusFilter) {
      filtered = filtered.filter(service => service.status.toLowerCase() === serviceStatusFilter.toLowerCase());
    }

    setFilteredServices(filtered);
  }, [dateRange, serviceFilter, serviceStatusFilter, services]); // Added serviceStatusFilter to dependencies

  // Create a unique list of services for the dropdown
  const uniqueServices = [...new Set(services.map(service => service.service))];

  // Create a unique list of statuses for the status dropdown
  const uniqueStatuses = [...new Set(services.map(service => service.status))]; // Unique service statuses

  // Calculate total price of filtered services
  const filteredTotalPrice = filteredServices.reduce((acc, service) => acc + service.price, 0);

  const generatePDF = () => {
    const input = document.getElementById('service-reports-content');
    const downloadButton = document.getElementById('download-pdf-btn');
    
    // Hide the download button
    downloadButton.style.display = 'none';
    
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
    
      let position = 0;
    
      // Get the current date and time
      const currentDateTime = new Date().toLocaleString();
    
      // Add the image to the first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      
      // Add the date and time to the bottom of the first page
      pdf.text(`Generated on: ${currentDateTime}`, 10, pageHeight - 10); // Positioning near bottom (10mm from bottom)
      
      heightLeft -= pageHeight;
    
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        
        // Add the date and time to the bottom of each new page
        pdf.text(`Generated on: ${currentDateTime}`, 10, pageHeight - 10); // Position near bottom
        heightLeft -= pageHeight;
      }
    
      pdf.save("service-report.pdf");
    

      // Show the download button again
      downloadButton.style.display = 'block';
    });
  };

  return (
    <div className="service-reports-background">
      <div className="service-reports-container" id="service-reports-content">
        <h2 className="title">Service Reports</h2>

        {/* Filters */}
        <div className="filters-container">
          <h5>Filters</h5>
          <input
            type="date"
            className="filter-input"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            placeholder="Start Date"
          />
          <input
            type="date"
            className="filter-input"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            placeholder="End Date"
          />
          <select
            className="filter-select"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
          >
            <option value="">Filter by Service</option>
            {uniqueServices.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>

          {/* New dropdown for service status filter */}
          <select
            className="filter-select"
            value={serviceStatusFilter}
            onChange={(e) => setServiceStatusFilter(e.target.value)}
          >
            <option value="">Filter by Status</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="cards-container">
          <div className="pcard" onClick={handleTotalServicesClick} style={{ cursor: 'pointer' }}>
            <div className="pcard">
              <h5>Total Services</h5>
              <p>{totalServices}</p>
            </div>
          </div>

          <div className="pcard" onClick={handleRevenueAreaChart} style={{ cursor: 'pointer' }}>
            <div className="pcard">
              <h5>Total Revenue Generated (LKR)</h5>
              <p>Rs. {totalRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
            </div>
          </div>

          <div className="pcard" onClick={handleMostCommonlyUsedParts} style={{ cursor: 'pointer' }}>
            <div className="pcard">
              <h5>Most Commonly Used Parts</h5>
              <ul className="parts-list">
                {mostCommonParts.map(([part, count]) => (
                  <li key={part}>{part}: {count} times</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pcard" style={{ cursor: 'pointer' }}>
            <div className="pcard">
              <h5>Total Services in List</h5>
              <p>{filteredServices.length}</p>
            </div>
          </div>

          <div className="pcard" style={{ cursor: 'pointer' }}>
            {/* New card for Parts Used for Services */}
            <div className="pcard parts-used-card">
              <h5>Parts Used for Filtered Services</h5>
              <ul className="parts-list">
                {filteredServices.map(service => (
                  <li key={service._id}>
                    {service.service}: {service.parts || 'No parts used'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pcard" style={{ cursor: 'pointer' }}>
            {/* New card for Total Price of Filtered Services */}
            <div className="pcard total-price-card">
              <h5>Total Price Gained from the Filtered Service (LKR)</h5>
              <p>Rs. {filteredTotalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
            </div>
          </div>
        </div>

        <button id="download-pdf-btn" onClick={generatePDF} className="download-pdf-btn">
          Download PDF
        </button>


        {/* Service Records Table */}
        <div className="filtered-services">
          <h4>Filtered Services</h4>
          <ul className="list-unstyled">
            {filteredServices.map(service => (
              <li key={service._id} className="filtered-service-item">
                {service.service} - Rs. {service.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} on {service.date}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default ServiceReports;
