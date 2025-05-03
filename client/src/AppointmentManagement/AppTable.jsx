import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from 'sweetalert2';
import { 
  FiSearch, 
  FiPlusCircle, 
  FiDownload, 
  FiEdit2, 
  FiTrash2,
  FiCalendar,
  FiClock,
  FiUser,
  FiMail,
  FiPhone,
  FiTruck
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import './AppTable.css'

function AppTable() {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    setIsLoading(true);
    axios.get("http://localhost:3001/appointments")
      .then(result => {
        setAppointments(result.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const deleteAppointment = (id) => {
    Swal.fire({
      title: 'Confirm Deletion',
      text: "Are you sure you want to delete this appointment?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8B0000',
      cancelButtonColor: '#495057',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      backdrop: `
        rgba(139, 0, 0, 0.4)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3001/Deleteappointments/${id}`)
          .then(() => {
            setAppointments(prev => prev.filter(app => app._id !== id));
            Swal.fire(
              'Deleted!',
              'Appointment has been deleted.',
              'success'
            );
          })
          .catch(err => {
            Swal.fire(
              'Error!',
              err.response?.data?.message || 'Failed to delete appointment',
              'error'
            );
          });
      }
    });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredAppointments = appointments.filter(app =>
    app.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.Phonenumber.includes(searchQuery)
  );

  const generateReport = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(18);
    doc.setTextColor(139, 0, 0);
    doc.text("Levaggio Service Appointments Report", 105, 15, { align: 'center' });
    
    // Add logo or image if available
    // doc.addImage(logo, 'JPEG', 10, 10, 30, 15);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 25, { align: 'center' });
    
    autoTable(doc, {
      startY: 30,
      head: [
        [
          'Customer', 
          'Vehicle', 
          'Services', 
          'Date', 
          'Time', 
          'Contact',
          'Email'
        ]
      ],
      headStyles: {
        fillColor: [139, 0, 0],
        textColor: 255,
        fontStyle: 'bold'
      },
      body: filteredAppointments.map(app => [
        app.customerName,
        app.vehicleModel,
        Array.isArray(app.serviceType) ? app.serviceType.join(", ") : app.serviceType,
        app.appointmentDate,
        app.appointmentTime,
        app.Phonenumber,
        app.email
      ]),
      theme: 'grid',
      styles: {
        cellPadding: 3,
        fontSize: 10,
        valign: 'middle'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 30 }
    });
    
    doc.save(`Levaggio_Appointments_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const handleSendReminder = (appointment) => {
    const message = `Reminder: Your appointment for ${appointment.vehicleModel} is scheduled for ${appointment.appointmentDate} at ${appointment.appointmentTime}`;
    const whatsappURL = `https://wa.me/${appointment.Phonenumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="appointments-container">
      <div className="appointments-card">
        <div className="appointments-header">
          <h2>
            <span className="header-accent">Service</span> Appointments
          </h2>
          
          <div className="appointments-actions">
            <div className="search-container">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
            
            <div className="action-buttons">
              <Link 
                to="/Createappointment" 
                className="btn btn-primary"
              >
                <FiPlusCircle className="btn-icon" /> New Appointment
              </Link>
              
              <button 
                onClick={generateReport}
                className="btn btn-secondary"
                style={{width:'45%'}}
              >
                <FiDownload className="btn-icon" /> Generate Report
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="no-results">
            {searchQuery ? (
              <>
                <p>No appointments found matching your search.</p>
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="btn btn-outline"
                >
                  Clear search
                </button>
              </>
            ) : (
              <p>No appointments scheduled yet.</p>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th><FiUser /> Customer</th>
                  <th><FiTruck /> Vehicle</th>
                  <th>Services</th>
                  <th><FiCalendar /> Date</th>
                  <th><FiClock /> Time</th>
                  <th><FiPhone /> Contact</th>
                  <th><FiMail /> Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(appointment => (
                  <tr key={appointment._id}>
                    <td>
                      <div className="customer-info">
                        <div className="customer-avatar">
                          {appointment.customerName.charAt(0).toUpperCase()}
                        </div>
                        {appointment.customerName}
                      </div>
                    </td>
                    <td>{appointment.vehicleModel}</td>
                    <td>
                      <div className="services-list">
                        {Array.isArray(appointment.serviceType) 
                          ? appointment.serviceType.join(", ") 
                          : appointment.serviceType}
                      </div>
                    </td>
                    <td>{appointment.appointmentDate}</td>
                    <td>{appointment.appointmentTime}</td>
                    <td>{appointment.Phonenumber}</td>
                    <td>{appointment.email}</td>
                    <td>
                      <div className="action-buttons-cell">
                        <button
                          onClick={() => handleSendReminder(appointment)}
                          className="btn-action btn-whatsapp"
                          title="Send Reminder"
                        >
                          <FaWhatsapp />
                        </button>
                        
                        <Link
                          to={`/Updateappointment/${appointment._id}`}
                          className="btn-action btn-edit"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </Link>
                        
                        <button
                          onClick={() => deleteAppointment(appointment._id)}
                          className="btn-action btn-delete"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppTable;