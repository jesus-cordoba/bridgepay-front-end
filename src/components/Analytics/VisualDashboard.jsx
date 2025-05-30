// 📝 human note: helper function to shorten large numbers like 1,200,000 to 1.2M or 11,000 to 11K
function formatShortNumber(value) {
  if (typeof value !== 'number') value = Number(value);
  if (isNaN(value)) return value;
  if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
  if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K';
  return value.toLocaleString('en-US');
}

// 📝 human note: helper function to format numbers as currency with commas and two decimals
function formatCurrency(value) {
  return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

import React, { useEffect, useState } from "react";
import TimeSelector from '../TimeSelector';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function VisualDashboard() {
  const [statusData, setStatusData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [timeRange, setTimeRange] = useState('24h'); // 📝 human note: keeps track of user-selected time range

  const fetchBatches = async () => {
    try {
      const res = await fetch(`http://localhost:8000/batches?timeRange=${timeRange}`); 
      // 📝 human note: pass timeRange to backend API so it fetches filtered data
      const batches = await res.json();

      // Count status
      const statusSummary = {
        PENDING: 0,
        SETTLED: 0,
        NOT_FOUND: 0,
      };

      // Sum transaction volume
      const volumeSummary = {
        PENDING: 0,
        SETTLED: 0,
        NOT_FOUND: 0,
      };

      batches.forEach((batch) => {
        const status = batch.status;
        const transactions = batch.transactions || [];
        const totalAmount = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

        statusSummary[status] = (statusSummary[status] || 0) + 1;
        volumeSummary[status] = (volumeSummary[status] || 0) + totalAmount;
      });

      const chart1 = Object.entries(statusSummary).map(([status, count]) => ({
        status,
        count,
      }));

      const chart2 = Object.entries(volumeSummary).map(([status, amount]) => ({
        status,
        amount,
      }));

      setStatusData(chart1);
      setVolumeData(chart2);
    } catch (err) {
      console.error("Failed to load batch data:", err);
    }
  };

  useEffect(() => {
    fetchBatches(); // initial load

    const interval = setInterval(() => {
      fetchBatches(); // auto-refresh every 5s
    }, 5000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [timeRange]);

  return (
    <div
      style={{
        backgroundColor: "#1f2937",
        padding: "1rem",
        borderRadius: "8px",
        marginTop: "2rem",
      }}
    >
      <TimeSelector onTimeChange={setTimeRange} />
      {/* 📝 human note: renders the time selection dropdown and updates timeRange on change */}
      <h2 style={{ color: "#f3f4f6", marginBottom: "1rem" }}>
        Batch Status Overview
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={statusData}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="status" stroke="#f3f4f6" />
          <YAxis allowDecimals={false} stroke="#f3f4f6" />
          <Tooltip />
          <Bar dataKey="count" fill="#60a5fa" />
        </BarChart>
      </ResponsiveContainer>

      <h2 style={{ color: "#f3f4f6", marginTop: "2rem", marginBottom: "1rem" }}>
        Transaction Volume by Status
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={volumeData}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="status" stroke="#f3f4f6" />
          <YAxis allowDecimals={false} stroke="#f3f4f6" tickFormatter={formatShortNumber} />
          {/* 📝 human note: applies short number formatting to the Y axis ticks (labels) */}
          <Tooltip formatter={(value) => formatCurrency(value)} />
          {/* 📝 human note: applies currency formatting inside tooltip with commas and two decimals */}
          <Bar dataKey="amount" fill="#34d399" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default VisualDashboard;
