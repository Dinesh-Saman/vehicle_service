import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [attendance, setAttendance] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [message, setMessage] = useState('');
  const [hasMarkedAttendance, setHasMarkedAttendance] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001')
      .then(result => setEmployees(result.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      const today = new Date().toISOString().split('T')[0];
      axios.get(`http://localhost:3001/attendance/${selectedEmployee}?date=${today}`)
        .then(result => {
          setHasMarkedAttendance(result.data.length > 0);
        })
        .catch(err => console.log(err));
    } else {
      setHasMarkedAttendance(false);
    }
  }, [selectedEmployee]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage('');

    if (!selectedEmployee) {
      setMessage('Please select an employee.');
      return;
    }

    if (!attendance) {
      setMessage('Please select an attendance status.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      setMessage('Date cannot be in the past.');
      return;
    }

    if (attendance === 'Present' && (overtimeHours < 0 || overtimeHours > 5)) {
      setMessage('Overtime hours must be between 1 and 5.');
      return;
    }

    if (hasMarkedAttendance) {
      setMessage('Attendance has already been marked for this employee today.');
      return;
    }

    axios.post('http://localhost:3001/markAttendance', { 
      employeeId: selectedEmployee, 
      status: attendance,
      date,
      overtimeHours
    })
    .then(() => {
      setMessage('Attendance marked successfully.');
      navigate('/attendanceRecords');
    })
    .catch(err => {
      console.log(err);
      setMessage('Failed to mark attendance.');
    });
  };

  // Inline styles for the page design
  const pageStyles = {
    backgroundImage: "url(https://img.freepik.com/free-photo/muscular-car-service-worker-repairing-vehicle_146671-19605.jpg?w=1060&t=st=1727263445~exp=1727264045~hmac=d73375c8eccf75c0fe68c04afc638b0d14b094b613d1629cf4eefcd3fe5c0a5f)", // Replace with your image URL
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const containerStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    width: '400px',
    textAlign: 'center',
  };

  const formGroupStyles = {
    marginBottom: '15px',
  };

  const formControlStyles = {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const buttonStylesPrimary = {
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    width: '100%',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  };

  const buttonStylesSecondary = {
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    width: '100%',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  };

  const alertStyles = {
    backgroundColor: '#ffcccc',
    color: '#cc0000',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
  };

  return (
    <div style={pageStyles}>
      <div style={containerStyles}>
        <h2>Mark Attendance</h2>
        {message && <div style={alertStyles}>{message}</div>}

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyles}>
            <label htmlFor="employee">Select Employee</label>
            <select 
              id="employee" 
              onChange={(e) => setSelectedEmployee(e.target.value)} 
              value={selectedEmployee}
              style={formControlStyles}
            >
              <option value="">Select Employee</option>
              {employees.map(employee => (
                <option key={employee._id} value={employee._id}>
                  {employee.name} - {employee.nic}
                </option>
              ))}
            </select>
          </div>

          <div style={formGroupStyles}>
            <label htmlFor="attendance">Attendance Status</label>
            <select 
              id="attendance" 
              onChange={(e) => {
                setAttendance(e.target.value);
                if (e.target.value !== 'Present') {
                  setOvertimeHours(0);
                }
              }} 
              value={attendance}
              style={formControlStyles}
            >
              <option value="">Select Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>

          <div style={formGroupStyles}>
            <label htmlFor="date">Date</label>
            <input 
              type="date" 
              id="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              min={new Date().toISOString().split('T')[0]} 
              max={new Date().toISOString().split('T')[0]} 
              style={formControlStyles}
            />
          </div>

          {attendance === 'Present' && (
            <div style={formGroupStyles}>
              <label htmlFor="overtime">Overtime Hours</label>
              <input 
                type="number" 
                id="overtime" 
                value={overtimeHours} 
                onChange={(e) => setOvertimeHours(e.target.value)} 
                min="0" max="5" 
                style={formControlStyles}
              />
            </div>
          )}

          <button type="submit" style={buttonStylesPrimary}>Mark Attendance</button>
          <button 
            type="button" 
            style={buttonStylesSecondary} 
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

export default Attendance;
