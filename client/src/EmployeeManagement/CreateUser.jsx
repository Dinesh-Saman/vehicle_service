import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function CreateUser() {
  const [name, setName] = useState();
  const [date, setDate] = useState();
  const [nic, setNIC] = useState();
  const [contact, setContact] = useState();
  const [email, setEmail] = useState();
  const [position, setPosition] = useState();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const Submit = (e) => {
    e.preventDefault();

    const birthYear = new Date(date).getFullYear();
    const nicPattern9 = /^[0-9]{9}v$/i; // 9 digit NIC with "v"
    const nicPattern12 = /^[0-9]{12}$/; // 12 digit NIC

    if (birthYear > 1999) {
      if (!nicPattern12.test(nic)) {
        setError('NIC must be a 12-digit number for birth years after 1999.');
        return;
      }
    } else {
      if (!nicPattern9.test(nic)) {
        setError('NIC must be a 9-digit number ending with "v" for birth years before 2000.');
        return;
      }
    }

    // Validate contact number length
    if (contact.length !== 10) {
      setError('Contact number must be exactly 10 digits.');
      return;
    }

     // Validate that a position has been selected
  if (!position || position === "") {
    setError('Please select a valid position.');
    return;
  }


    // Date of birth validation: only accept birth years between 1998 and 2004
  if (birthYear < 1990 || birthYear > 2004) {
    setError('Date of Birth must be between the years 1998 and 2004.');
    return;
  }

    setError(''); // Clear any previous errors
    axios.post("http://localhost:3001/CreateUser", { name, date, nic, contact, email, position })
      .then(result => {
        console.log(result);
        navigate('/users');//new code
      })
      .catch(err => console.log(err));
  }

  return (
    <div className="background d-flex justify-content-center align-items-center vh-100" style={{marginTop:'100px', marginBottom:'100px'}}>
      <div className="card p-4 shadow" style={{ width: '600px', borderRadius: '20px' }}>
        <form onSubmit={Submit}>
          <h2>Create Employee</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {/* Form Fields */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter Name"
              autoComplete='off'
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="date" className="form-label">Date Of Birth</label>
            <input
              type="date"
              className="form-control"
              id="date"
              autoComplete='off'
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="nic" className="form-label">NIC</label>
            <input
              type="text"
              className="form-control"
              id="nic"
              placeholder="Enter NIC"
              autoComplete='off'
              onChange={(e) => setNIC(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contact" className="form-label">Contact</label>
            <input
              type="text"
              className="form-control"
              id="contact"
              placeholder="Enter Contact Number"
              autoComplete='off'
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="text"
              className="form-control"
              id="email"
              placeholder="Enter Email"
              autoComplete='off'
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>





          <div className="mb-3">
  <label htmlFor="position" className="form-label">Position</label>
  <select
    className="form-select"
    id="position"
    onChange={(e) => setPosition(e.target.value)}
  >
    <option value="">Select Position</option>
    <option value="Employee Manager">Employee Manager</option>
    <option value="Inventory Manager">Inventory Manager</option>
    <option value="System Manager">System Manager</option>
    <option value="Trainee Coordinator">Trainee Coordinator</option>
    <option value="Customer Affair Manager">Customer Affair Manager</option>
    <option value="Data Entry Operator">Data Entry Operator</option>
    <option value="Appointment Manager">Appointment Manager</option>
    <option value="Supplier Manager">Supplier Manager</option>
  </select>
</div>






          <button type="submit" className="btn btn-success w-100">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
