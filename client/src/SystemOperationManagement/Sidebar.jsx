import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUser, faBoxes, faCog, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex' }}>
      {/* Toggle Menu Icon */}
      <div className="menu-icon" style={{ cursor: 'pointer', padding: '15px' }} onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} size="lg" />
      </div>

      {/* Sidebar */}
      {isSidebarVisible && (
        <div className="dashboard" style={{ flex: '0 0 300px', backgroundColor: '#f8f9fa', borderRight: '2px solid #dee2e6', display: 'flex', flexDirection: 'column' }}>
          <h4 className="text-center p-3 bg-dark text-white" style={{ margin: '0' }}>Dashboard</h4>

          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <div className="sidebar-item" style={{ borderBottom: '1px solid #dee2e6', padding: '15px', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faTachometerAlt} size="lg" />
              <span className="ms-2">Dashboard</span>
            </div>
          </Link>

          <Link to="/users" style={{ textDecoration: 'none' }}>
            <div className="sidebar-item" style={{ borderBottom: '1px solid #dee2e6', padding: '15px', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faUser} size="lg" />
              <span className="ms-2">Users</span>
            </div>
          </Link>

          <Link to="/all-packages" style={{ textDecoration: 'none' }}>
            <div className="sidebar-item" style={{ borderBottom: '1px solid #dee2e6', padding: '15px', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faBoxes} size="lg" />
              <span className="ms-2">Packages</span>
            </div>
          </Link>

          <div className="sidebar-item" style={{ borderBottom: '1px solid #dee2e6', padding: '15px' }}>
            <FontAwesomeIcon icon={faCog} size="lg" />
            <span className="ms-2">Settings</span>
          </div>

          <div className="sidebar-item" style={{ padding: '15px' }}>
            <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
            <span className="ms-2">Sign Out</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
