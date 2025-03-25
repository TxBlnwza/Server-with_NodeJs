import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  Container,
  Navbar,
  Nav,
  NavDropdown
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewConfig from './pages/configs';
import TemperatureLogForm from './pages/Templog';
import ViewLogs from './pages/Viewlogs';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* Navbar สีชมพูอ่อน */}
        <Navbar 
          bg="light" 
          variant="light" 
          expand="lg" 
          sticky="top" 
          collapseOnSelect={false}
          style={{ 
            backgroundColor: '#ffd6e7', // สีชมพูอ่อน
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <Container>
            <Navbar.Brand as={Link} to="/" className="fw-bold fs-4" style={{ color: '#d63384' }}>
              <i className="bi bi-drone me-2"></i>
              Drone Management
            </Navbar.Brand>
            
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto" style={{ fontWeight: '500' }}>
                <Nav.Link 
                  as={Link} 
                  to="/" 
                  className="mx-2 px-3 py-2 text-center"
                  style={{ color: '#d63384' }}
                >
                  <i className="bi bi-gear-fill me-2"></i>
                  View Config
                </Nav.Link>
                
                <Nav.Link 
                  as={Link} 
                  to="/temperature-log" 
                  className="mx-2 px-3 py-2 text-center"
                  style={{ color: '#d63384' }}
                >
                  <i className="bi bi-thermometer-half me-2"></i>
                  Temperature Log
                </Nav.Link>
                
                <Nav.Link 
                  as={Link} 
                  to="/view-logs" 
                  className="mx-2 px-3 py-2 text-center"
                  style={{ color: '#d63384' }}
                >
                  <i className="bi bi-list-check me-2"></i>
                  View Logs
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Main Content */}
        <main className="flex-grow-1 py-4" style={{ backgroundColor: '#fff5f9' }}>
          <Container>
            <Routes>
              <Route path="/" element={<ViewConfig />} />
              <Route path="/temperature-log" element={<TemperatureLogForm />} />
              <Route path="/view-logs" element={<ViewLogs />} />
            </Routes>
          </Container>
        </main>

        {/* Footer สีชมพูอ่อน */}
        <footer className="py-3 mt-auto" style={{ 
          backgroundColor: '#ffd6e7',
          color: '#d63384'
        }}>
          <Container className="text-center">
            <p className="mb-0">© {new Date().getFullYear()} Wuttipat </p>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;