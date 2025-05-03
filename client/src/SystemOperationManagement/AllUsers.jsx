import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  Snackbar,
  Typography,
  CircularProgress,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from '../systemoperationmanagement/assets/Levaggio.png';

const API_TOKEN =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmY5NzZiNGM0YzY0YzUzM2Q3YWRkNDUiLCJpYXQiOjE3Mjc2MjY5NjcsImV4cCI6MTczMDIxODk2N30.ckM7DBV0mm5TnN3xlyCtu_Yfw9T_fQIB5AWdg4c74Cw";
const API_URL = "http://localhost:3001/api/auth/users";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a83279"];

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [chartOpen, setChartOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      } catch (error) {
        setAlert({
          open: true,
          message: "Error fetching users",
          severity: "error",
        });
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });
      setUsers(users.filter((user) => user._id !== id));
      setFilteredUsers(filteredUsers.filter((user) => user._id !== id));
      setAlert({
        open: true,
        message: "User deleted successfully",
        severity: "success",
      });
    } catch (error) {
      setAlert({ open: true, message: "Error deleting user", severity: "error" });
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setAlert({
      open: true,
      message: `Viewing ${user.username}'s details`,
      severity: "info",
    });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const vehicleTypeData = users.reduce((acc, user) => {
    const type = user.vehicleType || "Unknown";
    if (!acc[type]) {
      acc[type] = 1;
    } else {
      acc[type]++;
    }
    return acc;
  }, {});

  const weekdayData = users.reduce((acc, user) => {
    const weekday = moment(user.createdAt).format("dddd");
    if (!acc[weekday]) {
      acc[weekday] = 1;
    } else {
      acc[weekday]++;
    }
    return acc;
  }, {});

  const vehicleData = Object.keys(vehicleTypeData).map((key) => ({
    name: key,
    value: vehicleTypeData[key],
  }));

  const weekdayGraphData = Object.keys(weekdayData).map((key) => ({
    name: key,
    users: weekdayData[key],
  }));

  const openCharts = () => setChartOpen(true);
  const closeCharts = () => setChartOpen(false);

  const handleGenerateReport = async () => {
    setReportLoading(true);
    
    setTimeout(() => {
      const doc = new jsPDF();
      
      // Outline the PDF report
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setLineWidth(1);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20); // Draw rectangle with margins
  
      // Add Levaggio logo
      const imgWidth = 40;
      const imgHeight = 40;
      const imgX = (pageWidth - imgWidth) / 2; // Center horizontally
      doc.addImage(logo, 'PNG', imgX, 15, imgWidth, imgHeight, undefined, 'FAST'); // Centered logo
  
      // Title and generated date
      doc.setFontSize(18);
      doc.text('Levaiggo Booking Report', pageWidth / 2, 70, { align: 'center' });
      doc.setFontSize(10);
      const currentDate = new Date().toLocaleDateString();
      doc.text(`Generated on: ${currentDate}`, pageWidth / 2, 80, { align: 'center' });
  
      // Total users and total vehicle types
      const totalUsers = users.length;
      const totalVehicleTypes = Object.keys(vehicleTypeData).length; // Assuming vehicleTypeData is an object where keys are vehicle types
      doc.setFontSize(12);
      doc.text(`Total Users: ${totalUsers}`, 14, 95);
      doc.text(`Total Vehicle Types: ${totalVehicleTypes}`, 14, 105);
  
      // User Registrations by Day
      doc.setFontSize(14);
      doc.text("User Registrations by Day", 14, 125);
      const dayData = Object.keys(weekdayData).map((key) => [key, weekdayData[key]]);
      doc.autoTable({
        startY: 135,
        head: [['Day', 'Number of Users']],
        body: dayData,
      });
  
      // New page for Vehicle Type Distribution
      doc.addPage();
      doc.text("Vehicle Type Distribution", 14, 22);
      const vehicleDataForTable = Object.keys(vehicleTypeData).map((key) => [key, vehicleTypeData[key]]);
      doc.autoTable({
        startY: 32,
        head: [['Vehicle Type', 'Number of Users']],
        body: vehicleDataForTable,
      });
  
      // Save the PDF
      doc.save("user-report.pdf");
  
      // Reset loading state and show success alert
      setReportLoading(false);
      setAlert({
        open: true,
        message: "Report generated successfully",
        severity: "success",
      });
    }, 3000);
  };
  

  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );

    setFilteredUsers(filtered);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", maxHeight: "100vh", overflowY: "auto", marginTop: "80px" }} 
>
      <div className="col-md-8">
        <Paper elevation={5} className="p-4" style={{ backgroundColor: "white", borderRadius: "10px" }}> {/* Rounded corners */}
          <Typography variant="h4" gutterBottom align="center" className="mb-4" style={{ color: "#333" }}>
            User Management
          </Typography>

          <TextField
            label="Search by Username or Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{ style: { borderRadius: '8px' } }} // Rounded input field
          />

          <Typography variant="h6" className="mb-2">
            Total Users: {filteredUsers.length}
          </Typography>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <CircularProgress />
            </div>
          ) : (
            <TableContainer
              component={Paper}
              className="mb-3"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <Table stickyHeader aria-label="sticky table" className="table table-hover table-striped table-bordered">
                <TableHead className="bg-primary text-light">
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Vehicle Type</TableCell>
                    <TableCell>Registered At</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.vehicleType}</TableCell>
                      <TableCell>{moment(user.createdAt).format("MMMM Do YYYY")}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="View">
                          <IconButton color="primary" onClick={() => handleView(user)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="secondary" onClick={() => handleDelete(user._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Button variant="contained" color="primary" onClick={openCharts} style={{ marginRight: '16px' }}>
              View Charts
            </Button>
            <Button variant="contained" color="secondary" onClick={handleGenerateReport}>
              {reportLoading ? <CircularProgress size={24} /> : "Generate Report"}
            </Button>
          </div>
        </Paper>
      </div>

      {/* Charts Dialog */}
      <Dialog open={chartOpen} onClose={closeCharts} fullWidth maxWidth="md">
        <DialogTitle>User Analytics</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Vehicle Type Distribution</Typography>
          <PieChart width={400} height={300}>
            <Pie
              data={vehicleData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {vehicleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip />
          </PieChart>

          <Typography variant="h6">User Registrations by Day</Typography>
          <BarChart width={500} height={300} data={weekdayGraphData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#8884d8" />
          </BarChart>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCharts} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AllUsers;
