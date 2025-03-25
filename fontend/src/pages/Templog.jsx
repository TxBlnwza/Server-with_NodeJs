import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Container,
  Card,
  Form,
  Button,
  Alert,
  Row,
  Col,
  Badge,
  ListGroup
} from 'react-bootstrap';
import { BsThermometer, BsSave, BsHouse, BsDrone } from 'react-icons/bs'; // เปลี่ยนจาก Bi เป็น Bs (Bootstrap Icons)

const TemperatureLogForm = () => {
  const [temperature, setTemperature] = useState('');
  const [error, setError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const navigate = useNavigate();

  // ใช้ค่าจาก .env
  const API_URL = process.env.REACT_APP_API_URL;
  const DRONE_ID = 65011012;
  const DRONE_NAME = "Wuttipat";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!temperature || isNaN(temperature)) {
      setError('กรุณากรอกอุณหภูมิที่ถูกต้อง');
      return;
    }

    try {
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
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow-sm" style={{ 
            borderRadius: '15px',
            overflow: 'hidden'
          }}>
            <Card.Header className="py-3" style={{ 
              backgroundColor: '#ffd6e7',
              borderBottom: 'none'
            }}>
              <h2 className="mb-0 d-flex align-items-center" style={{ color: '#d63384' }}>
                <BsThermometer className="me-2" size={28} /> {/* เปลี่ยนเป็น BsThermometer */}
                <span>บันทึกอุณหภูมิ Drone</span>
              </h2>
            </Card.Header>
            
            <Card.Body className="p-4" style={{ backgroundColor: '#fff5f9' }}>
              {error && (
                <Alert variant="danger" className="rounded-pill" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              )}

              {submitStatus && (
                <Alert variant="success" className="rounded-pill">
                  {submitStatus}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold" style={{ color: '#d63384' }}>
                    <BsThermometer className="me-2" /> {/* เปลี่ยนเป็น BsThermometer */}
                    อุณหภูมิ (Celsius)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    className="py-2 px-3 border-0 shadow-sm"
                    style={{ borderRadius: '10px' }}
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    required
                  />
                </Form.Group>

                <Card className="mb-4 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                      <span className="fw-bold" style={{ color: '#d63384' }}>Drone ID</span>
                      <Badge pill bg="primary">{DRONE_ID}</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                      <span className="fw-bold" style={{ color: '#d63384' }}>Drone Name</span>
                      <span>{DRONE_NAME}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                      <span className="fw-bold" style={{ color: '#d63384' }}>Country</span>
                      <span>Thailand</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>

                <div className="d-grid gap-3">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="py-2 fw-bold border-0"
                    style={{ 
                      backgroundColor: '#d63384',
                      borderRadius: '10px'
                    }}
                  >
                    <BsSave className="me-2" /> {/* เปลี่ยนเป็น BsSave */}
                    บันทึกข้อมูล
                  </Button>
                  
                  <Button 
                    variant="outline-primary" 
                    className="py-2 fw-bold"
                    style={{ 
                      color: '#d63384',
                      borderColor: '#d63384',
                      borderRadius: '10px'
                    }}
                    onClick={() => navigate('/')}
                  >
                    <BsHouse className="me-2" /> {/* เปลี่ยนเป็น BsHouse */}
                    กลับหน้าหลัก
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TemperatureLogForm;