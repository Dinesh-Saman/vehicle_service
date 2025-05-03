import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Table, Container } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const BookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch bookings after the payment
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/bookings/'); // Your API URL
        const bookingsData = response.data;

        // Calculate total price
        const total = bookingsData.reduce((acc, booking) => acc + booking.payment.amount, 0);
        setTotalPrice(total);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        Swal.fire('Error!', 'Failed to fetch bookings', 'error');
      }
    };

    fetchBookings();
  }, []);

  // Chart data setup
  const chartData = {
    labels: bookings.map(booking => new Date(booking.selectedDate).toLocaleDateString()),
    datasets: [{
      label: 'Package Prices',
      data: bookings.map(booking => booking.payment.amount),
      borderColor: '#007BFF',
      backgroundColor: 'rgba(0, 123, 255, 0.2)',
      borderWidth: 2,
      tension: 0.3,
    }]
  };

  return (
    <Container>
      <h2 className="text-center my-4">Booking Summary</h2>

      {/* Table Section */}
      <Table striped bordered hover>
        <thead className="bg-primary text-white">
          <tr>
            <th>Package Name</th>
            <th>Booking Date</th>
            <th>Time</th>
            <th>Package Price ($)</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index}>
              <td>{booking.packageName}</td>
              <td>{new Date(booking.selectedDate).toLocaleDateString()}</td>
              <td>{new Date(booking.selectedDate).toLocaleTimeString()}</td>
              <td>${booking.payment.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Total Price Section */}
      <h4 className="text-right">Total Package Prices: ${totalPrice.toFixed(2)}</h4>

      {/* Chart Section */}
      <h3 className="text-center my-4">Package Prices Graph</h3>
      <Line data={chartData} />
    </Container>
  );
};

export default BookingTable;
