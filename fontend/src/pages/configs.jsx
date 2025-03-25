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
  const droneId = process.env.REACT_APP_DRONE_ID; // จะได้ค่า "3001"

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // เรียก API โดยใช้ droneId จาก .env
        const response = await axios.get(`${apiUrl}/configs/${droneId}`);
        
        // ตรวจสอบว่ามีข้อมูลจริง
        if (!response.data) {
          throw new Error(`ไม่พบการตั้งค่าสำหรับ Drone ID: ${droneId}`);
        }

        setConfig(response.data);
      } catch (err) {
        console.error('Error fetching config:', {
          url: `${apiUrl}/configs/${droneId}`,
          status: err.response?.status,
          error: err.message
        });
        setError(`ไม่สามารถโหลดข้อมูล: ${err.response?.data?.message || err.message}`);
      } finally {
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
        <button 
          className="btn btn-sm btn-outline-danger ms-3"
          onClick={() => window.location.reload()}
        >
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2>การตั้งค่า Drone (ID: {droneId})</h2>
        </div>
        <div className="card-body">
          {config && (
            <div className="row">
              <div className="col-md-6">
                <h5 className="fw-bold">ชื่อ Drone:</h5>
                <p className="fs-5">{config.drone_name || '-'}</p>
              </div>
              <div className="col-md-6">
                <h5 className="fw-bold">ประเทศ:</h5>
                <p className="fs-5">{config.country || '-'}</p>
              </div>
              <div className="col-md-6">
                <h5 className="fw-bold">แสงสว่าง:</h5>
                <p className="fs-5">{config.light || '-'}</p>
              </div>
              <div className="col-md-6">
                <h5 className="fw-bold">สถานะ:</h5>
                <p className="fs-5">{config.status || '-'}</p>
              </div>
            </div>
          )}
          <div className="mt-4">
            <button 
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewConfig;