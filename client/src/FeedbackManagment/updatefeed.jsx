import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Form, Button, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UpdateFeed() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { Id } = useParams();


  // Inside UpdateFeed component
const { id } = useParams(); // Changed from Id to id

useEffect(() => {
  const fetchFeedback = async () => {
    try {
      const res = await fetch(`http://localhost:3001/FgetAll?itemId=${id}`);
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        const selected = data.items.find((item) => item._id === id);
        if (selected) {
          setFormData(selected);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchFeedback();
}, [id]); // Changed dependency from Id to id


  // Validation function
  const validate = () => {
    const newErrors = {};

    // Name Validation: No numbers allowed, only letters and spaces
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name can only contain letters and spaces.";
    }

    // Phone Validation: Required, starts with 0, exactly 10 digits, only numbers
    if (!formData.phone || formData.phone.trim() === "") {
      newErrors.phone = "Phone number is required.";
    } else if (!/^0\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must start with 0 and be exactly 10 digits.";
    }

    // Vehicle ID Validation: 2 or 3 letters followed by exactly 4 numbers
    if (!formData.vehicalid || formData.vehicalid.trim() === "") {
      newErrors.vehicalid = "Vehicle ID is required.";
    } else if (!/^([A-Za-z]{2,3})\d{4}$/.test(formData.vehicalid.trim())) {
      newErrors.vehicalid = "Vehicle ID must start with 2 or 3 letters followed by exactly 4 numbers.";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPublishError(null);

    // Perform validation
    if (!validate()) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/Fupdate/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      alert("Feedback updated successfully!");
      navigate(`/managerView`);
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "vehicalid") {
      // Remove any characters that are not letters or numbers
      let sanitizedValue = value.replace(/[^A-Za-z0-9]/g, "");

      // Limit to maximum of 7 characters (3 letters + 4 numbers)
      if (sanitizedValue.length > 7) {
        sanitizedValue = sanitizedValue.slice(0, 7);
      }

      // Update the formData with sanitized value
      setFormData({ ...formData, vehicalid: sanitizedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear the error for the specific field being edited
    setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
  };

  return (
    <div className="m-0 mt-5">
    <div className="background d-flex justify-content-center align-items-center">
      <div className="position-relative w-100 h-100 m-0">
        <img
          src="https://i.pinimg.com/originals/5b/43/2d/5b432d5fb6bfd23190f34488cbcd6d0a.jpg"
          alt="background"
          className="position-absolute w-100 h-100"
          style={{ opacity: 0.4, zIndex: -1, objectFit: "cover" }}
        />
        <div
          className="bg-light rounded shadow-lg p-4"
          style={{
            opacity: 0.9,
            maxWidth: "800px",
            maxHeight: "500px",
            margin: "auto",
            overflowY: "auto",
          }}
        >
          <h1
            className="text-center mb-4"
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: "#8B0000",
            }}
          >
            Update Feedback
          </h1>
          <Form onSubmit={handleSubmit} noValidate>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="name">
                  <Form.Label
                    className="fw-bold"
                    style={{ color: "#8B0000" }}
                  >
                    Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    name="name"
                    onChange={handleChange}
                    value={formData.name || ""}
                    isInvalid={!!errors.name}
                    className="shadow-sm p-3"
                    style={{ borderRadius: "8px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="rating">
                  <Form.Label
                    className="fw-bold"
                    style={{ color: "#8B0000" }}
                  >
                    Rating
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="rating"
                    onChange={handleChange}
                    value={formData.rating || ""}
                    isInvalid={!!errors.rating}
                    className="shadow-sm p-3"
                    style={{ borderRadius: "8px" }}
                  >
                    <option value="">Select</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.rating}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="email">
                  <Form.Label
                    className="fw-bold"
                    style={{ color: "#8B0000" }}
                  >
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    onChange={handleChange}
                    value={formData.email || ""}
                    isInvalid={!!errors.email}
                    className="shadow-sm p-3"
                    style={{ borderRadius: "8px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="vehicalid">
                  <Form.Label
                    className="fw-bold"
                    style={{ color: "#8B0000" }}
                  >
                    Vehicle ID
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Vehicle ID (e.g., KP1234 or CAD1234)"
                    name="vehicalid"
                    onChange={handleChange}
                    value={formData.vehicalid || ""}
                    isInvalid={!!errors.vehicalid}
                    className="shadow-sm p-3"
                    style={{ borderRadius: "8px" }}
                    maxLength={7} // Maximum length based on validation
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.vehicalid}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="phone">
                  <Form.Label
                    className="fw-bold"
                    style={{ color: "#8B0000" }}
                  >
                    Phone
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    maxLength={10}
                    placeholder="Enter your phone number"
                    name="phone"
                    onChange={handleChange}
                    value={formData.phone || ""}
                    isInvalid={!!errors.phone}
                    className="shadow-sm p-3"
                    style={{ borderRadius: "8px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="descrip" className="mb-3">
              <Form.Label
                className="fw-bold"
                style={{ color: "#8B0000" }}
              >
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter feedback description"
                name="descrip"
                onChange={handleChange}
                value={formData.descrip || ""}
                isInvalid={!!errors.descrip}
                className="shadow-sm p-3"
                style={{ borderRadius: "8px" }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.descrip}
              </Form.Control.Feedback>
            </Form.Group>
            <Button
              type="submit"
              variant="danger"
              className="w-100 fw-bold shadow-sm"
              style={{
                padding: "12px",
                borderRadius: "30px",
                fontSize: "16px",
                color: "#000",
              }}
            >
              Update Feedback
            </Button>
          </Form>
          {publishError && (
            <Alert variant="danger" className="mt-3 text-center">
              {publishError}
            </Alert>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
