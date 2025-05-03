import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPencilAlt,
  faTrash,
  faBoxes,
  faChartPie,
  faFilePdf,
  faRefresh,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Modal, Button, Badge, Card, Tab, Tabs } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Tooltip } from "react-tooltip";
import { Pie, Bar } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "jspdf-autotable";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

const AllPackages = () => {
  const [packages, setPackages] = useState([]);
  const [packageCount, setPackageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("packages");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/package/");
      setPackages(response.data);
      setPackageCount(response.data.length);
    } catch (error) {
      console.error("Error fetching packages:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load packages. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this package?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3001/package/delete/${id}`);
          setPackages((prevPackages) =>
            prevPackages.filter((pkg) => pkg._id !== id)
          );
          setPackageCount((prevCount) => prevCount - 1);
          Swal.fire({
            title: "Deleted!",
            text: "Package has been deleted.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          Swal.fire("Error!", "Failed to delete package.", "error");
          console.error("Error deleting package:", error);
        }
      }
    });
  };

  // Chart data configurations
  const availabilityData = {
    labels: ["Available", "Not Available"],
    datasets: [
      {
        data: [
          packages.filter((pkg) => pkg.availability).length,
          packages.filter((pkg) => !pkg.availability).length,
        ],
        backgroundColor: ["#4CAF50", "#FFC107"],
        borderColor: ["#388E3C", "#FFA000"],
        borderWidth: 1,
      },
    ],
  };

  const priceRangeData = {
    labels: packages.map((pkg) => pkg.packageName),
    datasets: [
      {
        label: "Price ($)",
        data: packages.map((pkg) => pkg.price),
        backgroundColor: "#36A2EB",
        borderColor: "#1E88E5",
        borderWidth: 1,
      },
    ],
  };

  const generateReport = () => {
    Swal.fire({
      title: "Generating Report",
      html: "Please wait while we prepare your report...",
      timerProgressBar: true,
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
    });

    setTimeout(() => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Add title
      doc.setFontSize(20);
      doc.setTextColor(33, 150, 243);
      doc.text("Package Management Report", pageWidth / 2, 20, { align: "center" });
      
      // Add report details
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, 14, 35);
      doc.text(`Total packages: ${packageCount}`, 14, 45);
      
      // Add table
      doc.autoTable({
        startY: 55,
        head: [["#", "Package", "Price", "Category", "Availability"]],
        body: packages.map((pkg, i) => [
          i + 1,
          pkg.packageName,
          `$${pkg.price}`,
          pkg.category,
          pkg.availability ? "Available" : "Unavailable",
        ]),
        theme: "grid",
        headStyles: {
          fillColor: [33, 150, 243],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      // Save the PDF
      doc.save("package-report.pdf");
      Swal.fire("Success!", "Report generated successfully.", "success");
    }, 1500);
  };

  return (
    <div className="container py-4">
      <Card className="shadow-lg">
        {/* Card Header */}
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">
                <FontAwesomeIcon icon={faBoxes} className="me-2" />
                Package Management System
              </h4>
              <small className="opacity-75">Manage all your packages in one place</small>
            </div>
            <Badge pill bg="light" text="primary" className="fs-6 px-3 py-2">
              Total: {packageCount} packages
            </Badge>
          </div>
        </Card.Header>

        {/* Card Body with Tabs */}
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
            fill
          >
            <Tab eventKey="packages" title="Packages List">
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Button
                  variant="outline-primary"
                  onClick={fetchPackages}
                  disabled={isLoading}
                  className="action-button"
                >
                  <FontAwesomeIcon
                    icon={faRefresh}
                    spin={isLoading}
                    className="me-2"
                  />
                  {isLoading ? "Refreshing..." : "Refresh"}
                </Button>
                <Link to="/add-package" className="btn btn-outline-success action-button">
                  <FontAwesomeIcon icon={faBoxes} className="me-2" />
                  Add New Package
                </Link>
                <Button 
                  variant="outline-info" 
                  onClick={() => setActiveTab("analytics")}
                  className="action-button"
                >
                  <FontAwesomeIcon icon={faChartPie} className="me-2" />
                  View Analytics
                </Button>
                <Button 
                  variant="outline-danger" 
                  onClick={generateReport}
                  className="action-button"
                >
                  <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                  Generate Report
                </Button>
              </div>

              <div className="table-responsive" style={{ maxHeight: "50vh" }}>
                <table className="table table-hover align-middle">
                  <thead className="bg-light sticky-top">
                    <tr>
                      <th className="ps-4">#</th>
                      <th>Package Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Discount</th>
                      <th>Availability</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((pkg, index) => (
                      <tr key={pkg._id}>
                        <td className="ps-4 fw-bold">{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="ms-3">
                              <p className="fw-bold mb-0">{pkg.packageName}</p>
                              <p className="text-muted mb-0 small">
                                <FontAwesomeIcon icon={faInfoCircle} className="me-1" />
                                {pkg.description.substring(0, 30)}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-success bg-opacity-10 text-success fs-6">
                            ${pkg.price}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-info bg-opacity-10 text-info">
                            {pkg.category}
                          </span>
                        </td>
                        <td>{pkg.discount}%</td>
                        <td>
                          <span
                            className={`badge ${
                              pkg.availability
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                          >
                            {pkg.availability ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Link
                              to={`/view-package/${pkg._id}`}
                              className="btn btn-sm btn-primary action-icon"
                              data-tooltip-id="view-tooltip"
                              data-tooltip-content="View Details"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </Link>
                            <Link
                              to={`/update-package/${pkg._id}`}
                              className="btn btn-sm btn-warning action-icon"
                              data-tooltip-id="edit-tooltip"
                              data-tooltip-content="Edit Package"
                            >
                              <FontAwesomeIcon icon={faPencilAlt} />
                            </Link>
                            <button
                              className="btn btn-sm btn-danger action-icon"
                              onClick={() => handleDelete(pkg._id)}
                              data-tooltip-id="delete-tooltip"
                              data-tooltip-content="Delete Package"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Tooltip id="view-tooltip" place="top" effect="solid" />
                <Tooltip id="edit-tooltip" place="top" effect="solid" />
                <Tooltip id="delete-tooltip" place="top" effect="solid" />
              </div>
            </Tab>

            <Tab eventKey="analytics" title="Analytics">
              <div className="row mt-3">
                <div className="col-md-6 mb-4">
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0 text-center">Package Availability</h5>
                    </Card.Header>
                    <Card.Body>
                      <div style={{ height: "300px" }}>
                        <Pie
                          data={availabilityData}
                          options={{
                            plugins: {
                              legend: { position: "bottom" },
                            },
                            maintainAspectRatio: false,
                          }}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-6 mb-4">
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0 text-center">Price Distribution</h5>
                    </Card.Header>
                    <Card.Body>
                      <div style={{ height: "300px" }}>
                        <Bar
                          data={priceRangeData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                grid: { drawBorder: false },
                              },
                              x: { grid: { display: false } },
                            },
                            plugins: {
                              legend: { display: false },
                            },
                          }}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </Tab>
          </Tabs>
        </Card.Body>

        {/* Card Footer */}
        <Card.Footer className="bg-light text-muted small">
          <div className="d-flex justify-content-between">
            <div>Last updated: {new Date().toLocaleString()}</div>
            <div>Total records: {packageCount}</div>
          </div>
        </Card.Footer>
      </Card>

      {/* Custom CSS for button visibility */}
      <style jsx>{`
        .action-button {
          min-width: 160px;
          transition: all 0.2s ease;
          border-width: 2px;
        }
        .action-icon {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
          opacity: 1 !important;
          border: 2px solid transparent;
        }
        .action-icon:hover {
          transform: scale(1.1);
        }
        .btn-outline-primary {
          color: #0d6efd;
          border-color: #0d6efd;
        }
        .btn-outline-success {
          color: #198754;
          border-color: #198754;
        }
        .btn-outline-info {
          color: #0dcaf0;
          border-color: #0dcaf0;
        }
        .btn-outline-danger {
          color: #dc3545;
          border-color: #dc3545;
        }
      `}</style>
    </div>
  );
};

export default AllPackages;