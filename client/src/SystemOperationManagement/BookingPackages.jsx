import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingPackages = () => {
    const [packages, setPackages] = useState([]); // State for storing booking packages
    const [bookings, setBookings] = useState([]); // State for storing bookings
    const [latestBooking, setLatestBooking] = useState(null); // State for the latest booking
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPackages(); // Fetch all packages
        fetchBookings(); // Fetch initial bookings
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await axios.get('http://localhost:3001/bookings'); // Adjust the endpoint as necessary
            setPackages(response.data);
        } catch (err) {
            setError('Error fetching booking packages: ' + err.message);
            console.error(err);
        }
    };

    const fetchBookings = async () => {
        try {
            const response = await axios.get('http://localhost:3001/bookings/all'); // Fetch all bookings
            setBookings(response.data);
        } catch (err) {
            setError('Error fetching bookings: ' + err.message);
            console.error(err);
        }
    };

    const handleBooking = async (selectedPackage, selectedDate, totalPrice, selectedBank, cardNumber, cvv, expiryDate) => {
        try {
            const bookingData = {
                packageId: selectedPackage._id,
                selectedDate: selectedDate.toISOString(),
                payment: {
                    amount: totalPrice, // Use total price after discount
                    paymentMethod: selectedBank,
                    cardNumber: cardNumber.replace(/\s+/g, ''),
                    cvv: cvv,
                    expiryDate: expiryDate,
                    receiptId: generateReceiptId(), // Function to generate a unique receipt ID
                }
            };

            // Make a POST request to your backend to save the booking
            const response = await axios.post('http://localhost:3001/bookings/add', bookingData);
            if (response.status === 200) {
                console.log('Booking saved successfully:', response.data);
                setLatestBooking(bookingData); // Store the latest booking in the state
                fetchBookings(); // Refresh the list of bookings after adding
            }
        } catch (error) {
            console.error('Error while processing payment and saving booking:', error);
            setError('Error while processing payment: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3001/bookings/${id}`); // Delete booking by ID
            if (response.status === 200) {
                console.log('Booking deleted successfully:', response.data);
                fetchBookings(); // Refresh the list of bookings after deletion
            }
        } catch (err) {
            console.error('Error deleting booking:', err);
            setError('Error deleting booking: ' + err.message);
        }
    };

    const generateReceiptId = () => {
        // Generate a unique receipt ID (can be modified as needed)
        return `RCPT-${Math.random().toString(36).substr(2, 9)}`;
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center">Booking Packages</h1>
            {error && <p className="text-danger">{error}</p>}

            <h2>Your Bookings</h2>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Package ID</th>
                        <th>Selected Date</th>
                        <th>Amount</th>
                        <th>Receipt ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <tr key={booking.receiptId}>
                                <td>{booking.packageId}</td>
                                <td>{new Date(booking.selectedDate).toLocaleDateString()}</td>
                                <td>{booking.payment.amount}</td>
                                <td>{booking.payment.receiptId}</td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(booking._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No bookings available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {latestBooking && (
                <div className="mt-4">
                    <h3>Latest Booking Details</h3>
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th>Package ID</th>
                                <td>{latestBooking.packageId}</td>
                            </tr>
                            <tr>
                                <th>Selected Date</th>
                                <td>{new Date(latestBooking.selectedDate).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <th>Amount</th>
                                <td>{latestBooking.payment.amount}</td>
                            </tr>
                            <tr>
                                <th>Receipt ID</th>
                                <td>{latestBooking.payment.receiptId}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BookingPackages;
