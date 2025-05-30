import React, { useState, useEffect } from 'react';
import './App.css';

// Updated import paths to reflect modular component organization
import BatchTable from './components/Transactions/BatchTable';
import VisualDashboard from './components/Analytics/VisualDashboard';

// NEW: import centralized API functions
// NEW: import the summary fetch function
import { uploadCSV, settleBatch, fetchRecentBatches, fetchSummaryMetrics } from './api/api'; // ✅

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [batchId, setBatchId] = useState(null);  // NEW: store backend batchId
  const [status, setStatus] = useState('Pending');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // NEW: state to store recent batches
  const [recentBatches, setRecentBatches] = useState([]);

  // NEW: state to store summary metrics ✅
  const [summary, setSummary] = useState({
    total_volume: 0,
    success_rate: 0,
    active_batches: 0,
    processing_time: 0,
  }); // ✅

  // NEW: fetch summary metrics on mount ✅
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await fetchSummaryMetrics();
        setSummary(data);  // ✅ store metrics in state
      } catch (error) {
        console.error('Error fetching summary metrics:', error);
      }
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    // NEW: fetch last 5 batches using centralized API function
    const fetchBatches = async () => {
      try {
        const data = await fetchRecentBatches();
        const lastFive = data.slice(-5).reverse();
        setRecentBatches(lastFive);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };

    fetchBatches();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file);
      setSelectedFile(file);
      setStatus('Pending');
      setBatchId(null);  // NEW: reset batchId when new file is selected
    }
  };

  const handleSubmitFile = async () => {
    if (selectedFile) {
      try {
        // Use centralized uploadCSV() API function
        const data = await uploadCSV(selectedFile);
        console.log('Upload success:', data);
        setBatchId(data.batch_id);  // NEW: capture batchId from response
        setStatus(data.status);
        alert(`File uploaded. Batch ID: ${data.batch_id}`);
      } catch (error) {
        console.error('Error during upload:', error);
        alert('Error during upload');
      }
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setBatchId(null);  // NEW: clear batchId
    setStatus('Pending');
  };

  const handleSettle = () => {
    if (batchId) {
      setShowConfirmation(true);
    } else {
      alert('Please upload and submit a file before settling.');
    }
  };

  const confirmSettle = async () => {
    if (!batchId) {
      alert('No batch ID available to settle.');
      return;
    }

    setStatus('Settling...');
    try {
      // Use centralized settleBatch() API function
      const result = await settleBatch(batchId);
      console.log('Settle response:', result);
      if (result.success) {
        setStatus('Settled');
        alert('Batch settled successfully!');
      } else {
        setStatus('Failed');
        alert('Batch settle failed');
      }
    } catch (error) {
      console.error('Error during settle:', error);
      setStatus('Error');
      alert('Error during settle');
    } finally {
      setShowConfirmation(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'SETTLED') return '✅';
    if (status === 'PENDING') return '🕒';
    if (status === 'FAILED') return '❌';
    return '';
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container navbar-content">
          <div className="logo">bridgepay.ai</div>
          <div className="nav-links">
            <button className="btn btn-secondary">Dashboard</button>
            <input
              type="file"
              accept=".csv"
              id="csvUpload"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <button className="btn btn-primary" onClick={() => document.getElementById('csvUpload').click()}>
              Upload CSV
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          <div className="dashboard-header">
            <h1>Transaction Dashboard</h1>
            <p className="text-secondary">Monitor and manage your payment operations</p>
          </div>

          <div className="stats-grid">
            {/* ✅ Replaced hardcoded values with summary state */}
            <div className="stat-card">
              <h3>Total Volume</h3>
              {/* Format total volume as compact, e.g., $1.2M */}
              <p className="stat-value">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(summary.total_volume)}
              </p>
              <p className="stat-change positive">Today</p> {/* ✅ labeled as Today */}
            </div>
            <div className="stat-card">
              <h3>Success Rate</h3>
              <p className="stat-value">{summary.success_rate}%</p> {/* ✅ replaced hardcoded value */}
              <p className="stat-change positive">Today</p>
            </div>
            <div className="stat-card">
              <h3>Settled Batches</h3> {/* ✅ updated label to reflect settled batches */}
              <p className="stat-value">{summary.active_batches}</p> {/* ✅ NOTE: backend now returns settled count in this field */}
              <p className="stat-change neutral">Today</p>
              {/* We now show settled batches here because the backend's active_batches field is updated to count settled batches */}
            </div>
            <div className="stat-card">
              <h3>Processing Time</h3>
              <p className="stat-value">{summary.processing_time}s</p> {/* ✅ replaced hardcoded value */}
              <p className="stat-change negative">Today</p>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="card transactions-card">
              <div className="card-header">
                <h2>Recent Transactions</h2>
                <button className="btn btn-secondary">View All</button>
              </div>
            <div className="transaction-list">
              <table className="recent-transactions-table">
                <thead>
                  <tr>
                    <th>Batch ID</th>
                    <th>Status</th>
                    <th>Transactions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBatches.map((batch) => (
                    <tr key={batch.batch_id}>
                      <td>{batch.batch_id}</td>
                      <td>{getStatusIcon(batch.status)} {batch.status}</td>
                      <td>{batch.transactions.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>

            <div className="card analytics-card">
              <div className="card-header">
                <h2>Analytics Overview</h2>
                <div className="time-filter">
                  <button className="btn btn-secondary active">Day</button>
                  <button className="btn btn-secondary">Week</button>
                  <button className="btn btn-secondary">Month</button>
                </div>
              </div>
              <div className="analytics-content">
                {/* Analytics content will be populated dynamically */}
              </div>
            </div>
          </div>
        </div>
      </main>

      {selectedFile && (
        <div className="banner">
          <p>File ready: {selectedFile.name}</p>
          <p>Status: {status}</p>
          {batchId && <p>Batch ID: {batchId}</p>} {/* NEW: show batchId */}

          <button className="btn btn-success" onClick={handleSubmitFile}>
            Submit File
          </button>
          <button className="btn btn-warning" onClick={handleSettle} disabled={!batchId}>
            Settle
          </button>
          <button className="btn btn-secondary" onClick={handleClearFile}>
            Clear File
          </button>

          {showConfirmation && (
            <div className="confirmation-dialog">
              <p>Final Confirmation to Settle Transactions</p>
              <button className="btn btn-danger" onClick={confirmSettle}>
                Confirm Settle
              </button>
              <button className="btn btn-secondary" onClick={() => setShowConfirmation(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;