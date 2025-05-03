import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AttendanceRecords() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const attendanceResponse = await axios.get('http://localhost:3001/attendanceRecords');
        setRecords(attendanceResponse.data);
      } catch (error) {
        console.log('Error fetching attendance records:', error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const employeesResponse = await axios.get('http://localhost:3001');
        setEmployees(employeesResponse.data);
      } catch (error) {
        console.log('Error fetching employees:', error);
      }
    };

    fetchAttendanceRecords();
    fetchEmployees();
  }, []);

  const goBack = () => {
    navigate('/attendance');
  };

  const getEmployeeDetails = (employeeId) => {
    const employee = employees.find(emp => emp._id === employeeId);
    return employee ? { name: employee.name, nic: employee.nic } : { name: 'Unknown', nic: 'Unknown' };
  };

  // Inline styles
  const styles = {
    container: {
      backgroundImage: "url('https://images.unsplash.com/photo-1636761358774-6c14f281d5c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", // Add your background image path here
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '30px',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentWrapper: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
      maxWidth: '1200px',
      width: '100%',
    },
    title: {
      textAlign: 'center',
      fontSize: '28px',
      color: '#d32f2f',
      marginBottom: '20px',
      fontWeight: 'bold',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      margin: '25px 0',
      fontSize: '16px',
      textAlign: 'left',
      backgroundColor: '#fff',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    th: {
      backgroundColor: '#d32f2f',
      color: '#fff',
      textTransform: 'uppercase',
      padding: '12px 15px',
    },
    td: {
      padding: '12px 15px',
    },
    trHover: {
      backgroundColor: '#f1f1f1',
    },
    evenRow: {
      backgroundColor: '#f3f3f3',
    },
    lastRow: {
      borderBottom: '2px solid #d32f2f',
    },
    backButton: {
      display: 'inline-block',
      marginTop: '20px',
      padding: '10px 20px',
      backgroundColor: '#d32f2f',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    backButtonHover: {
      backgroundColor: '#c62828',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <h2 style={styles.title}>Attendance Records</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Employee Name</th>
              <th style={styles.th}>Employee NIC</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Overtime Hours</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => {
              const { name, nic } = getEmployeeDetails(record.employeeId);
              const rowStyle = index % 2 === 0 ? styles.evenRow : {}; // Alternating row color
              return (
                <tr key={record._id} style={rowStyle}>
                  <td style={styles.td}>{name}</td>
                  <td style={styles.td}>{nic}</td>
                  <td style={styles.td}>{record.date}</td>
                  <td style={styles.td}>{record.status}</td>
                  <td style={styles.td}>{record.overtimeHours}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button
          style={styles.backButton}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.backButtonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.backButton.backgroundColor)}
          onClick={goBack}
        >
          Go Back to Attendance
        </button>
      </div>
    </div>
  );
}

export default AttendanceRecords;
