import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
//import './Booking.css'; // Import your CSS file for styling

const Booking = () => {
  const [bookings, setBookings] = useState([]);

  // Function to fetch all bookings
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:3001/api/bookings/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Swal.fire('Error!', 'Failed to fetch bookings.', 'error');
    }
  };

  // useEffect to fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Function to handle booking deletion
  const handleDeleteBooking = async (id) => {
    const confirmDelete = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });

    if (confirmDelete.isConfirmed) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`http://localhost:3001/api/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Deleted!', 'Your booking has been deleted.', 'success');
        fetchBookings(); // Refresh bookings after deletion
      } catch (error) {
        console.error('Error deleting booking:', error);
        Swal.fire('Error!', 'Failed to delete booking.', 'error');
      }
    }
  };

  return (
    <div className="booking-container">
      <h1>All Bookings</h1>
      <table className="booking-table">
        <thead>
          <tr>
            <th>Package ID</th>
            <th>Selected Date</th>
            <th>Payment Method</th>
            <th>Receipt ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.packageId}</td>
                <td>{booking.selectedDate}</td>
                <td>{booking.payment.method}</td>
                <td>{booking.payment.receiptId}</td> {/* Display Receipt ID */}
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteBooking(booking._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No bookings found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Booking;
