import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencilAlt, faTrash, faBoxes, faChartBar, faSearch, faFilePdf, faPlus } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AllSupplier.css"; // Custom CSS file for additional styling

const AllSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3001/supplier/");
      setSuppliers(response.data);
      setFilteredSuppliers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setIsLoading(false);
      Swal.fire("Error", "Failed to load suppliers", "error");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this supplier?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      backdrop: `
        rgba(0,0,123,0.4)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3001/supplier/delete/${id}`);
          setSuppliers(prev => prev.filter(supplier => supplier._id !== id));
          setFilteredSuppliers(prev => prev.filter(supplier => supplier._id !== id));
          Swal.fire("Deleted!", "Supplier has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete supplier.", "error");
          console.error("Error deleting supplier:", error);
        }
      }
    });
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    
    if (searchValue === "") {
      setFilteredSuppliers(suppliers);
    } else {
      const results = suppliers.filter(supplier =>
        supplier.supplierName.toLowerCase().includes(searchValue) ||
        supplier.contactPerson.toLowerCase().includes(searchValue) ||
        supplier.partsRequired.toLowerCase().includes(searchValue) ||
        supplier.phoneNumber.includes(searchValue)
      );
      setFilteredSuppliers(results);
    }
  };

  const chartData = {
    labels: filteredSuppliers.map(supplier => supplier.supplierName),
    datasets: [
      {
        label: "Parts Quantity",
        data: filteredSuppliers.map(supplier => supplier.quantity),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(40, 53, 147);
    doc.text("Supplier Management Report", 105, 15, { align: "center" });
    
    // Subtitle
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });
    
    // Summary
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Suppliers: ${filteredSuppliers.length}`, 14, 35);
    
    // Table
    doc.autoTable({
      startY: 45,
      head: [
        [
          "ID", 
          "Supplier Name", 
          "Contact", 
          "Phone", 
          "Parts", 
          "Qty",
          "Note"
        ]
      ],
      body: filteredSuppliers.map((supplier, index) => [
        `S${String(index + 1).padStart(3, "0")}`,
        supplier.supplierName,
        supplier.contactPerson,
        supplier.phoneNumber,
        supplier.partsRequired,
        supplier.quantity,
        supplier.additionalNote || "-"
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [40, 53, 147],
        textColor: 255,
        fontStyle: "bold"
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      styles: {
        cellPadding: 3,
        fontSize: 10,
        valign: "middle"
      },
      columnStyles: {
        0: { cellWidth: 20 },
        6: { cellWidth: "auto" }
      }
    });
    
    doc.save(`suppliers-report-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="suppliers-container">
      <div className="suppliers-header">
        <h1>Supplier Management</h1>
        <p className="subtitle">Manage your suppliers and inventory needs</p>
      </div>

      <div className="suppliers-actions">
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search suppliers..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="action-buttons">
          <Link to="/supplier/add" className="btn btn-primary">
            <FontAwesomeIcon icon={faPlus} /> Add Supplier
          </Link>
          <button className="btn btn-info" onClick={() => setShowChart(true)}>
            <FontAwesomeIcon icon={faChartBar} /> View Chart
          </button>
          <button className="btn btn-secondary" onClick={generatePDF} style={{width:'35%'}}>
            <FontAwesomeIcon icon={faFilePdf} /> Generate Report
          </button>
        </div>
      </div>

      <div className="suppliers-summary">
        <div className="summary-card">
          <h3>{filteredSuppliers.length}</h3>
          <p>Total Suppliers</p>
        </div>
        <div className="summary-card">
          <h3>
            {filteredSuppliers.reduce((sum, supplier) => sum + parseInt(supplier.quantity || 0), 0)}
          </h3>
          <p>Total Parts Requested</p>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading supplier data...</p>
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <div className="no-results">
          {searchTerm ? (
            <p>No suppliers found matching your search criteria</p>
          ) : (
            <p>No suppliers available. Add your first supplier!</p>
          )}
        </div>
      ) : (
        <div className="suppliers-table-container">
          <table className="suppliers-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Supplier Name</th>
                <th>Contact Person</th>
                <th>Phone</th>
                <th>Parts Required</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier, index) => (
                <tr key={supplier._id}>
                  <td className="supplier-id">S{String(index + 1).padStart(3, "0")}</td>
                  <td className="supplier-name">
                    <span className="name">{supplier.supplierName}</span>
                    {supplier.additionalNote && (
                      <span className="note">{supplier.additionalNote}</span>
                    )}
                  </td>
                  <td>{supplier.contactPerson}</td>
                  <td className="phone">{supplier.phoneNumber}</td>
                  <td className="parts">{supplier.partsRequired}</td>
                  <td className="quantity">
                    <span className="badge">{supplier.quantity}</span>
                  </td>
                  <td className="actions">
                    <Link 
                      to={`/supplier/update/${supplier._id}`} 
                      className="btn btn-sm btn-edit"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </Link>
                    <button
                      onClick={() => handleDelete(supplier._id)}
                      className="btn btn-sm btn-delete"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Chart Modal */}
      <Modal show={showChart} onHide={() => setShowChart(false)} size="lg" centered>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>Parts Quantity by Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="chart-container">
            <Bar 
              data={chartData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `Quantity: ${context.raw}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Quantity'
                    }
                  }
                }
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowChart(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllSuppliers;