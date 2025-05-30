import React, { useEffect, useState } from 'react';

function BatchTable() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBatches() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8000/batches');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBatches(data);
      } catch (error) {
        console.error('Error fetching batches:', error);
        setError('Failed to fetch batches. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchBatches();
    const interval = setInterval(fetchBatches, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {loading && <p>Loading batches...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table className="batch-table">
        <thead>
          <tr>
            <th>Batch ID</th>
            <th>Status</th>
            <th>Volume</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {!loading && batches.length === 0 && !error ? (
            <tr>
              <td colSpan="4">No batches found.</td>
            </tr>
          ) : (
            batches.map((batch) => (
              <tr key={batch.id}>
                <td>{batch.id}</td>
                <td>{batch.status}</td>
                <td>${batch.total_volume.toLocaleString()}</td>
                <td>{new Date(batch.timestamp).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BatchTable;
