import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported only once
import "./App.css";

/* Employee Management Imports */
import CreateUser from "./EmployeeManagement/CreateUser";
import UpdateUser from "./EmployeeManagement/UpdateUser";
import Users from "./EmployeeManagement/Users";
import EmpDashboard from "./EmployeeManagement/Dashboard";
import Attendance from "./EmployeeManagement/Attendance";
import Payments from "./EmployeeManagement/Payments";
import AttendanceRecords from "./EmployeeManagement/AttendanceRecords";
import Login from "./EmployeeManagement/login";

import Services from './ServiceRecordManagement/Services'
import CreateService from './ServiceRecordManagement/CreateService'
import UpdateService from './ServiceRecordManagement/UpdateService'
import ServiceReports from './ServiceRecordManagement/ServiceReports';
import QRCodePage from './ServiceRecordManagement/QRCodePage'
import ServiceDetails from './ServiceRecordManagement/ServiceDetails'
import PartsUsagePieChart from './ServiceRecordManagement/PartsUsagePieChart'
import ServiceDashboard from './ServiceRecordManagement/ServiceDashboard'
import SerDescription from './ServiceRecordManagement/SerDescription'
import ServiceLogin from './ServiceRecordManagement/ServiceLogin';
import PINPage from './ServiceRecordManagement/PINPage'
import Home from './ServiceRecordManagement/Home'
import AboutUs from './ServiceRecordManagement/About';
import ServiceInfographic from './ServiceRecordManagement/ServiceInfographic';
import RevenueAreaChart from './ServiceRecordManagement/RevenueAreaChart';
import PartsUsageTable from './ServiceRecordManagement/PartsUsageTable';
import PartDetails from './ServiceRecordManagement/PartDetails';

/* Appointment Management Imports */
import AppTable from "./AppointmentManagement/AppTable";
import Createappointment from "./AppointmentManagement/Createappointment";
import Updateappointment from "./AppointmentManagement/Updateappointment";

/* Feedback Management Imports */
import AddFeed from "./FeedbackManagment/Addfeedback";
import ManageFeedback from "./FeedbackManagment/Managefeedback";
import FeedbackDashboard from "./FeedbackManagment/Dashboard";
import UpdateFeedback from "./FeedbackManagment/updatefeed";
import AllFeedback from "./FeedbackManagment/Allfeedback";
import Massage from "./FeedbackManagment/massage";
import ManagerView from "./FeedbackManagment/Mangerview";
import FeedbackSummary from "./FeedbackManagment/FeedbackSummery";
import ManagerDashboard from './FeedbackManagment/ManagerDashboard';
import Feedbacksort from './FeedbackManagment/Feedbacksort';

/* Shared Components */
import PackageHeader from "./ServiceRecordManagement/PackageHeader";
import Footer from "./ServiceRecordManagement/Footer";

/* Inventory Management Imports */
import Inventory from "./InventoryManagement/Inventory";
import UpdateItem from "./InventoryManagement/UpdateItem";
import InventoryDashboard from "./InventoryManagement/InventoryDashboard";
import CreateItem from "./InventoryManagement/CreateItem";
import LowInventory from "./InventoryManagement/LowInventory";
import InventorySummary from "./InventoryManagement/Summary"; 

/* System Operation Manager Components */
import AddPackage from "./SystemOperationManagement/AddPackage";
import AllPackages from "./SystemOperationManagement/AllPackages";
import UpdatePackage from "./SystemOperationManagement/UpdatePackage";
import DeletePackage from "./SystemOperationManagement/DeletePackage";
import ViewPackage from "./SystemOperationManagement/ViewPackage";
import ViewAllPackages from "./SystemOperationManagement/ViewAllPackages";
import Register from "./Authentications/Register";
import AdminLogin from "./SystemOperationManagement/Adminauth/AdminLogin";
import AdminRegister from "./SystemOperationManagement/Adminauth/AdminRegister";
import Dashboard from "./SystemOperationManagement/Dashboard";
import AdminDashboard from "./SystemOperationManagement/AdminDashboard";
import AllUsers from "./SystemOperationManagement/AllUsers";
import Payment from "./SystemOperationManagement/Payment";
import ServicePage from "./SystemOperationManagement/ServicePage";
import FeedbackPage from "./SystemOperationManagement/FeedbackPage";
import Profile from "./SystemOperationManagement/Profile";
import BookingPackages from "./SystemOperationManagement/BookingPackages";
import PackageDashboard from "./SystemOperationManagement/PackageDashboard";
import ReceiptTable from "./SystemOperationManagement/ReceiptTable";
//import Booking from './components/Booking';
// import Home from "./SystemOperationManagement/Pages/Home";
import Login2 from "./Authentications/Login2";

