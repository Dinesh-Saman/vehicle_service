import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import { Container } from "react-bootstrap"; // Bootstrap container

export default function Massage() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submission = { ...formData };

      const res = await fetch("http://localhost:3001/Mcreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      setPublishError(null);
      console.log("Submission successful");
      alert("Submission successful");
      navigate("");
    } catch (error) {
      setPublishError("An error occurred. Please try again.");
    }
  };

  const steps = [
    {
      id: "1",
      message: "Hello! How can I assist you today?",
      trigger: "2",
    },
    {
      id: "2",
      options: [
        { value: 1, label: "Help with form", trigger: "3" },
        { value: 2, label: "General query", trigger: "4" },
        { value: 3, label: "Type a custom message", trigger: "5" },
      ],
    },
    {
      id: "3",
      message: "To submit the form, type a message in the text box and click Submit.",
      trigger: "endOrRepeat",
    },
    {
      id: "4",
      message: "Feel free to reach out for any other assistance!",
      trigger: "endOrRepeat",
    },
    {
      id: "5",
      message: "Please type your message.",
      trigger: "6",
    },
    {
      id: "6",
      user: true,
      trigger: "checkUserInput",
    },
    {
      id: "checkUserInput",
      message: ({ previousValue }) => {
        const input = previousValue.toLowerCase();

        if (input.includes("i want to contact")) {
          return "Please connect with us: Voice - +947453892334, Email - lavaggio@gmail.com, Facebook - Lavaggio.com. Thank you.";
        } else if (input.includes("how can i book an appointment")) {
          return "Step 1: Create an account\nStep 2: Visit the appointment section\nStep 3: Fill the form with a suitable date\nStep 4: Submit the form\nStep 5: You’re all set! Thank you.";
        } else if (input.includes("how can i get the confirmation message after booking an appointment")) {
          return "You will get a SMS.";
        } else {
          return `You typed: "${previousValue}". How else can I assist you?`;
        }
      },
      trigger: "endOrRepeat",
    },
    {
      id: "endOrRepeat",
      options: [
        { value: 1, label: "Continue conversation", trigger: "2" },
        { value: 2, label: "End conversation", trigger: "7" },
      ],
    },
    {
      id: "7",
      message: "Thank you for chatting with us!",
      end: true,
    },
  ];

  const theme = {
    background: "#f5f8fb",
    headerBgColor: "#ef5350",
    headerFontColor: "#fff",
    headerFontSize: "15px",
    botBubbleColor: "#ef5350",
    botFontColor: "#fff",
    userBubbleColor: "#fff",
    userFontColor: "#4a4a4a",
  };

  return (
<Container fluid className="min-vh-100 position-relative">
  <img
    src="https://images.pexels.com/photos/6894013/pexels-photo-6894013.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    alt="Chat Background"
    className="position-absolute opacity-80 inset-0 w-100 h-100 object-cover"
  />
  <div
    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
  >
    <div
      style={{
        maxHeight: "550px",
        maxWidth: "400px",
        width: "100%",
        padding: "20px",
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        zIndex: 2,
      }}
    >
      <ThemeProvider theme={theme}>
        <ChatBot steps={steps} />
      </ThemeProvider>
    </div>
  </div>
</Container>

  );
}
