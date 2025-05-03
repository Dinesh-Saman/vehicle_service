import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; 
import { FaEdit } from 'react-icons/fa'; 
import { MdDelete } from 'react-icons/md'; 
import { FiLogOut } from 'react-icons/fi';  
import backgroundImage from './assets/supercars.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Switch from 'react-switch';

const MySwal = withReactContent(Swal);

function Services() {
  const [Services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInProgress, setIsInProgress] = useState(false); // State for switch
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
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete('http://localhost:3001/deleteService/' + id)
          .then((res) => {
            toast.success("Service record deleted successfully!");
            setServices((prevServices) => prevServices.filter(service => service._id !== id));
          })
          .catch((err) => {
            toast.error("Failed to delete the service record.");
          });
      }
    });
  };

  const handleLogout = () => {
    navigate("/");  
    toast.info("Logged out successfully!");  
  };

  // Filter based on search query and switch state
  const filteredServices = Services.filter(service =>
    service.vin.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (isInProgress ? service.status === "in-progress" : service.status === "completed")
  );

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-90 rounded p-4 shadow" style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" ,marginTop:"50px"}}>
        <h2 className="text-center" style={{ marginBottom: '0.5rem', color: '#b3202e', fontFamily: "'Poppins', sans-serif", fontWeight: 'bold' }}>
          Services
        </h2>
        <h4 className="text-left" style={{ marginBottom: '1rem', color: '#b3202e', fontFamily: "'Poppins', sans-serif", fontWeight: 'bold' }}>
          Our Assets..
        </h4>

        <div className="mb-3">
          <input 
            type="text" 
            placeholder="Search by Vehicle Number" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="form-control"
            style={{ borderRadius: '0.3rem', boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)' }} 
          />
        </div>
        {/* Status Switch */}
        <div className="mb-3 d-flex align-items-center">
          <label style={{ marginRight: '10px', color: '#b3202e', fontFamily: "'Poppins', sans-serif", fontWeight: 'bold' }}>
            {isInProgress ? "In Progress" : "Completed"}
          </label>
          <Switch 
            onChange={setIsInProgress} 
            checked={isInProgress} 
            offColor="#ccc" 
            onColor="#b3202e" 
            uncheckedIcon={false} 
            checkedIcon={false} 
          />
        </div>

        <br></br>

        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div>
            <Link to="/servicecreate" className="btn btn-success mx-1" style={buttonStyle}>
              Add +
            </Link>
            <Link to="/Servicereports" className="btn btn-success mx-1" style={buttonStyle}>
              Reports
            </Link>
            <Link to="/serviceDashboard" className="btn btn-danger mx-1" style={buttonStyle}>
              Dashboard
            </Link>
          </div>
          <button onClick={handleLogout} className="btn mx-1">
            <FiLogOut style={iconStyle} title="Logout" />
          </button>
        </div>

        <br></br>

        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="table table-hover table-striped" style={tableStyle}>
            <thead>
              <tr style={headerStyle}>
                <th>Service</th>
                <th>Date</th>
                <th>Vehicle Number</th>
                <th>Service ID</th> 
                <th>Price</th>
                <th>Parts Used</th>
                <th>Quantity</th>
                <th>Technician Notes</th>
                <th>Status</th> 
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service, index) => (
                <tr key={index} style={index % 2 === 0 ? rowEvenStyle : rowOddStyle}>
                  <td>{service.serviceId}</td>
                  <td>{service.service}</td>
                  <td>{service.date}</td>
                  <td>{service.vin}</td>
                  <td>{service.price}</td>
                  <td>{service.parts}</td>
                  <td>{service.quantity}</td>
                  <td>{service.notes}</td>
                  <td>{service.status}</td>
                  <td>
                    <Link to={`/serviceupdate/${service._id}`} className="btn mx-1">
                      <FaEdit style={{ ...iconStyle, color: '#a1192d' }} title="Edit" />
                    </Link>
                    <button className="btn mx-1" onClick={() => handleDelete(service._id)}>
                      <MdDelete style={{ ...iconStyle, color: '#a1192d' }} title="Delete" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

const buttonStyle = {
  borderRadius: '0.3rem',
  marginLeft: '10px',
  width: '100px',
  backgroundColor: '#b3202e',
  borderColor: '#b3202e',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.3s, transform 0.3s',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
};

const headerStyle = {
  backgroundColor: '#a1192d',
  color: 'white',
  textAlign: 'center',
};

const rowEvenStyle = {
  backgroundColor: '#f9f9f9',
};

const rowOddStyle = {
  backgroundColor: '#fff',
};

const iconStyle = {
  fontSize: '1.5rem',
  cursor: 'pointer',
};

export default Services;
