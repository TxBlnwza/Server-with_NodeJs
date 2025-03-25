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
  const droneId = parseInt(process.env.REACT_APP_DRONE_ID);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${apiUrl}/logs`);
        headers: {
            'Authorization' ; 'Bearer 20250301efx'
        }
        // ตรวจสอบว่ามีข้อมูลและเป็น array
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('รูปแบบข้อมูลไม่ถูกต้อง');
        }

        // กรองและเรียงลำดับข้อมูล
        const filteredLogs = response.data
          .filter(log => log.drone_id === droneId)
          .sort((a, b) => new Date(b.created) - new Date(a.created))
          .slice(0, 25);
        
        setLogs(filteredLogs);
      } catch (err) {
        console.error('Error fetching logs:', err);
        setError(`เกิดข้อผิดพลาด: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [apiUrl, droneId]);

  // ฟังก์ชันจัดรูปแบบวันที่
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('th-TH');
    } catch {
      return dateString; // หากรูปแบบวันที่ไม่ถูกต้อง
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>ประวัติการทำงาน Drone</h2>
        
      </div>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={() => window.location.reload()}
          >
            ลองใหม่
          </button>
        </div>
      ) : (
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
                    <td>{formatDate(log.created)}</td>
                    <td>{log.country || '-'}</td>
                    <td>{log.drone_id || '-'}</td>
                    <td>{log.drone_name || '-'}</td>
                    <td>{log.celsius || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <div className="text-muted">ไม่พบข้อมูลการทำงาน</div>
                    <button 
                      className="btn btn-sm btn-outline-primary mt-2"
                      onClick={() => window.location.reload()}
                    >
                      โหลดใหม่
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewLogs;