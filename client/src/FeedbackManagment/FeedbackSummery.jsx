import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import Chart from 'chart.js/auto';  // Ensure chart.js is auto-registered

export default function FeedbackSummary() {
  const [feedbackData, setFeedbackData] = useState({
    High: 0,
    Medium: 0,
    Low: 0,
    total: 0
  });

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const res = await fetch(`http://localhost:3001/FgetAll`);
        const data = await res.json();
        if (res.ok) {
          // Calculate the number of feedbacks by rating
          const highCount = data.items.filter(item => item.rating === "High").length;
          const mediumCount = data.items.filter(item => item.rating === "Medium").length;
          const lowCount = data.items.filter(item => item.rating === "Low").length;
          const totalCount = data.items.length;

          setFeedbackData({
            High: highCount,
            Medium: mediumCount,
            Low: lowCount,
            total: totalCount
          });
        }
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };

    fetchFeedbackData();
  }, []);

  // Data for the Line Chart
  const data = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Feedback Review Count",
        data: [feedbackData.High, feedbackData.Medium, feedbackData.Low],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        fill: true,
        tension: 0.3, // To make the line smooth
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Feedback Summary (High, Medium, Low)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Show each number incrementally
        },
      },
    },
  };

  return (
    <div className="background d-flex justify-content-center align-items-center">
    <div className="container mt-5">
      <div className="bg-light p-3 rounded shadow-lg" style={{ marginTop:"150px",maxWidth: '1000px', margin: '0 auto' }}>
        <h2 className="text-center mb-3" style={{fontWeight:"bold",marginTop:"15px",color:"#8B0000"}}>Feedback Summary</h2>
        <p className="text-center mb-3">
          Total Feedbacks: <strong>{feedbackData.total}</strong>
        </p>
        <div className="w-300">
          <Line data={data} options={options} />
        </div>
        <Link
          to="/ManagerDashboard"
          className="d-block text-danger text-lg font-weight-bold text-center mt-3"
        >
          Feedback Summary
        </Link>
        {/* New button for viewing feedbacks */}
        <Link
          to="/Feedbacksort"
          className="btn btn-primary d-block text-center mt-4"
        >
          View Feedbacks
        </Link>
      </div>
    </div>
    </div>
  );
}
