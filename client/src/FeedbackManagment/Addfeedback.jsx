import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
} from "react-bootstrap";

export default function AddFeedback() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [validation, setValidation] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    validateField(e.target.id, e.target.value.trim());
  };

  const validateField = (field, value) => {
    let errors = { ...validation };

    if (field === "name") {
      const namePattern = /^[a-zA-Z\s]+$/;
      errors.name = value === ""
        ? "Name is required"
        : !namePattern.test(value)
        ? "Name must contain only letters and spaces"
        : null;
    }

    if (field === "rating") {
      errors.rating = value === "" ? "Rating is required" : null;
    }

    if (field === "email") {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      errors.email = value === ""
        ? "Email is required"
        : !emailPattern.test(value)
        ? "Invalid email format"
        : null;
    }

    if (field === "vehicalid") {
      const vehicleIdPattern = /^[A-Za-z]{2,3}[0-9]{1,4}$/;
      errors.vehicalid = value === ""
        ? "Vehicle ID is required"
        : !vehicleIdPattern.test(value)
        ? "Format: 2-3 letters followed by up to 4 digits"
        : null;
    }

    if (field === "phone") {
      const phonePattern = /^0[0-9]{9}$/;
      errors.phone = value === ""
        ? "Phone number is required"
        : !phonePattern.test(value)
        ? "Phone must start with 0 and be 10 digits"
        : null;
    }

    if (field === "descrip") {
      errors.descrip = value === "" ? "Description is required" : null;
    }

    setValidation(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasErrors = Object.values(validation).some((err) => err !== null);
    if (hasErrors) {
      alert("Please fix the validation errors before submitting.");
      return;
    }

    try {
      const submission = { ...formData };
      document.body.setAttribute('data-loading', 'true');

      const res = await fetch("http://localhost:3001/Fcreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Submission failed");

      setPublishError(null);
      alert("Feedback submitted successfully!");
      navigate("/");
    } catch (error) {
      setPublishError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-5" style={{ background: "#f8f9fa", minHeight: "100vh", overflow: "auto" }}>
      <div
        className="position-absolute w-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('https://i.pinimg.com/originals/5b/43/2d/5b432d5fb6bfd23190f34488cbcd6d0a.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
          top: 0,
          bottom: 0,
        }}
      ></div>

      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={9} xl={8}>
            <Card className="p-4 shadow-lg border-0" style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
              <Card.Body>
                <h2 className="text-center mb-4" style={{ color: '#8B0000' }}>
                  <i className="bi bi-chat-dots-fill me-2"></i>Feedback Form
                </h2>
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Form.Group as={Col} md={6} controlId="name">
                      <Form.Label><i className="bi bi-person-fill me-1"></i>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        onChange={handleChange}
                        isInvalid={!!validation.name}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{validation.name}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md={6} controlId="rating">
                      <Form.Label><i className="bi bi-star-fill me-1"></i>Rating</Form.Label>
                      <Form.Control
                        as="select"
                        defaultValue=""
                        onChange={handleChange}
                        isInvalid={!!validation.rating}
                        required
                      >
                        <option value="">Select Rating</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">{validation.rating}</Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">
                    <Form.Group as={Col} md={6} controlId="email">
                      <Form.Label><i className="bi bi-envelope-fill me-1"></i>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        isInvalid={!!validation.email}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{validation.email}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md={6} controlId="vehicalid">
                      <Form.Label><i className="bi bi-car-front-fill me-1"></i>Vehicle ID</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., AB1234"
                        onChange={handleChange}
                        isInvalid={!!validation.vehicalid}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{validation.vehicalid}</Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">
                    <Form.Group as={Col} md={6} controlId="phone">
                      <Form.Label><i className="bi bi-telephone-fill me-1"></i>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., 0123456789"
                        maxLength={10}
                        onChange={handleChange}
                        isInvalid={!!validation.phone}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{validation.phone}</Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  <Form.Group className="mb-4" controlId="descrip">
                    <Form.Label><i className="bi bi-pencil-square me-1"></i>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Enter your feedback"
                      onChange={handleChange}
                      isInvalid={!!validation.descrip}
                      required
                    />
                    <Form.Control.Feedback type="invalid">{validation.descrip}</Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    variant="danger"
                    type="submit"
                    className="w-100 fw-bold rounded-pill"
                    style={{ padding: '12px', fontSize: '17px' }}
                  >
                    Submit Feedback
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
