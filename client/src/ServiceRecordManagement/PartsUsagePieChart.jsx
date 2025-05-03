import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaGoogle } from 'react-icons/fa'; // Importing React Icons
import backgroundImage from './assets/supercars.png';
import logoImage from './assets/logo.png';
import Swal from 'sweetalert2';

const PieChartPage = () => {
  const [serviceData, setServiceData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/Services")
      .then((result) => setServiceData(result.data))
      .catch((err) => console.log(err));
  }, []);

  const getPartsData = () => {
    const partsUsage = {};
    serviceData.forEach((service) => {
      const part = service.parts;
      const quantity = service.quantity;
      if (partsUsage[part]) {
        partsUsage[part] += quantity;
      } else {
        partsUsage[part] = quantity;
      }
    });

    return {
      labels: Object.keys(partsUsage),
      datasets: [
        {
          data: Object.values(partsUsage),
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
            "#FF9F40", "#8E44AD", "#3498DB", "#E74C3C", "#1ABC9C",
            "#9B59B6", "#F1C40F", "#27AE60", "#D35400", "#2C3E50",
            "#E67E22", "#C0392B", "#BDC3C7", "#34495E", "#2ECC71"
          ],
          hoverBackgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
            "#FF9F40", "#8E44AD", "#3498DB", "#E74C3C", "#1ABC9C",
            "#9B59B6", "#F1C40F", "#27AE60", "#D35400", "#2C3E50",
            "#E67E22", "#C0392B", "#BDC3C7", "#34495E", "#2ECC71"
          ],
        },
      ],
    };
  };

  const downloadPDF = () => {
    const input = document.getElementById("pie-chart-container");
    html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("landscape", "mm", "a4");

        // Adding Header to PDF
        const imgWidth = 120; // Further reduced width to make the chart smaller
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
        const date = new Date().toLocaleDateString();

        // Header background
        pdf.setFillColor(200, 200, 200); // Light grey background
        pdf.rect(0, 0, 297, 60, "F");

        // Set font and font size
        pdf.setFont("Helvetica", "bold"); // Use Helvetica font for headers

        // Add logo
        pdf.addImage(logoImage, "PNG", 10, 10, 40, 40);

        // Add title text with a custom font size
        pdf.setFontSize(24); // Set font size for the title
        pdf.setTextColor(0, 0, 0); // Black color
        pdf.text("The Part Usage of The Services", 60, 30);

        // Add the date on the right corner with smaller font size
        pdf.setFontSize(12); // Set font size for date
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Date: ${date}`, 250, 40);

        // Adding Social Media Icons and text with a custom font size
        pdf.setFontSize(12); // Set font size for the social media links
        pdf.setTextColor(0, 0, 0);

        // Add social media links with icons
        pdf.textWithLink('Facebook', 60, 45, { url: 'https://facebook.com' });
        pdf.addSvgAsImage(<FaFacebookF />, 70, 40, 10, 10); // Add Facebook icon
        pdf.textWithLink('Instagram', 100, 45, { url: 'https://instagram.com' });
        pdf.addSvgAsImage(<FaInstagram />, 110, 40, 10, 10); // Add Instagram icon
        pdf.textWithLink('Google', 140, 45, { url: 'https://google.com' });
        pdf.addSvgAsImage(<FaGoogle />, 150, 40, 10, 10); // Add Google icon

        // Set font for the rest of the document
        pdf.setFont("Helvetica", "normal"); // Use Helvetica normal for body text
        pdf.setFontSize(14); // Set font size for the chart and other content

        // Adding Chart to PDF
        pdf.addImage(imgData, "PNG", 10, 70, imgWidth, imgHeight); // Use the new smaller width

        // Save PDF
        pdf.save("PartsUsageChart.pdf");
    });

    Swal.fire({
      icon: 'success',
      title: 'Downloaded!',
      text: 'Service table PDF downloaded successfully.',
      confirmButtonColor: '#b3202e',
      background: '#fff',
      color: '#333',
    });
};

  return (
    <div
      className="container"
      style={{
        padding: '2rem',
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        color: '#fff',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h2 className="text-center my-4" style={{ color: '#fff', paddingTop: '30px', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
        Parts Usage Pie Chart
      </h2>
      <div className="row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="col-md-6" style={{ display: 'flex', justifyContent: 'center' }}>
          <div id="pie-chart-container" style={{ width: "450px", padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
            <Pie data={getPartsData()} />
          </div>
        </div>
        <div className="col-md-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <ul style={{ listStyleType: 'none', padding: '0', fontSize: '0.9rem', color: '#fff' }}>
            {getPartsData().labels.map((label, index) => (
              <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ width: '15px', height: '15px', backgroundColor: getPartsData().datasets[0].backgroundColor[index], marginRight: '8px' }}></div>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="text-right mt-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn"
          onClick={downloadPDF}
          style={{
            backgroundColor: '#a1192d',
            color: '#fff',
            borderRadius: '0.5rem',
            marginRight: '10px',
          }}
        >
          Download
        </button>
        <button
          className="btn"
          onClick={() => navigate('/Servicereports')}
          style={{
            backgroundColor: '#a1192d',
            color: '#fff',
            borderRadius: '0.5rem',
            marginRight: '10px',
          }}
        >
          Reports
        </button>
        <button
          className="btn"
          onClick={() => navigate('/serviceDashboard')}
          style={{
            backgroundColor: '#a1192d',
            color: '#fff',
            borderRadius: '0.5rem',
          }}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};

export default PieChartPage;
