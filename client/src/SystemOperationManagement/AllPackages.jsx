import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPencilAlt,
  faTrash,
  faBoxes,
  faTachometerAlt,
  faCog,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-tooltip/dist/react-tooltip.css"; // Import React Tooltip CSS
import { Tooltip } from "react-tooltip"; // Import React Tooltip component
import "./Pages/styles/AllPackages.css"; // Custom CSS for animations
import { Pie, Bar } from "react-chartjs-2";
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import logo from '../systemoperationmanagement/assets/Levaggio.png'; // Import logo
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
  const [showCharts, setShowCharts] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get("http://localhost:3001/package/");
      setPackages(response.data);
      setPackageCount(response.data.length);
    } catch (error) {
      console.error("Error fetching packages:", error);
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
          await axios.delete(`http://localhost:3001/package/delete/${id}`);
          setPackages((prevPackages) =>
            prevPackages.filter((pkg) => pkg._id !== id)
          );
          setPackageCount((prevCount) => prevCount - 1);
          Swal.fire("Deleted!", "The package has been deleted.", "success");
        } catch (error) {
          Swal.fire(
            "Error!",
            "There was an issue deleting the package.",
            "error"
          );
          console.error("Error deleting package:", error);
        }
      }
    });
  };

  // Data for Pie Chart: Package Availability
  const availabilityData = {
    labels: ["Available", "Not Available"],
    datasets: [
      {
        label: "Package Availability",
        data: [
          packages.filter((pkg) => pkg.availability).length,
          packages.filter((pkg) => !pkg.availability).length,
        ],
        backgroundColor: ["#4CAF50", "#FFC107"],
      },
    ],
  };

  // Data for Pie Chart: Overall Distribution
  const pieData = {
    labels: ["Packages", "Other"],
    datasets: [
      {
        label: "Distribution",
        data: [packageCount, 100 - packageCount],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  // Data for Bar Chart: Min and Max Prices
  const minMaxPriceData = {
    labels: ["Min Price", "Max Price"],
    datasets: [
      {
        label: "Price Range",
        data: [
          Math.min(...packages.map((pkg) => pkg.price)),
          Math.max(...packages.map((pkg) => pkg.price)),
        ],
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const handleSidebarClick = (section) => {
    if (section === "packages") {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const generateReport = async () => {
    Swal.fire({
      title: "Generating Report...",
      html: "Please wait while the report is being generated.",
      timer: 2000, // Display for 2 seconds
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  
    try {
      // Wait for 2 seconds to simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 2000));
  
      // Calculate the number of available and unavailable packages
      const availablePackagesCount = packages.filter((pkg) => pkg.availability)
        .length;
      const unavailablePackagesCount = packageCount - availablePackagesCount;
  
      // Create a PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const currentDate = new Date().toLocaleDateString();
  
      // Add outline to the PDF report
      doc.setLineWidth(1);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20); // Draw rectangle with margins
  
      // Add header with logo, title, and date
      const imgWidth = 40;
      const imgHeight = 40;
      const imgX = (pageWidth - imgWidth) / 2; // Center horizontally
      doc.addImage(logo, 'PNG', imgX, 15, imgWidth, imgHeight, undefined, 'FAST'); // Centered logo
  
      doc.setFontSize(14);
      doc.text('Levaiggo Booking Report', pageWidth / 2, 70, { align: 'center' });
      doc.setFontSize(10);
      doc.text(`Generated on: ${currentDate}`, pageWidth / 2, 80, { align: 'center' });
  
      // Title and summary
      doc.setFontSize(12);
      doc.text(`Total Packages: ${packageCount}`, 10, 90);
      doc.text(`Available Packages: ${availablePackagesCount}`, 10, 100);
      doc.text(`Unavailable Packages: ${unavailablePackagesCount}`, 10, 110);
      doc.text("Package Details:", 10, 120);
  
      // Table header
      doc.autoTable({
        startY: 130,
        head: [
          [
            "#",
            "Package Name",
            "Price",
            "Category",
            "Discount",
            "Availability",
            "Duration",
            "Max Customers",
          ],
        ],
        body: packages.map((pkg, index) => [
          index + 1,
          pkg.packageName,
          pkg.price,
          pkg.category,
          pkg.discount,
          pkg.availability ? "Available" : "Not Available",
          pkg.duration,
          pkg.maxCustomers,
        ]),
        theme: "striped",
      });
  
      // Add footer with page number and signature area
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        const pageNoText = `Page ${i} of ${totalPages}`;
        doc.setFontSize(10);
        doc.text(pageNoText, pageWidth / 2, pageHeight - 10, { align: 'center' });
        doc.text('Authorized Signature: Pasindu ___________________', 14, pageHeight - 10);
      }
  
      // Save the PDF
      doc.save("package-report.pdf");
  
      Swal.fire({
        icon: "success",
        title: "Report Generated",
        text: "The report has been generated successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error generating the report.",
      });
      console.error("Error generating report:", error);
    }
  };
  
  return (
    <div style={{ display: "flex", height: "100vh", padding: "10px" }}>
      {/* Dashboard Sidebar */}

      {/* Main Content */}
      <div
        className="main-content bg-opacity-75"
        style={{ flex: "1", padding: "20px", overflowY: "auto" }}
      >
        <div className="d-flex justify-content-center align-items-center vh-100 bg-opacity-75">
          <div className="card shadow-lg" style={{ width: "100%" }}>
            <div className="card-header text-center bg-dark text-white ">
              <h2>All Package Details</h2>
              <h5>Total Packages: {packageCount}</h5>
            </div>
            <div className="card-body">
              <div className="text-center mb-3">
                <Link to="/all-packages" className="btn btn-outline-info">
                  <FontAwesomeIcon icon={faEye} /> View All Packages
                </Link>

                <Link
                  to="/add-package"
                  className="btn btn-outline-secondary ms-2"
                >
                  <FontAwesomeIcon icon={faBoxes} /> Add New Package
                </Link>
              </div>

              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table className="table table-hover table-striped table-bordered">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Package Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Discount</th>
                      <th>Description</th>
                      <th>Availability</th>
                      <th>Duration</th>
                      <th>Max Customers</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((pkg, index) => (
                      <tr key={pkg._id} className="table-row">
                        <td>{index + 1}</td>
                        <td>{pkg.packageName}</td>
                        <td>{pkg.price}</td>
                        <td>{pkg.category}</td>
                        <td>{pkg.discount}</td>
                        <td>{pkg.description}</td>
                        <td>
                          {pkg.availability ? "Available" : "Not Available"}
                        </td>
                        <td>{pkg.duration}</td>
                        <td>{pkg.maxCustomers}</td>
                        <td>
                          <div className="btn-group">
                            <Link
                              to={`/view-package/${pkg._id}`}
                              className="btn btn-outline-success"
                              title="View"
                            >
                              <FontAwesomeIcon
                                icon={faEye}
                                className="icon-hover"
                                data-tooltip-id={`view-tooltip-${pkg._id}`}
                              />
                              <Tooltip
                                id={`view-tooltip-${pkg._id}`}
                                place="top"
                                effect="solid"
                              >
                                View Package
                              </Tooltip>
                            </Link>

                            <Link
                              to={`/update-package/${pkg._id}`}
                              className="btn btn-outline-primary"
                              title="Edit"
                            >
                              <FontAwesomeIcon
                                icon={faPencilAlt}
                                className="icon-hover"
                                data-tooltip-id={`edit-tooltip-${pkg._id}`}
                              />
                              <Tooltip
                                id={`edit-tooltip-${pkg._id}`}
                                place="top"
                                effect="solid"
                              >
                                Edit Package
                              </Tooltip>
                            </Link>

                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(pkg._id)}
                              title="Delete"
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="icon-hover"
                                data-tooltip-id={`delete-tooltip-${pkg._id}`}
                              />
                              <Tooltip
                                id={`delete-tooltip-${pkg._id}`}
                                place="top"
                                effect="solid"
                              >
                                Delete Package
                              </Tooltip>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center mt-4">
  <Button
    onClick={() => setShowCharts(!showCharts)}
    variant="primary"
    className="custom-button"
  >
    {showCharts ? "Hide Charts" : "Show Charts"}
  </Button>
  <Button
    onClick={generateReport}
    variant="success"
    className="custom-button ms-2"
  >
    Generate Report
  </Button>
</div>

            </div>
          </div>
        </div>
      </div>

      {/* Modal for displaying charts */}
      <Modal show={showCharts} onHide={() => setShowCharts(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Package Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
            }}
          >
            <div style={{ width: "35%" }}>
              <h5>Package Availability</h5>
              <Pie data={availabilityData} />
            </div>
            <div style={{ width: "35%" }}>
              <h5>Overall Distribution</h5>
              <Pie data={pieData} />
            </div>
            <div style={{ width: "45%", marginTop: "20px" }}>
              <h5>Price Range</h5>
              <Bar
                data={minMaxPriceData}
                options={{
                  responsive: true,
                  scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true },
                  },
                }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllPackages;
