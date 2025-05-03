import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencilAlt, faTrash, faBoxes, faChartBar } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import "bootstrap/dist/css/bootstrap.min.css";

const AllSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [partsRequired, setPartsRequired] = useState("");
  const [quantity, setQuantity] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/supplier/");
      setSuppliers(response.data);
      setFilteredSuppliers(response.data); // Initialize filteredSuppliers to all suppliers
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleAddSupplier = async () => {
    const newSupplier = {
      supplierName,
      contactPerson,
      phoneNumber,
      address,
      partsRequired,
      quantity,
      additionalNote,
    };

    try {
      const response = await axios.post("http://localhost:3001/supplier/add", newSupplier);
      setSuppliers((prevSuppliers) => [...prevSuppliers, response.data]);
      setFilteredSuppliers((prevSuppliers) => [...prevSuppliers, response.data]);
      resetFields();
      Swal.fire("Success", "Supplier added successfully!", "success");
    } catch (error) {
      console.error("Error adding supplier:", error);
      Swal.fire("Error", "There was an issue adding the supplier.", "error");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3001/supplier/delete/${id}`);
          setSuppliers((prevSuppliers) => prevSuppliers.filter((supplier) => supplier._id !== id));
          setFilteredSuppliers((prevSuppliers) => prevSuppliers.filter((supplier) => supplier._id !== id));
          Swal.fire("Deleted!", "The supplier has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "There was an issue deleting the supplier.", "error");
          console.error("Error deleting supplier:", error);
        }
      }
    });
  };

  const resetFields = () => {
    setSupplierName("");
    setContactPerson("");
    setPhoneNumber("");
    setAddress("");
    setPartsRequired("");
    setQuantity("");
    setAdditionalNote("");
  };

  // Search Functionality
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const searchResults = suppliers.filter((supplier) =>
      supplier.supplierName.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredSuppliers(searchResults);
  };

  // Prepare data for the bar chart
  const chartData = {
    labels: filteredSuppliers.map((supplier) => supplier.partsRequired),
    datasets: [
      {
        label: "Quantity",
        data: filteredSuppliers.map((supplier) => supplier.quantity),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderWidth: 1,
      },
    ],
  };

  const totalSuppliers = filteredSuppliers.length;

  // Function to generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Supplier Report", 14, 20);

    // Add a line break
    doc.setFontSize(12);
    doc.text(`Total Suppliers: ${totalSuppliers}`, 14, 30);

    // Add table headers
    const headers = ["Supplier ID", "Supplier Name", "Contact Person", "Phone Number", "Address", "Parts Required", "Quantity", "Additional Note"];
    const data = filteredSuppliers.map((supplier, index) => [
      `s${String(index + 1).padStart(3, '0')}`, // Generate Supplier ID
      supplier.supplierName,
      supplier.contactPerson,
      supplier.phoneNumber,
      supplier.address,
      supplier.partsRequired,
      supplier.quantity,
      supplier.additionalNote,
    ]);

    // Add the table
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 40,
      theme: "grid",
    });

    // Save the PDF
    doc.save("supplier_report.pdf");
  };

  return (
    <div style={{ display: "flex", height: "100vh", padding: "10px" }}>
      <div className="main-content" style={{ flex: "1", padding: "20px", overflowY: "auto" }}>
        <div className="d-flex justify-content-center align-items-center vh-100 bg-opacity-75">
          <div className="card shadow-lg" style={{ width: "100%" }}>
            <div className="card-header text-center bg-dark text-white">
              <h2>All Supplier Details</h2>
              <h4>Total Suppliers: {totalSuppliers}</h4>
            </div>
            <div className="card-body">
              <div className="text-center mb-3">
                <Link
                  to="/supplier/add"
                  className="btn btn-outline-secondary ms-2"
                  style={{ color: "blue", borderColor: "blue" }}
                >
                  <FontAwesomeIcon icon={faBoxes} /> Add New Supplier
                </Link>

                <Button variant="success" onClick={() => setShowChart(true)} style={{ marginLeft: "10px" }}>
                  <FontAwesomeIcon icon={faChartBar} /> Show Chart
                </Button>
                <Button variant="info" onClick={generatePDF} style={{ marginLeft: "10px" }}>
                  Generate Report
                </Button>
              </div>

              <div className="search-bar mb-3">
                <input
                  type="text"
                  placeholder="Search by Supplier Name..."
                  className="form-control"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>

              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table className="table table-hover table-striped table-bordered">
                  <thead className="thead-dark">
                    <tr>
                      <th>Supplier ID</th>
                      <th>Supplier Name</th>
                      <th>Contact Person</th>
                      <th>Phone Number</th>
                      <th>Address</th>
                      <th>Parts Required</th>
                      <th>Quantity</th>
                      <th>Additional Note</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuppliers.map((supplier, index) => (
                      <tr key={supplier._id}>
                        <td>{`s${String(index + 1).padStart(3, '0')}`}</td> {/* Display generated Supplier ID */}
                        <td>{supplier.supplierName}</td>
                        <td>{supplier.contactPerson}</td>
                        <td>{supplier.phoneNumber}</td>
                        <td>{supplier.address}</td>
                        <td>{supplier.partsRequired}</td>
                        <td>{supplier.quantity}</td>
                        <td>{supplier.additionalNote}</td>
                        <td>
                          <div className="btn-group">
                          
                            <Link to={`/supplier/update/${supplier._id}`} className="btn btn-outline-warning" title="Edit">
                              <FontAwesomeIcon icon={faPencilAlt} />
                            </Link>
                            <Button
                              onClick={() => handleDelete(supplier._id)}
                              className="btn btn-outline-danger"
                              title="Delete"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart Modal */}
      <Modal show={showChart} onHide={() => setShowChart(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Supplier Parts Quantity Chart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Bar data={chartData} />
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowChart(false)}
  style={{ width: 'auto', padding: '5px 10px' }}  // Adjust padding as needed
>
  Close
</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllSuppliers;
