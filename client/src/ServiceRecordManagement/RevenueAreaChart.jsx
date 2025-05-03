import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CSSTransition } from "react-transition-group"; // Import for transitions
import './RevenueAreaChart.css'; // Import CSS styles

const RevenueAreaChart = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [showChart, setShowChart] = useState(false); // State for chart visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Services");
        const services = response.data;

        const revenueMap = {};
        services.forEach((service) => {
          const date = new Date(service.date).toLocaleDateString();
          const price = service.price;

          if (revenueMap[date]) {
            revenueMap[date] += price;
          } else {
            revenueMap[date] = price;
          }
        });

        const labelsArray = Object.keys(revenueMap);
        const dataArray = Object.values(revenueMap);

        setLabels(labelsArray);
        setRevenueData(dataArray);
        setShowChart(true); // Show chart after data is fetched
      } catch (error) {
        console.error("Error fetching services data", error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Total Revenue Generated (LKR)',
        data: revenueData,
        backgroundColor: 'rgba(179, 32, 46, 0.6)',
        borderColor: 'rgba(179, 32, 46, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(179, 32, 46, 0.8)', // Hover color change
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 20,
          boxHeight: 20,
        },
      },
      title: {
        display: true,
        text: 'Cumulative Revenue Growth Over Days',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(50, 50, 50, 0.8)', // Tooltip background color
        titleFont: {
          size: 16,
          family: 'Poppins', // Font for tooltip title
        },
        bodyFont: {
          size: 14,
          family: 'Poppins', // Font for tooltip body
        },
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue (LKR)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
    animation: {
      duration: 2000, // Animation duration in milliseconds
      easing: 'easeInOutBounce', // Type of easing
    },
    hover: {
      animationDuration: 1000, // Animation on hover
    },
    layout: {
      padding: {
        left: 50,
        right: 50,
        top: 50,
        bottom: 50,
      },
    },
  };

  const downloadPDF = () => {
    const input = document.getElementById('chart');
    const button = document.getElementById('downloadButton');

    button.style.visibility = 'hidden'; // Hide button before download

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'px', 'a4');

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('chart.pdf');

      button.style.visibility = 'visible'; // Show button again after download
    });
  };

  return (
    <div className="revenue-chart-container">
      <h2 className="revenue-chart-title">
        Total Revenue Generated (LKR)
      </h2>
      <CSSTransition
        in={showChart}
        timeout={500}
        classNames="fade" // Use the fade class for animation
        unmountOnExit
      >
        <div style={{ height: '600px', width: '1000px' }} id="chart">
          <Bar data={data} options={options} />
        </div>
      </CSSTransition>
      <button 
        className="revenue-download-button" 
        onClick={downloadPDF} 
        id="downloadButton" // Added ID for the button
      >
        Download Chart as PDF
      </button>
    </div>
  );
};

export default RevenueAreaChart;
