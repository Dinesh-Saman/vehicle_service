import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ViewPackage = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3001/package/get/${id}`);
        setPkg(response.data.pkg);
      } catch (error) {
        console.error('Error fetching package:', error);
        setError('Failed to load package details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 fs-5 text-muted">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center p-4 bg-light rounded-3 shadow-sm">
          <i className="bi bi-exclamation-octagon text-danger" style={{ fontSize: '3rem' }}></i>
          <h3 className="mt-3 text-danger">Oops!</h3>
          <p className="fs-5">{error}</p>
          <button 
            className="btn btn-outline-primary mt-2"
            onClick={() => window.location.reload()}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <i className="bi bi-package text-muted" style={{ fontSize: '3rem' }}></i>
          <p className="mt-3 fs-5">No package data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header bg-primary text-white py-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h1 className="h3 mb-0">
                    <i className="bi bi-box-seam me-2"></i>
                    {pkg.packageName}
                  </h1>
                  <p className="mb-0 opacity-75">{pkg.category}</p>
                </div>
                <span className="badge bg-white text-primary fs-5 px-3 py-2 rounded-pill">
                  ${pkg.price.toFixed(2)}
                  {pkg.discount > 0 && (
                    <span className="text-danger ms-2 fs-6">
                      <s>${(pkg.price / (1 - pkg.discount / 100)).toFixed(2)}</s>
                      <span className="ms-1">({pkg.discount}% off)</span>
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="card-body p-0">
              <div className="p-4 border-bottom">
                <h3 className="h5 mb-3 text-primary">
                  <i className="bi bi-card-text me-2"></i>Description
                </h3>
                <p className="fs-5">{pkg.description}</p>
              </div>

              <div className="p-4">
                <h3 className="h5 mb-3 text-primary">
                  <i className="bi bi-info-circle me-2"></i>Package Details
                </h3>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-circle bg-light-primary text-primary me-3">
                        <i className="bi bi-clock fs-4"></i>
                      </div>
                      <div>
                        <p className="mb-0 text-muted">Duration</p>
                        <p className="mb-0 fw-bold">{pkg.duration} hours</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-circle bg-light-success text-success me-3">
                        <i className="bi bi-people fs-4"></i>
                      </div>
                      <div>
                        <p className="mb-0 text-muted">Max Customers</p>
                        <p className="mb-0 fw-bold">{pkg.maxCustomers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-circle bg-light-info text-info me-3">
                        <i className="bi bi-check2-circle fs-4"></i>
                      </div>
                      <div>
                        <p className="mb-0 text-muted">Availability</p>
                        <p className={`mb-0 fw-bold ${pkg.availability ? 'text-success' : 'text-danger'}`}>
                          {pkg.availability ? 'Available' : 'Not Available'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-circle bg-light-warning text-warning me-3">
                        <i className="bi bi-star fs-4"></i>
                      </div>
                      <div>
                        <p className="mb-0 text-muted">Category</p>
                        <p className="mb-0 fw-bold text-capitalize">{pkg.category}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .icon-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bg-light-primary { background-color: rgba(13, 110, 253, 0.1); }
        .bg-light-success { background-color: rgba(25, 135, 84, 0.1); }
        .bg-light-info { background-color: rgba(13, 202, 240, 0.1); }
        .bg-light-warning { background-color: rgba(255, 193, 7, 0.1); }
      `}</style>
    </div>
  );
};

export default ViewPackage;