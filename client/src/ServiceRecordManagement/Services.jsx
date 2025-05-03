import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; 
import { FaEdit, FaCar, FaSearch, FaFileAlt, FaCalendarAlt, FaTag, FaTools, FaClipboardList, FaCheckCircle, FaSpinner } from 'react-icons/fa'; 
import { MdDelete } from 'react-icons/md'; 
import { FiLogOut, FiPlusCircle } from 'react-icons/fi';  
import { RiDashboardFill } from 'react-icons/ri';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Switch from 'react-switch';

const MySwal = withReactContent(Swal);

function Services() {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInProgress, setIsInProgress] = useState(false);
  const navigate = useNavigate();  

  useEffect(() => {
    axios
      .get("http://localhost:3001/Services")
      .then((result) => setServices(result.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      color: '#333333'
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete('http://localhost:3001/deleteService/' + id)
          .then((res) => {
            toast.success("Service deleted successfully!");
            setServices((prevServices) => prevServices.filter(service => service._id !== id));
          })
          .catch((err) => {
            toast.error("Failed to delete service.");
          });
      }
    });
  };

  const handleLogout = () => {
    navigate("/");  
    toast.info("Logged out successfully!");  
  };

  const filteredServices = services.filter(service =>
    service.vin.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (isInProgress ? service.status === "in-progress" : service.status === "completed")
  );

  return (
    <div className="services-container" style={containerStyle}>
      <div className="services-card" style={cardStyle}>
        {/* Header Section */}
        <div className="header-section" style={headerSectionStyle}>
          <div>
            <h2 style={titleStyle}>
              <FaCar style={{ marginRight: '10px' }} />
              Service Management
            </h2>
            <p style={subtitleStyle}>Track and manage all vehicle services</p>
          </div>
          <button 
            onClick={handleLogout} 
            style={logoutButtonStyle}
          >
            <FiLogOut style={{ marginRight: '5px' }} />
            Logout
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="search-filter-section" style={searchFilterStyle}>
          <div className="search-box" style={searchBoxStyle}>
            <FaSearch style={searchIconStyle} />
            <input 
              type="text" 
              placeholder="Search by vehicle number..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              style={searchInputStyle}
            />
          </div>
          
          <div className="status-filter" style={statusFilterStyle}>
            <span style={statusLabelStyle}>
              {isInProgress ? (
                <>
                  <FaSpinner style={{ marginRight: '5px' }} />
                  In Progress
                </>
              ) : (
                <>
                  <FaCheckCircle style={{ marginRight: '5px' }} />
                  Completed
                </>
              )}
            </span>
            <Switch 
              onChange={setIsInProgress} 
              checked={isInProgress} 
              offColor="#888"
              onColor="#4CAF50"
              uncheckedIcon={false} 
              checkedIcon={false} 
              height={20}
              width={40}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons" style={actionButtonsStyle}>
          <Link to="/servicecreate" style={primaryButtonStyle}>
            <FiPlusCircle style={{ marginRight: '8px' }} />
            Add Service
          </Link>
          <Link to="/Servicereports" style={secondaryButtonStyle}>
            <FaFileAlt style={{ marginRight: '8px' }} />
            Reports
          </Link>
          <Link to="/serviceDashboard" style={secondaryButtonStyle}>
            <RiDashboardFill style={{ marginRight: '8px' }} />
            Dashboard
          </Link>
        </div>

        {/* Services Table */}
        <div className="table-container" style={tableContainerStyle}>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderStyle}>
                  <th style={{ ...headerCellStyle, width: '10%' }}><FaTag /> ID</th>
                  <th style={{ ...headerCellStyle, width: '15%' }}><FaTools /> Service</th>
                  <th style={{ ...headerCellStyle, width: '10%' }}><FaCalendarAlt /> Date</th>
                  <th style={{ ...headerCellStyle, width: '12%' }}><FaCar /> Vehicle No.</th>
                  <th style={{ ...headerCellStyle, width: '10%' }}>Price</th>
                  <th style={{ ...headerCellStyle, width: '15%' }}>Parts</th>
                  <th style={{ ...headerCellStyle, width: '5%' }}>Qty</th>
                  <th style={{ ...headerCellStyle, width: '18%' }}><FaClipboardList /> Notes</th>
                  <th style={{ ...headerCellStyle, width: '5%' }}>Status</th>
                  <th style={{ ...headerCellStyle, width: '10%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service, index) => (
                  <tr key={index} style={index % 2 === 0 ? evenRowStyle : oddRowStyle}>
                    <td style={cellStyle}>{service.serviceId}</td>
                    <td style={cellStyle}>{service.service}</td>
                    <td style={cellStyle}>{new Date(service.date).toLocaleDateString()}</td>
                    <td style={cellStyle}>{service.vin}</td>
                    <td style={cellStyle}>${service.price}</td>
                    <td style={cellStyle}>{service.parts}</td>
                    <td style={cellStyle}>{service.quantity}</td>
                    <td style={cellStyle} className="text-truncate" title={service.notes}>
                      {service.notes}
                    </td>
                    <td style={cellStyle}>
                      <span style={service.status === 'completed' ? statusCompletedStyle : statusInProgressStyle}>
                        {service.status}
                      </span>
                    </td>
                    <td style={{ ...cellStyle, ...actionCellStyle }}>
                      <Link to={`/serviceupdate/${service._id}`} style={editButtonStyle}>
                        <FaEdit />
                      </Link>
                      <button 
                        onClick={() => handleDelete(service._id)}
                        style={deleteButtonStyle}
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredServices.length === 0 && (
            <div style={noResultsStyle}>
              <img 
                src="https://cdn.dribbble.com/users/2382015/screenshots/6065978/media/8b4662f8023e4e2295f865106b5d3a7e.gif" 
                alt="No results" 
                style={noResultsImageStyle}
              />
              <p style={noResultsTextStyle}>No services found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastStyle={{
          borderRadius: '10px',
          fontFamily: "'Poppins', sans-serif"
        }}
      />
    </div>
  );
}

// Styles
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f5f7fa',
  fontFamily: "'Poppins', sans-serif",
  padding: '20px'
};

const cardStyle = {
  width: '95%',
  maxWidth: '1400px',
  backgroundColor: '#ffffff',
  borderRadius: '15px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
  padding: '30px',
  margin: '20px 0'
};

const headerSectionStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px'
};

const titleStyle = {
  color: '#2c3e50',
  fontSize: '28px',
  fontWeight: '600',
  margin: '0',
  display: 'flex',
  alignItems: 'center'
};

const subtitleStyle = {
  color: '#7f8c8d',
  fontSize: '14px',
  margin: '5px 0 0 0'
};

const logoutButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'transparent',
  color: '#e74c3c',
  border: '1px solid #e74c3c',
  borderRadius: '8px',
  padding: '8px 15px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontSize: '14px',
  fontWeight: '500',
  outline: 'none',
  ':hover': {
    backgroundColor: '#e74c3c',
    color: 'white'
  }
};

const searchFilterStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '25px',
  flexWrap: 'wrap',
  gap: '15px'
};

const searchBoxStyle = {
  position: 'relative',
  flex: '1',
  minWidth: '250px'
};

const searchIconStyle = {
  position: 'absolute',
  left: '15px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#95a5a6'
};

const searchInputStyle = {
  width: '100%',
  padding: '12px 20px 12px 45px',
  borderRadius: '10px',
  border: '1px solid #dfe6e9',
  fontSize: '14px',
  transition: 'all 0.3s ease',
  ':focus': {
    borderColor: '#3498db',
    boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.1)',
    outline: 'none'
  }
};

const statusFilterStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const statusLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  color: '#2c3e50',
  fontSize: '14px',
  fontWeight: '500'
};

const actionButtonsStyle = {
  display: 'flex',
  gap: '15px',
  marginBottom: '25px',
  flexWrap: 'wrap'
};

const primaryButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  padding: '12px 20px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontSize: '14px',
  fontWeight: '500',
  textDecoration: 'none',
  boxShadow: '0 4px 6px rgba(52, 152, 219, 0.2)',
  ':hover': {
    backgroundColor: '#2980b9',
    transform: 'translateY(-2px)'
  }
};

const secondaryButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'white',
  color: '#3498db',
  border: '1px solid #3498db',
  borderRadius: '10px',
  padding: '12px 20px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontSize: '14px',
  fontWeight: '500',
  textDecoration: 'none',
  ':hover': {
    backgroundColor: '#f8f9fa',
    transform: 'translateY(-2px)'
  }
};

const tableContainerStyle = {
  width: '100%',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 2px 20px rgba(0, 0, 0, 0.08)',
  backgroundColor: 'white',
};

const tableWrapperStyle = {
  maxHeight: '500px',
  overflowY: 'auto',
  padding: '0 10px',
  margin: '0 -10px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0 8px',
  fontSize: '14px',
};

const headerCellStyle = {
  padding: '16px 20px',
  fontWeight: '500',
  position: 'sticky',
  top: '0',
  backgroundColor: '#3498db',
  color: 'white',
  zIndex: '10',
};

const tableHeaderStyle = {
  backgroundColor: '#3498db',
  color: 'white',
  textAlign: 'left',
  position: 'sticky',
  top: '0',
  zIndex: '10',
};

const cellStyle = {
  padding: '16px 20px',
  borderBottom: '1px solid #ecf0f1',
  verticalAlign: 'middle',
  borderTop: '1px solid #ecf0f1',
};

const evenRowStyle = {
  backgroundColor: '#ffffff',
  ':hover': {
    backgroundColor: '#f8f9fa',
    transform: 'scale(1.002)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  },
  transition: 'all 0.2s ease',
};

const oddRowStyle = {
  backgroundColor: '#f8f9fa',
  ':hover': {
    backgroundColor: '#f1f3f5',
    transform: 'scale(1.002)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  },
  transition: 'all 0.2s ease',
};

const statusCompletedStyle = {
  backgroundColor: '#2ecc71',
  color: 'white',
  padding: '5px 10px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '500',
  display: 'inline-block'
};

const statusInProgressStyle = {
  backgroundColor: '#f39c12',
  color: 'white',
  padding: '5px 10px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '500',
  display: 'inline-block'
};

const actionCellStyle = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'center'
};

const editButtonStyle = {
  backgroundColor: 'transparent',
  color: '#3498db',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'all 0.3s ease',
  ':hover': {
    color: '#2980b9',
    transform: 'scale(1.2)'
  }
};

const deleteButtonStyle = {
  backgroundColor: 'transparent',
  color: '#e74c3c',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'all 0.3s ease',
  ':hover': {
    color: '#c0392b',
    transform: 'scale(1.2)'
  }
};

const noResultsStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 20px',
  textAlign: 'center'
};

const noResultsImageStyle = {
  width: '150px',
  height: '150px',
  marginBottom: '20px'
};

const noResultsTextStyle = {
  color: '#7f8c8d',
  fontSize: '16px',
  fontWeight: '500'
};

export default Services;