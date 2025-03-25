import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewConfig = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ดึงค่าจาก .env
  const apiUrl = process.env.REACT_APP_API_URL;
  const droneId = process.env.REACT_APP_DRONE_ID;

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(`${apiUrl}/configs/${droneId}`);
        setConfig(response.data);
        setLoading(false);
      } catch (err) {
        setError(`เกิดข้อผิดพลาด: ${err.message}`);
        setLoading(false);
      }
    };

    fetchConfig();
  }, [apiUrl, droneId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-5">
        {error}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Drone Configuration</h2>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <h5 className="fw-bold">Drone ID:</h5>
              <p className="fs-5">{config?.drone_id || 'N/A'}</p>
            </div>
            <div className="col-md-6">
              <h5 className="fw-bold">Drone Name:</h5>
              <p className="fs-5">{config?.drone_name || 'N/A'}</p>
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <h5 className="fw-bold">Light:</h5>
              <p className="fs-5">{config?.light || 'N/A'}</p>
            </div>
            <div className="col-md-6">
              <h5 className="fw-bold">Country:</h5>
              <p className="fs-5">{config?.country || 'N/A'}</p>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <button 
              onClick={() => navigate('/logs')}
              className="btn btn-success me-2"
            >
              ดู Logs ทั้งหมด
            </button>
            <button 
              onClick={() => navigate('/add-log')}
              className="btn btn-primary"
            >
              เพิ่ม Log ใหม่
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewConfig;