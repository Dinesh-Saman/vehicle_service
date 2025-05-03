import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  FormControl,
  Card,
  Image,
  Spinner,
  Alert,
  Badge
} from "react-bootstrap";
import { FaStar, FaSearch, FaCar } from "react-icons/fa";

export default function AllFeedback() {
  const [info, setInfo] = useState([]);
  const [filter, setFilter] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3001/FgetAll`);
        const data = await res.json();
        if (res.ok) {
          setInfo(data.items);
          setFilter(data.items);
        } else {
          setError(data.message || "Failed to fetch feedback.");
        }
      } catch (error) {
        console.error(error.message);
        setError("An unexpected error occurred while fetching feedback.");
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const renderStars = (rating) => {
    let stars = 0;
    if (rating === "High") stars = 5;
    if (rating === "Medium") stars = 3;
    if (rating === "Low") stars = 1;
    return Array.from({ length: stars }, (_, index) => (
      <FaStar key={index} color="#FFD700" className="me-1" />
    ));
  };

  useEffect(() => {
    let filteredData = info;

    if (query.trim() !== "") {
      filteredData = filteredData.filter(
        (feedback) =>
          feedback.name.toLowerCase().includes(query.toLowerCase()) ||
          feedback.descrip.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selectedRating) {
      filteredData = filteredData.filter(
        (feedback) => feedback.rating === selectedRating
      );
    }

    setFilter(filteredData);
  }, [query, selectedRating, info]);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Container>
        <Card className="shadow-lg border-0">
          <Card.Header className="bg-primary text-white py-3">
            <h1 className="text-center mb-0">
              <i className="bi bi-chat-square-text me-2"></i>
              Customer Feedback
            </h1>
          </Card.Header>
          
          <Card.Body className="p-4">
            {/* Search and Filter Row */}
            <Row className="mb-4 g-3">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text className="bg-primary text-white">
                    <FaSearch />
                  </InputGroup.Text>
                  <FormControl
                    placeholder="Search feedback..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={6}>
                <Form.Select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="form-select"
                >
                  <option value="">All Ratings</option>
                  <option value="High">High (★★★★★)</option>
                  <option value="Medium">Medium (★★★)</option>
                  <option value="Low">Low (★)</option>
                </Form.Select>
              </Col>
            </Row>

            {/* Feedback List */}
            {loading ? (
              <div className="d-flex justify-content-center my-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : error ? (
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            ) : filter.length > 0 ? (
              <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                {filter.map((feedback) => (
                  <Card key={feedback._id} className="mb-3 shadow-sm">
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col xs={3} md={2} className="text-center">
                          <Image
                            src={feedback.avatar ? `data:image/jpeg;base64,${feedback.avatar}` : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740"}
                            roundedCircle
                            fluid
                            className="border border-2 border-primary"
                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                          />
                        </Col>
                        <Col xs={9} md={10}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="mb-1 text-primary">{feedback.name}</h5>
                              <div className="mb-2">
                                {renderStars(feedback.rating)}
                                <span className="ms-2 text-muted">{feedback.rating}</span>
                              </div>
                            </div>
                            <Badge bg="secondary" className="d-flex align-items-center">
                              <FaCar className="me-1" /> {feedback.vehicalid}
                            </Badge>
                          </div>
                          <p className="mb-0">{feedback.descrip}</p>
                        </Col>
                      </Row>
                    </Card.Body>
                    <Card.Footer className="text-muted text-end small">
                      {moment(feedback.updatedAt).format("MMMM D, YYYY [at] h:mm A")}
                    </Card.Footer>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert variant="info" className="text-center">
                No feedback matches your criteria.
              </Alert>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}