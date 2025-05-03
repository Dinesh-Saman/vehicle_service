import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Container, Row, Col, Card, Table, Form, Button, Alert } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaFilePdf } from "react-icons/fa"; 
import Swal from "sweetalert2"; 
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function ManageFeedback() {
  const [info, setInfo] = useState([]);
  const [dId, setDId] = useState("");
  const [filter, setFilter] = useState([]);
  const [query, setQuery] = useState("");
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch(`http://localhost:3001/FgetAll`);
        const data = await res.json();
        if (res.ok) {
          setInfo(data.items);
          setFilter(data.items); // Initialize filter with fetched data
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchInfo();
  }, []);

  const handleDeleteUser = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this feedback?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3001/Fdelete/${dId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setInfo((prev) => prev.filter((employee) => employee._id !== dId));
          Swal.fire("Deleted!", "The feedback has been deleted.", "success");
        }
      } catch (error) {
        console.log(error.message);
        Swal.fire("Error!", "There was an issue deleting the feedback.", "error");
      }
    }
  };

  // Search functionality
  useEffect(() => {
    if (query.trim() === "") {
      setFilter([...info]);
    } else {
      const filteredData = info.filter((employee) =>
        employee.ItemsN?.toLowerCase().includes(query.toLowerCase())
      );
      setFilter(filteredData);
    }
  }, [query, info]);

  // Prepare data for the line chart
  const prepareChartData = () => {
    // Count feedbacks by rating category
    const ratingCounts = info.reduce((acc, feedback) => {
      const rating = feedback.rating;
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: ["High", "Medium", "Low"],
      datasets: [
        {
          label: "Number of Feedbacks",
          data: [
            ratingCounts["High"] || 0,
            ratingCounts["Medium"] || 0,
            ratingCounts["Low"] || 0,
          ],
          fill: false,
          backgroundColor: "#dc3545",
          borderColor: "#dc3545",
          tension: 0.1,
        },
      ],
    };
  };

  const generatePDF = async () => {
    try {
      const doc = new jsPDF();
      doc.text("Feedback Report", 10, 10);

      // Add the line chart to the PDF
      if (chartRef.current) {
        const chart = chartRef.current;
        const chartCanvas = chart.canvas; // Corrected access to canvas
        if (chartCanvas) {
          const chartImage = chartCanvas.toDataURL("image/png", 1.0);
          doc.addImage(chartImage, 'PNG', 10, 20, 190, 80); // Adjust position and size as needed
        } else {
          console.log("Chart canvas not found.");
        }
      } else {
        console.log("Chart ref is null.");
      }

      // Add a table below the chart
      const columns = [
        { title: "Rating", dataKey: "Rating" },
        { title: "Feedback", dataKey: "FeedBack" },
      ];
      const data = info.map((emp) => ({
        Rating: emp.rating,
        FeedBack: emp.descrip,
      }));
      doc.autoTable({
        startY: 110, // Position below the chart
        columns: columns,
        body: data,
        styles: {
          cellPadding: 1,
          fontSize: 10,
          lineHeight: 1.2,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [220, 53, 69], // Bootstrap's danger color
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
      });
      doc.save("FeedbackReport.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      Swal.fire("Error!", "There was an issue generating the PDF.", "error");
    }
  };

  return (
    <Container fluid className="h-100 position-relative">
      {/* Off-Screen Line Chart for PDF */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <Line ref={chartRef} data={prepareChartData()} />
      </div>

      {/* Background Image */}
      <div className="bg-image" style={{
        backgroundImage: "url('https://i.pinimg.com/originals/5b/43/2d/5b432d5fb6bfd23190f34488cbcd6d0a.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        zIndex: -1,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
      }}></div>

      <Row className="justify-content-center align-items-center h-100 position-relative z-1" style={{marginTop:"100px"}}>
        <Col xs={12} md={10} lg={8}>
          <Card className="bg-light rounded shadow-lg my-4" style={{ opacity: 0.9,overflow:"auto" }}>
            <Card.Body>
              <Link to="/ManagerDashboard">
                <Button
                  variant="outline-secondary"
                  className="mb-3"
                  style={{
                    borderRadius: "25px",
                    transition: "all 0.3s ease",
                    fontWeight: "bold",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    backgroundColor:"#8B0000"
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = "#6c757d")}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = "secondary")}
                >
                  Back to Manager Dashboard
                </Button>
              </Link>
              <h1 className="text-center text-uppercase text-dark mb-4" style={{fontWeight:"bold"}}>Feedback</h1>
              <Form className="mb-3">
                <Form.Group controlId="search">
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => setQuery(e.target.value)}
                    className="rounded-pill shadow-sm"
                    style={{ borderColor: "#dc3545", fontSize: "16px" }}
                  />
                </Form.Group>
              </Form>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Button
                  onClick={generatePDF}
                  variant="primary"
                  className="d-flex align-items-center"
                  style={{
                    backgroundColor: "#8B0000",
                    borderColor: "#dc3545",
                    padding: "0.5rem 1rem",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    width:"120px"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#c82333"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#dc3545"}
                >
                  <FaFilePdf className="me-2" /> Generate Report
                </Button>
              </div>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <Table
                  striped
                  bordered
                  hover
                  className="bg-white bg-opacity-75"
                  style={{ opacity: "0.85", borderRadius: "8px" , marginTop:"20px"}}
                >
                  <thead className="bg-dark text-white">
                    <tr>
                      <th>Vehicle ID</th>
                      <th>Name</th>
                      <th>Rating</th>
                      <th>Feedback</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filter.length > 0 ? (
                      filter.map((employee) => (
                        <tr key={employee._id} style={{ transition: "background-color 0.2s" }}>
                          <td>{employee.vehicalid}</td>
                          <td>{employee.name}</td>
                          <td>{employee.rating}</td>
                          <td>{employee.descrip}</td>
                          <td>
                          <Link to={`/feedbackDashboard/feedUpdate/${employee._id}`}>


                              <Button
                                variant="outline-success"
                                className="d-flex align-items-center justify-content-center"
                                style={{ borderRadius: "25px", transition: "all 0.3s ease", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" ,width:"70px"}}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = "#28a745"}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = "success"}
                              >
                                <FaEdit className="me-2" /> Edit
                              </Button>
                            </Link>
                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              className="d-flex align-items-center justify-content-center"
                              onClick={() => {
                                setDId(employee._id);
                                handleDeleteUser();
                              }}
                              style={{ borderRadius: "25px", transition: "all 0.3s ease", boxShadow: "0 2px 4px rgba(0,0,0,0.2)",width:"90px" }}
                              onMouseOver={(e) => e.currentTarget.style.borderColor = "#dc3545"}
                              onMouseOut={(e) => e.currentTarget.style.borderColor = "danger"}
                            >
                              <FaTrashAlt className="me-2" /> Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center">
                          <Alert variant="info" className="mb-0">
                            No feedback available
                          </Alert>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
