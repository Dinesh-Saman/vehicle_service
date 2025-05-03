import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { FiPlus, FiTrash2, FiEdit, FiEye, FiDownload, FiAlertTriangle, FiBarChart2, FiSearch, FiX } from "react-icons/fi";
import "./styles/inventory.css";

Chart.register(...registerables);

export default function Inventory() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const result = await axios.get("http://localhost:3001/inventory");
      setUsers(result.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch inventory data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Confirm Deletion",
      text: "This action cannot be undone. Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      backdrop: "rgba(0,0,0,0.5)"
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3001/inventory/${id}`)
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Item has been deleted.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false
            });
            fetchUsers();
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("Error", "Failed to delete item", "error");
          });
      }
    });
  };

  const handleViewItem = (user) => {
    if (user.Quantity > 0) {
      axios
        .put(`http://localhost:3001/inventory/${user._id}`, {
          ...user,
          Quantity: user.Quantity - 1,
        })
        .then(() => {
          Swal.fire({
            title: "Success!",
            text: "Item used. Quantity decreased by 1.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });
          fetchUsers();
        })
        .catch((err) => {
          console.error(err);
          Swal.fire("Error", "Failed to update item quantity", "error");
        });
    } else {
      Swal.fire({
        title: "Out of Stock",
        text: "This item is currently unavailable.",
        icon: "warning",
        confirmButtonColor: "#3085d6"
      });
    }
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    // Report Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("INVENTORY REPORT", 105, 20, null, null, "center");

    // Report Details
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${currentDate} at ${currentTime}`, 105, 30, null, null, "center");

    // Add logo or decorative element
    doc.setDrawColor(139, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Table Data
    const headers = ["Item Name", "Item ID", "Quantity", "Min Qty"];
    const data = users.map(user => [
      user.ItemName,
      user.ItemId,
      user.Quantity,
      user.MinimumAmount,
    ]);

    // Generate Table
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 40,
      headStyles: { 
        fillColor: [139, 0, 0],
        textColor: [255, 255, 255],
        fontSize: 10,
        halign: 'center'
      },
      bodyStyles: { 
        fontSize: 9,
        cellPadding: 3,
        halign: 'center'
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 40 },
      styles: { overflow: 'linebreak' }
    });

    // Report Footer
    const footerY = doc.autoTable.previous.finalY + 10;
    doc.setDrawColor(139, 0, 0);
    doc.line(20, footerY, 190, footerY);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("© 2023 Levaggio Inventory System", 105, footerY + 5, null, null, "center");

    doc.save(`Inventory_Report_${currentDate.replace(/\//g, '-')}.pdf`);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.ItemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.ItemId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateRandomColors = (num) => {
    const colors = [];
    for (let i = 0; i < num; i++) {
      const color = `rgba(${Math.floor(Math.random() * 155) + 100}, ${Math.floor(
        Math.random() * 155
      ) + 100}, ${Math.floor(Math.random() * 155) + 100}, 0.7)`;
      colors.push(color);
    }
    return colors;
  };

  const barChartData = {
    labels: users.map(user => user.ItemName),
    datasets: [
      {
        label: 'Current Quantity',
        data: users.map(user => user.Quantity),
        backgroundColor: generateRandomColors(users.length),
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(139, 0, 0, 0.8)',
        hoverBorderColor: 'rgba(0, 0, 0, 0.5)',
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
          },
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        padding: 12,
        cornerRadius: 6,
        displayColors: true,
        mode: 'index',
        intersect: false
      },
      title: {
        display: true,
        text: 'Inventory Quantity Overview',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          stepSize: 1
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad'
    }
  };

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h2>Inventory Management</h2>
        <div className="inventory-actions">
          <Link to="/inventorycreate" className="btn btn-add">
            <FiPlus className="icon" /> Add Item
          </Link>
          
          <Link to="/low-inventory" className="btn btn-warning">
            <FiAlertTriangle className="icon" /> Low Stock
          </Link>
          
          <button className="btn btn-info" onClick={handleGenerateReport}>
            <FiDownload className="icon" /> Generate Report
          </button>
          
          <button className="btn btn-primary" onClick={() => setShowChart(true)}>
            <FiBarChart2 className="icon" /> View Analytics
          </button>
        </div>
      </div>

      <div className="search-container">
        <FiSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search items by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm("")}>
            <FiX />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading inventory data...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Item ID</th>
                <th>Quantity</th>
                <th>Min Qty</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className={user.Quantity <= user.MinimumAmount ? 'low-stock' : ''}>
                    <td>{user.ItemName}</td>
                    <td>{user.ItemId}</td>
                    <td>
                      <span className={`quantity ${user.Quantity <= user.MinimumAmount ? 'warning' : ''}`}>
                        {user.Quantity}
                      </span>
                    </td>
                    <td>{user.MinimumAmount}</td>
                    <td>
                      {user.Quantity === 0 ? (
                        <span className="badge out-of-stock">Out of Stock</span>
                      ) : user.Quantity <= user.MinimumAmount ? (
                        <span className="badge low-stock">Low Stock</span>
                      ) : (
                        <span className="badge in-stock">In Stock</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/inventoryupdate/${user._id}`}
                          className="btn-action btn-edit"
                          title="Edit"
                        >
                          <FiEdit />
                        </Link>
                        <button
                          onClick={() => handleViewItem(user)}
                          className="btn-action btn-view"
                          title="Mark as Used"
                          disabled={user.Quantity === 0}
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="btn-action btn-delete"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">
                    No items found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showChart && (
        <div className="chart-modal">
          <div className="chart-modal-content">
            <div className="chart-modal-header">
              <h3>Inventory Analytics</h3>
              <button className="close-modal" onClick={() => setShowChart(false)}>
                <FiX />
              </button>
            </div>
            <div className="chart-container">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
            <div className="chart-modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowChart(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}