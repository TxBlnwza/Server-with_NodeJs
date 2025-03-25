import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Spinner, Alert, ListGroup, Badge } from 'react-bootstrap';

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
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner animation="border" variant="primary" />
    </Container>
  );

  if (error) return (
    <Container className="mt-5">
      <Alert variant="danger">
        <Alert.Heading>Error!</Alert.Heading>
        <p>{error}</p>
      </Alert>
    </Container>
  );

  if (!config) return (
    <Container className="mt-5">
      <Alert variant="warning">
        No configuration found for this drone
      </Alert>
    </Container>
  );

  return (
    <Container className="mt-5">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h2 className="mb-0">Drone Configuration</h2>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">Drone ID</span>
              <Badge bg="primary" pill>{config.drone_id}</Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">Drone Name</span>
              <span>{config.drone_name || 'N/A'}</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">Light</span>
              <Badge bg={config.light ? 'success' : 'secondary'}>
                {config.light ? 'ON' : 'OFF'}
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">Country</span>
              <span>{config.country || 'N/A'}</span>
            </ListGroup.Item>
            {/* Add more fields as needed */}
          </ListGroup>
        </Card.Body>
        <Card.Footer className="text-muted">
          Last updated: {new Date().toLocaleString()}
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default ConfigPage;