/* Supplier Manager Components */
import AddSupplier from "./SupplierManagement/AddSupplier";
import AllSuppliers from "./SupplierManagement/AllSuppliers";
import UpdateSupplier from "./SupplierManagement/UpdateSupplier ";
import DeleteSupplier from "./SupplierManagement/DeleteSupplier";
import SupplierDashboard from "./SupplierManagement/SupplierDashboard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <BrowserRouter>
      <PackageHeader/>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/serviceDashboard' element={<ServiceDashboard />}></Route>
        <Route path='/servicecreate' element={<CreateService />}></Route>
        <Route path='/serviceupdate/:id' element={<UpdateService />}></Route>
        <Route path='/Servicereports' element={<ServiceReports />}></Route>
        <Route path='/serviceeqrCodes' element={<QRCodePage />}></Route>
        <Route path="/service/:vin" element={<ServiceDetails />} />
        <Route path="/servicepartsusage" element={<PartsUsagePieChart />} />
        <Route path="/serviceRecords" element={<Services />} />
        <Route path="/SerDescription" element={<SerDescription />} />
        <Route path="/serviceLogin" element={<ServiceLogin />} />
        <Route path="/PINPage" element={<PINPage />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/ServiceInfographic" element={<ServiceInfographic />} />
        <Route path="/RevenueAreaChart" element={<RevenueAreaChart />} />
        <Route path="/PartsUsageTable" element={<PartsUsageTable />} />
        <Route path="/PartDetails" element={<PartDetails />} />


        <Route path='/empLogin' element={<Login />} /> {/* Login page */}
        <Route path='/dashboard' element={<EmpDashboard />} /> {/* Dashboard as the landing page */}
        <Route path='/users' element={<Users />} />
        <Route path='/create' element={<CreateUser />} />
        <Route path='/update/:id' element={<UpdateUser />} />
        <Route path='/attendance' element={<Attendance />} />
        <Route path='/payments' element={<Payments />} />
        <Route path='/attendanceRecords' element={<AttendanceRecords />} /> {/* New route */}

        <Route path="/AppTable" element={<AppTable />} />
        <Route path="/Createappointment" element={<Createappointment />} />
        <Route path="/Updateappointment/:id" element={<Updateappointment />} />

          {/* Feedback Management Routes */}
          <Route path="/feedbackDashboard" element={<FeedbackDashboard />}>
            <Route path="addFeed" element={<AddFeed />} />
            <Route path="allFeed" element={<AllFeedback />} />
            <Route path="manage" element={<ManageFeedback />} />
            <Route path="massage" element={<Massage />} />
            <Route path="feedUpdate/:id" element={<UpdateFeedback />} />
          </Route>
          <Route path="/managerView" element={<ManagerView />} />
          <Route path="/pages/FeedbackSummary" element={<FeedbackSummary />} />
          <Route path="/feed" element={<AllFeedback />} />
          <Route path="/ManagerDashboard" element={<ManagerDashboard />} />
          <Route path="/Feedbacksort" element={<Feedbacksort />} />

          {/*Inventory Management Routes */}
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventoryupdate/:id" element={<UpdateItem />} /> 
          <Route path="/inventoryDashboard" element={<InventoryDashboard />} />
          <Route path="/inventoryCreate" element={<CreateItem />} />
          <Route path="/low-inventory" element={<LowInventory />} />
          <Route path="/summary" element={<InventorySummary />} />

          {/* System Operation Manager Routes */}
          <Route path="/packageDashboard" element={<PackageDashboard />} />
          <Route path="/view-packages" element={<AllPackages />} />
          <Route path="/add-package" element={<AddPackage />} />
          <Route path="/update-package/:id" element={<UpdatePackage />} />
          <Route path="/delete-package/:id" element={<DeletePackage />} />
          <Route path="/view-package/:id" element={<ViewPackage />} />
          <Route path="/all-packages" element={<ViewAllPackages />} />
          <Route path="/login" element={<Login2 />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/users2" element={<AllUsers />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/bookings" element={<BookingPackages />} />
          <Route path="/package/delete/:id" element={<DeletePackage />} />
          <Route path="/receipt-table" element={<ReceiptTable />} />

          {/* Supplier Manager Routes */}
          <Route path="/supplier/add" element={<AddSupplier />} />{" "}
          <Route path="/supplier/all" element={<AllSuppliers />} />{" "}
          <Route path="/supplier/delete/:id" element={<DeleteSupplier />} />
          <Route path="/supplier/delete/:id" element={<DeleteSupplier />} />
          <Route path="/sdashboard" element={<SupplierDashboard />} />
          
          <Route
            path="/supplier/update/:id"
            element={<UpdateSupplier />}
          />{" "}
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
