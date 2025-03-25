import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ดึงค่าจาก .env
  const apiUrl = process.env.REACT_APP_API_URL;
  const droneId = process.env.REACT_APP_DRONE_ID;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${apiUrl}/logs`);
        
        // กรองและเรียงลำดับข้อมูล
        const filteredLogs = response.data
          .filter(log => log.drone_id === Number(droneId))
          .sort((a, b) => new Date(b.created) - new Date(a.created))
          .slice(0, 25);
        
        setLogs(filteredLogs);
        setLoading(false);
      } catch (err) {
        setError(`เกิดข้อผิดพลาด: ${err.message}`);
        setLoading(false);
      }
    };

    fetchLogs();
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
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>ประวัติการทำงาน Drone</h2>
        <Link to="/" className="btn btn-primary">
          กลับหน้าหลัก
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>วันที่บันทึก</th>
              <th>ประเทศ</th>
              <th>Drone ID</th>
              <th>ชื่อ Drone</th>
              <th>อุณหภูมิ (°C)</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <tr key={index}>
                  <td>{new Date(log.created).toLocaleString()}</td>
                  <td>{log.country}</td>
                  <td>{log.drone_id}</td>
                  <td>{log.drone_name}</td>
                  <td>{log.celsius}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">ไม่พบข้อมูล</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewLogs;