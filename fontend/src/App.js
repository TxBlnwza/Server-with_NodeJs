import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewConfig from './pages/configs';
import TemperatureLogForm from './pages/Templog';
import ViewLogs from './pages/Viewlogs';

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Drone Management</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">View Config</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/temperature-log">Temperature Log</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/view-logs">View Logs</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<ViewConfig />} />
          <Route path="/temperature-log" element={<TemperatureLogForm />} />
          <Route path="/view-logs" element={<ViewLogs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;