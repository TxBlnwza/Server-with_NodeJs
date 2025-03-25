import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const TemperatureLogForm = () => {
  const [temperature, setTemperature] = useState('');
  const [error, setError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const navigate = useNavigate();

  // ใช้ค่าจาก .env
  const API_URL = process.env.REACT_APP_API_URL;
  const DRONE_ID = process.env.REACT_APP_DRONE_ID;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!temperature || isNaN(temperature)) {
      setError('กรุณากรอกอุณหภูมิที่ถูกต้อง');
      return;
    }

    try {
      // ส่งเฉพาะ celsius อย่างเดียว ตามที่ API ต้องการ
      await axios.post(
        `${API_URL}/logs`,
        { celsius: parseFloat(temperature) },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setSubmitStatus('บันทึกข้อมูลสำเร็จ!');
      setTemperature('');
      setTimeout(() => {
        navigate('/logs');
      }, 1500);
    } catch (err) {
      setError(`เกิดข้อผิดพลาด: ${err.response?.data?.error || err.message}`);
      console.error('Error details:', err.response);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">บันทึกอุณหภูมิ Drone</h2>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {submitStatus && (
            <div className="alert alert-success" role="alert">
              {submitStatus}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="temperature" className="form-label">
                อุณหภูมิ (Celsius)
              </label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                id="temperature"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <p><strong>Drone ID:</strong> {DRONE_ID}</p>
              <p><strong>Drone Name:</strong> Wuttipat </p>
              <p><strong>Country:</strong> Thailand</p>
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                บันทึกข้อมูล
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                กลับหน้าหลัก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TemperatureLogForm;