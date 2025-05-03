import { Outlet, Link, useNavigate } from "react-router-dom";

import { Container, Row, Col, Nav, Button, Card, Badge, Image} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';


export default function DashboardLayout() {
  
  const navigate = useNavigate();



  return (
    <Container fluid className="bg-light mx-m-auto p-4">
      <Row className="g-4">
        {/* Sidebar */}
        <Col lg={3} className="bg-white shadow-sm rounded p-4 ">
          <Card className="border-0">
            <Card.Body className="text-center">
              <Card.Title className="mb-4">
                <h4 className="fw-bold"style={{marginTop:"10px"}}>
                  Welcome to the Feedback Section
                </h4>
              </Card.Title>
              <Card.Text>
  <Badge
    bg="secondary"
    className="fs-5 p-2" // Adjusted font size and padding
    style={{
      color: "#8B0000",
      fontSize: "18px", // You can adjust the size here
      padding: "10px 15px", // Added padding for larger size
      borderRadius: "8px" // Added border radius for rounded look
    }}
  >
    User Dashboard
  </Badge>
</Card.Text>
            </Card.Body>
          </Card>

          <hr className="my-4" />

          {/* Navigation */}
          <Nav className="flex-column">
            <Nav.Item className="mb-3">
              <Nav.Link
                as={Link}
                to="/feedbackDashboard/allfeed"
                className="text-danger fw-bold"
              >
                <i className="bi bi-archive-fill me-2"></i>
                All Feedback
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-3">
              <Nav.Link
                as={Link}
                to="/feedbackDashboard/addFeed"
                className="text-danger fw-bold"
              >
                <i className="bi bi-plus-circle-fill me-2"></i>
                New Feedback
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-3">
              <Nav.Link
                as={Link}
                to="/feedbackDashboard/massage"
                className="text-danger fw-bold"
              >
               
                <i className="bi bi-envelope-fill me-2"></i>
                Send Message
              </Nav.Link>
            </Nav.Item>
            
          </Nav>

          <Button
  
  style={{
    background: 'linear-gradient(90deg, rgba(255, 0, 0, 1) 0%, rgba(255, 136, 0, 1) 100%)',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '25px',
    padding: '10px 20px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  }}
  onMouseEnter={(e) => {
    e.target.style.transform = 'scale(1.05)';
    e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = 'scale(1)';
    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
  }}
  className="w-100 mt-4"
>
  Logout <i className="bi bi-box-arrow-right ms-2"></i>
</Button>

        </Col>

        {/* Main Content Area */}
        <Col lg={9}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-5 bg-white rounded">
              <Outlet />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
