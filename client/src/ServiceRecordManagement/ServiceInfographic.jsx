import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2"; // Import Line chart
import axios from "axios";
import { Chart as ChartJS, registerables } from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './ServiceInfographic.css';

ChartJS.register(...registerables);

function ServiceInfographic() {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [completedServicesData, setCompletedServicesData] = useState([]);
  const [inProgressServicesData, setInProgressServicesData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch service data
    axios
      .get("http://localhost:3001/Services")
      .then((result) => {
        const servicesData = result.data;

        // Prepare data for the line chart
        const serviceCount = { completed: {}, inProgress: {} };

        servicesData.forEach(service => {
          const date = new Date(service.date).toLocaleDateString();
          const status = service.status; // Assuming status is a field in your service data

          // Count completed services
          if (status === "completed") {
            serviceCount.completed[date] = (serviceCount.completed[date] || 0) + 1;
          } else if (status === "in-progress") {
            serviceCount.inProgress[date] = (serviceCount.inProgress[date] || 0) + 1;
          }
        });

        // Sort dates and prepare labels and data points
        const allDates = Array.from(new Set([
          ...Object.keys(serviceCount.completed),
          ...Object.keys(serviceCount.inProgress),
        ])).sort();

        const completedCounts = allDates.map(date => serviceCount.completed[date] || 0);
        const inProgressCounts = allDates.map(date => serviceCount.inProgress[date] || 0);

        setLabels(allDates);
        setCompletedServicesData(completedCounts);
        setInProgressServicesData(inProgressCounts);
      })
      .catch((err) => {
        console.error("Failed to fetch service records.", err);
      });
  }, []);

  // Line chart data
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Completed Services",
        data: completedServicesData,
        borderColor: "black",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "black",
        pointBorderColor: "#fff",
      },
      {
        label: "In-Progress Services",
        data: inProgressServicesData,
        borderColor: "darkred", // Dark red line for Completed Services
        backgroundColor: "rgba(139, 0, 0, 0.3)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "darkred",
        pointBorderColor: "#fff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad',
    },
  };

  // Function to download the chart as a PDF
  const downloadPDF = () => {
    const input = document.querySelector('.chart-container');
    const button = document.querySelector('.download-pdf-btn');

    button.style.display = "none";

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("service-infographic.pdf");
      toast.success("Chart downloaded successfully!");
      button.style.display = "block";
    });
  };

  return (
    <div className="infographic-container" style={{ marginTop: "120px" }}>
      <h2>Service Completion Overview</h2>
      
      {/* Dropdown Icon */}
      <div className="dropdown" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <span
          className="dropdown-icon"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          ⋮
        </span>
        
        {/* Dropdown Box */}
        {dropdownOpen && (
          <div className={`dropdown-box ${dropdownOpen ? 'show' : ''}`}>
            <nav>
              <ul>
                <li><a href="/serviceDashboard">Dashboard</a></li>
                <li><a href="/serviceRecords">Services</a></li>
                <li><a href="/Servicereports">Service Reports</a></li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      <div className="chart-container" style={{ position: "relative", width: "100%", height: "400px", marginTop: "20px" }}>
        <Line data={chartData} options={options} /> {/* Render Line chart */}
      </div>
      <button onClick={downloadPDF} className="download-pdf-btn">Download Chart as PDF</button>
      <ToastContainer />
    </div>
  );
}

export default ServiceInfographic;
