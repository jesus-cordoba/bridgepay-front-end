import React, { useState } from 'react';

/**
 * TimeSelector Component
 * ----------------------
 * Lets the user pick a time range (e.g., last hour, last 24h, last 7 days).
 * On change, it calls the parent’s onTimeChange() with the selected range.
 */

export default function TimeSelector({ onTimeChange }) {
    const [selectedRange, setSelectedRange] = useState('24h');

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedRange(value);
        onTimeChange(value);  // 🔗 Pass to parent
    };

    return (
        <div className="time-selector">
            <label htmlFor="timeRange">Select Time Range: </label>
            <select id="timeRange" value={selectedRange} onChange={handleChange}>
                <option value="1h">Last 1 hour</option>
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
            </select>
        </div>
    );
}