import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Ensure Bootstrap JS is included
import Swal from 'sweetalert2';
import { FaUser, FaEnvelope, FaCar, FaEdit, FaTrashAlt, FaLock, FaCog, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './Pages/styles/Profile.css';

const Profile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatedUsername, setUpdatedUsername] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [updatedVehicleType, setUpdatedVehicleType] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(null);
    const [packageDetails, setPackageDetails] = useState([]);
    const navigate = useNavigate(); // Initialize navigate for navigation

    const getUserIdFromToken = (token) => {
        if (!token) return null;
        try {
            const payload = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payload));
            return decodedPayload.userId;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    const fetchUserProfile = async (userId) => {
        try {
            const token = localStorage.getItem('authToken');
            const userResponse = await axios.get(`http://localhost:3001/api/auth/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserProfile(userResponse.data);
            setUpdatedUsername(userResponse.data.username);
            setUpdatedEmail(userResponse.data.email);
            setUpdatedVehicleType(userResponse.data.vehicleType);

            // Fetch package details
            const packageResponse = await axios.get(`http://localhost:3001/api/bookings/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPackageDetails(packageResponse.data);
        } catch (error) {
            console.error('Error fetching profile data:', error);
            setError(error.response ? error.response.data.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userId = getUserIdFromToken(token);
        if (userId) {
            fetchUserProfile(userId);
        } else {
            setError('No token found. Please log in.');
            setLoading(false);
        }
    }, []);

    const handleDeleteAccount = async () => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirmDelete.isConfirmed) {
            try {
                const token = localStorage.getItem('authToken');
                const userId = getUserIdFromToken(token);
                await axios.delete(`http://localhost:3001/api/auth/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                localStorage.removeItem('authToken');

                Swal.fire('Deleted!', 'Your account has been deleted.', 'success');
                setTimeout(() => window.location.href = '/login', 2000);
            } catch (error) {
                console.error('Error deleting account:', error);
                Swal.fire('Error!', error.response ? error.response.data.message : 'An error occurred', 'error');
            }
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('authToken');
            const userId = getUserIdFromToken(token);
            const formData = {
                username: updatedUsername,
                email: updatedEmail,
                vehicleType: updatedVehicleType,
            };

            await axios.put(`http://localhost:3001/api/auth/users/${userId}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Swal.fire('Success!', 'Profile updated successfully.', 'success');
            fetchUserProfile(userId); // Refresh user profile
            setIsEditing(false); // Exit edit mode after update
        } catch (error) {
            console.error('Error updating profile:', error);
            Swal.fire('Error!', error.response ? error.response.data.message : 'An error occurred', 'error');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('authToken');
            const formData = {
                oldPassword,
                newPassword,
            };

            await axios.put(`http://localhost:3001/api/auth/reset-password`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Swal.fire('Success!', 'Password updated successfully.', 'success');
            setShowResetPassword(false); // Exit reset password mode after update
            setOldPassword('');
            setNewPassword('');
        } catch (error) {
            console.error('Error resetting password:', error);
            Swal.fire('Error!', error.response ? error.response.data.message : 'An error occurred', 'error');
        }
    };

    const handleBookPackage = () => {
        // Navigate to the all-packages page
        navigate('/all-packages'); // Use navigate to redirect
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
            <div className="card profile-card shadow-lg w-100" style={{ maxWidth: "800px" }}>
                {loading ? (
                    <div className="text-center my-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading profile...</p>
                    </div>
                ) : (
                    <>
                        {error && <p className="text-danger text-center">{error}</p>}
                        {userProfile ? (
                            <>
                                <div className="card-header bg-danger text-white text-center">
                                    <h3>User Profile</h3>
                                </div>
                                <div className="card-body">
                                    <div className="dashboard">
                                        <h5 className="dashboard-title">Dashboard</h5>
                                        <div className="dashboard-item">
                                            <FaUser className="icon-color" size={30} />
                                            <h6>{userProfile.username}</h6>
                                        </div>
                                        <div className="dashboard-item">
                                            <FaEnvelope className="icon-color" size={30} />
                                            <h6>{userProfile.email}</h6>
                                        </div>
                                        <div className="dashboard-item">
                                            <FaCar className="icon-color" size={30} />
                                            <h6>{userProfile.vehicleType}</h6>
                                        </div>
                                    </div>

                                    <div className="settings mt-4">
                                        <h5><FaCog /> Settings</h5>
                                        <button className="btn btn-warning mx-2" onClick={() => setIsEditing(true)}><FaEdit /> Edit Profile</button>
                                        <button className="btn btn-danger mx-2" onClick={handleDeleteAccount}><FaTrashAlt /> Delete Account</button>
                                        <button className="btn btn-info mx-2" onClick={() => setShowResetPassword(true)}><FaLock /> Reset Password</button>
                                        <button className="btn btn-success mx-2" onClick={handleBookPackage}><FaPlus /> Book a Package</button> {/* New Book a Package Button */}
                                    </div>

                                    {/* Edit Profile Modal */}
                                    {isEditing && (
                                        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="editProfileModalLabel">Edit Profile</h5>
                                                        <button type="button" className="btn-close" onClick={() => setIsEditing(false)} aria-label="Close"></button>
                                                    </div>
                                                    <form onSubmit={handleUpdateProfile}>
                                                        <div className="modal-body">
                                                            <div className="form-group mb-2">
                                                                <label>Username</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    value={updatedUsername}
                                                                    onChange={(e) => setUpdatedUsername(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="form-group mb-2">
                                                                <label>Email</label>
                                                                <input
                                                                    type="email"
                                                                    className="form-control form-control-sm"
                                                                    value={updatedEmail}
                                                                    onChange={(e) => setUpdatedEmail(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="form-group mb-2">
                                                                <label>Vehicle Type</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    value={updatedVehicleType}
                                                                    onChange={(e) => setUpdatedVehicleType(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Close</button>
                                                            <button type="submit" className="btn btn-primary">Save changes</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Reset Password Modal */}
                                    {showResetPassword && (
                                        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="resetPasswordModalLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="resetPasswordModalLabel">Reset Password</h5>
                                                        <button type="button" className="btn-close" onClick={() => setShowResetPassword(false)} aria-label="Close"></button>
                                                    </div>
                                                    <form onSubmit={handleResetPassword}>
                                                        <div className="modal-body">
                                                            <div className="form-group mb-2">
                                                                <label>Old Password</label>
                                                                <input
                                                                    type="password"
                                                                    className="form-control form-control-sm"
                                                                    value={oldPassword}
                                                                    onChange={(e) => setOldPassword(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="form-group mb-2">
                                                                <label>New Password</label>
                                                                <input
                                                                    type="password"
                                                                    className="form-control form-control-sm"
                                                                    value={newPassword}
                                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" onClick={() => setShowResetPassword(false)}>Close</button>
                                                            <button type="submit" className="btn btn-primary">Reset Password</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Display Booked Packages */}
                                {packageDetails.length > 0 && (
                                    <div className="booked-packages mt-4">
                                        <h5>Booked Packages</h5>
                                        <ul className="list-group">
                                            {packageDetails.map((pkg, index) => (
                                                <li key={index} className="list-group-item">
                                                    <strong>{pkg.packageName}</strong> - Price: ${pkg.price} (Total after discount: ${pkg.totalAfterDiscount}) on {pkg.appointmentDate}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-center">No profile data found.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
