import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container,
  Card,
  Spinner,
  Alert,
  ListGroup,
  Badge,
  Row,
  Col
} from 'react-bootstrap';
import { 
  BsDeviceSsd,      // For Drone ID (alternative)
  BsLightbulb,      // For Light status
  BsGlobe,          // For Country
  BsClock,          // For timestamp
  BsInfoCircle      // For general info
} from 'react-icons/bs';

const ConfigPage = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const droneId = process.env.REACT_APP_DRONE_ID || 3001;
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/configs/${droneId}`
        );
        setConfig(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching drone config");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ 
      height: '100vh',
      backgroundColor: '#fff5f9'
    }}>
      <Spinner 
        animation="border" 
        style={{ color: '#d63384' }} 
      />
    </Container>
  );

  if (error) return (
    <Container className="mt-5" style={{ backgroundColor: '#fff5f9', minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col md={8}>
          <Alert variant="danger" className="rounded-pill">
            <Alert.Heading style={{ color: '#d63384' }}>Error!</Alert.Heading>
            <p>{error}</p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );

  if (!config) return (
    <Container className="mt-5" style={{ backgroundColor: '#fff5f9', minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col md={8}>
          <Alert variant="warning" className="rounded-pill">
            No configuration found for this drone
          </Alert>
        </Col>
      </Row>
    </Container>
  );

  return (
    <Container className="py-5" style={{ 
      backgroundColor: '#fff5f9',
      minHeight: '100vh'
    }}>
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
                <BsInfoCircle className="me-2" size={28} />
                Drone Configuration
              </h2>
            </Card.Header>
            
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between align-items-center py-3 px-4">
                  <span className="fw-bold d-flex align-items-center" style={{ color: '#d63384' }}>
                    <BsDeviceSsd className="me-2" />
                    Drone ID
                  </span>
                  <Badge pill style={{ 
                    backgroundColor: '#d63384',
                    fontSize: '1rem'
                  }}>
                    {config.drone_id}
                  </Badge>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between align-items-center py-3 px-4">
                  <span className="fw-bold" style={{ color: '#d63384' }}>
                    Drone Name
                  </span>
                  <span>{config.drone_name || 'N/A'}</span>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between align-items-center py-3 px-4">
                  <span className="fw-bold d-flex align-items-center" style={{ color: '#d63384' }}>
                    <BsLightbulb className="me-2" />
                    Light
                  </span>
                  <Badge pill bg={config.light ? 'success' : 'secondary'}>
                    {config.light ? 'ON' : 'OFF'}
                  </Badge>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between align-items-center py-3 px-4">
                  <span className="fw-bold d-flex align-items-center" style={{ color: '#d63384' }}>
                    <BsGlobe className="me-2" />
                    Country
                  </span>
                  <span>{config.country || 'N/A'}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            
            <Card.Footer className="py-2 px-4 d-flex align-items-center" style={{ 
              backgroundColor: '#ffd6e7',
              borderTop: 'none'
            }}>
              <BsClock className="me-2" style={{ color: '#d63384' }} />
              <small style={{ color: '#d63384' }}>
                Last updated: {new Date().toLocaleString()}
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ConfigPage;