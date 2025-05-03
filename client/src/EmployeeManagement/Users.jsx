import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiUserPlus, FiHome } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001")
      .then((result) => setUsers(result.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete("http://localhost:3001/deleteUser/" + id)
          .then((res) => {
            setUsers((prev) => prev.filter((user) => user._id !== id));
            Swal.fire("Deleted!", "The user has been deleted.", "success");
          })
          .catch((err) => {
            console.log(err);
            Swal.fire("Error!", "Failed to delete user.", "error");
          });
      }
    });
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="users-container">
      <div className="users-card">
        <div className="users-header">
          <h2 className="users-title">
            <span className="title-accent">User</span> Management
          </h2>
          <div className="users-actions">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <Link to="/create" className="btn btn-add">
              <FiUserPlus className="btn-icon" /> Add User
            </Link>
            <Link to="/dashboard" className="btn btn-dashboard">
              <FiHome className="btn-icon" /> Dashboard
            </Link>
          </div>
        </div>

        <div className="table-responsive">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>NIC</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td data-label="Name">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </td>
                    <td data-label="Date">{new Date(user.date).toLocaleDateString()}</td>
                    <td data-label="NIC">{user.nic}</td>
                    <td data-label="Contact">{user.contact}</td>
                    <td data-label="Email">{user.email}</td>
                    <td data-label="Position"> {user.position}</td>
                    <td data-label="Actions" className="actions-cell">
                      <Link
                        to={`/update/${user._id}`}
                        className="btn-action btn-edit"
                      >
                        <FiEdit2 /> Edit
                      </Link>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(user._id)}
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-results">
                    {searchTerm ? "No matching users found" : "No users available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;