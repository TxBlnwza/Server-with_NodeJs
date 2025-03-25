import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Table, 
  Spinner, 
  Alert, 
  Button,
  Badge,
  Card
} from 'react-bootstrap';
import { 
  BsClockHistory,
  BsGeoAlt,
  BsCpu,
  BsPerson,
  BsThermometer,
  BsArrowCounterclockwise,
  BsHouse
} from 'react-icons/bs';

const ViewLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;
  const droneId = 65011012;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${apiUrl}/logs`, {
          headers: {
            'Authorization': 'Bearer 20250301efx'
          }
        });

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid data format');
        }

        const filteredLogs = response.data
          .filter(log => log.drone_id === droneId)
          .sort((a, b) => new Date(b.created) - new Date(a.created))
          .slice(0, 25);
        
        setLogs(filteredLogs);
      } catch (err) {
        console.error('Error fetching logs:', err);
        setError(`Error: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [apiUrl, droneId]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('th-TH');
    } catch {
      return dateString;
    }
  };

  return (
    <Container className="py-4 px-3" style={{ 
      backgroundColor: '#fff5f9',
      minHeight: '100vh',
      maxWidth: '100%'
    }}>
      <Card className="border-0 shadow-sm" style={{ 
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <Card.Header className="py-3 px-4" style={{ 
          backgroundColor: '#ffd6e7',
          borderBottom: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0" style={{ 
              color: '#d63384',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              <BsClockHistory className="me-2" size={24} />
              ประวัติการทำงาน Drone
            </h2>
            <Button 
              variant="outline-primary"
              onClick={() => navigate('/')}
              style={{ 
                color: '#d63384',
                borderColor: '#d63384',
                borderRadius: '8px',
                padding: '8px 16px',
                fontWeight: '500'
              }}
            >
              <BsHouse className="me-1" />
              กลับหน้าหลัก
            </Button>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <Spinner animation="border" style={{ 
                color: '#d63384',
                width: '3rem',
                height: '3rem'
              }} />
            </div>
          ) : error ? (
            <div className="px-4 py-3">
              <Alert variant="danger" style={{ 
                borderRadius: '8px',
                border: 'none'
              }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Alert.Heading style={{ 
                      color: '#d63384',
                      fontSize: '1.1rem',
                      marginBottom: '0.5rem'
                    }}>
                      เกิดข้อผิดพลาด!
                    </Alert.Heading>
                    <p className="mb-0">{error}</p>
                  </div>
                  <Button 
                    variant="outline-danger"
                    onClick={() => window.location.reload()}
                    style={{
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontWeight: '500'
                    }}
                  >
                    <BsArrowCounterclockwise className="me-1" />
                    ลองใหม่
                  </Button>
                </div>
              </Alert>
            </div>
          ) : (
            <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <Table hover className="mb-0" style={{ 
                tableLayout: 'fixed',
                marginBottom: '0'
              }}>
                <thead style={{ 
                  backgroundColor: '#ffd6e7',
                  color: '#d63384',
                  position: 'sticky',
                  top: 0
                }}>
                  <tr>
                    <th style={{ width: '25%', padding: '12px 16px' }}>
                      <div className="d-flex align-items-center">
                        <BsClockHistory className="me-2" />
                        วันที่บันทึก
                      </div>
                    </th>
                    <th style={{ width: '20%', padding: '12px 16px' }}>
                      <div className="d-flex align-items-center">
                        <BsGeoAlt className="me-2" />
                        ประเทศ
                      </div>
                    </th>
                    <th style={{ width: '20%', padding: '12px 16px' }}>
                      <div className="d-flex align-items-center">
                        <BsCpu className="me-2" />
                        Drone ID
                      </div>
                    </th>
                    <th style={{ width: '20%', padding: '12px 16px' }}>
                      <div className="d-flex align-items-center">
                        <BsPerson className="me-2" />
                        ชื่อ Drone
                      </div>
                    </th>
                    <th style={{ width: '15%', padding: '12px 16px' }}>
                      <div className="d-flex align-items-center">
                        <BsThermometer className="me-2" />
                        อุณหภูมิ
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length > 0 ? (
                    logs.map((log, index) => (
                      <tr key={index} style={{ backgroundColor: 'white' }}>
                        <td style={{ 
                          padding: '12px 16px',
                          verticalAlign: 'middle',
                          borderBottom: '1px solid #f0f0f0'
                        }}>
                          {formatDate(log.created)}
                        </td>
                        <td style={{ 
                          padding: '12px 16px',
                          verticalAlign: 'middle',
                          borderBottom: '1px solid #f0f0f0'
                        }}>
                          {log.country ? (
                            <Badge pill style={{ 
                              backgroundColor: '#17a2b8',
                              fontSize: '0.85rem',
                              padding: '6px 10px'
                            }}>
                              {log.country}
                            </Badge>
                          ) : '-'}
                        </td>
                        <td style={{ 
                          padding: '12px 16px',
                          verticalAlign: 'middle',
                          borderBottom: '1px solid #f0f0f0'
                        }}>
                          {log.drone_id ? (
                            <Badge pill style={{ 
                              backgroundColor: '#d63384',
                              fontSize: '0.85rem',
                              padding: '6px 10px'
                            }}>
                              {log.drone_id}
                            </Badge>
                          ) : '-'}
                        </td>
                        <td style={{ 
                          padding: '12px 16px',
                          verticalAlign: 'middle',
                          borderBottom: '1px solid #f0f0f0'
                        }}>
                          {log.drone_name || '-'}
                        </td>
                        <td style={{ 
                          padding: '12px 16px',
                          verticalAlign: 'middle',
                          borderBottom: '1px solid #f0f0f0'
                        }}>
                          {log.celsius ? (
                            <Badge pill style={{ 
                              backgroundColor: log.celsius > 30 ? '#dc3545' : '#28a745',
                              fontSize: '0.85rem',
                              padding: '6px 10px'
                            }}>
                              {log.celsius}°C
                            </Badge>
                          ) : '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ 
                        padding: '40px 16px',
                        textAlign: 'center',
                        backgroundColor: 'white'
                      }}>
                        <div style={{ 
                          color: '#6c757d',
                          marginBottom: '16px'
                        }}>
                          ไม่พบข้อมูลการทำงาน
                        </div>
                        <Button 
                          variant="outline-primary"
                          onClick={() => window.location.reload()}
                          style={{
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontWeight: '500'
                          }}
                        >
                          <BsArrowCounterclockwise className="me-1" />
                          โหลดใหม่
                        </Button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ViewLogs;