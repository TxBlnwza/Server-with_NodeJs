import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewConfig from './pages/p1';


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
                  <Link className="nav-link" to="/logs">Drone Logs</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add-log">Add New Log</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<ViewConfig />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;