import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { io } from 'socket.io-client';
import './CallListTable.css';
import { fetchCallList } from './callService';
const getStatusIcon = (status) => {
  const iconMap = {
    Success: '✅',
    Suspicious: '⚠️',
    Failure: '❌',
    Safe: '🛡️',
    'High Risk': '🔥'
  };
  return (
    <div className="status-icon">
      {iconMap[status] || '❓'} {status}
    </div>
  );
};

const getMatchCircle = (value) => {
    const numericValue = parseInt(value.replace('%', ''));
    const radius = 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - numericValue / 100);

    let color = '#e74c3c'; // Default Red (for < 70)

if (numericValue >= 85) {
  color = '#2ecc71'; // Green
} else if (numericValue >= 75 && numericValue < 85) {
  color = '#f1c40f'; // Yellow
} 

    return (
      <div className="match-circle-wrapper">
        <svg className="match-ring" width="24" height="24">
          <circle
            className="match-ring-bg"
            cx="12"
            cy="12"
            r={radius}
            stroke="#ecf0f1"
            strokeWidth="3"
            fill="none"
          />
          <circle
            className="match-ring-fg"
            cx="12"
            cy="12"
            r={radius}
            stroke={color}
            strokeWidth="3"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="match-percent-text">{value}</span>
      </div>
    );
  };


const columns = [
  { field: 'callerId', headerName: 'Caller ID', width: 120 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'phoneNumber', headerName: 'Phone Number', width: 160 },
  { field: 'callDuration', headerName: 'Call Duration', width: 130 },
  { field: 'callTime', headerName: 'Call Time', width: 180 },
  {
  field: 'percentageMatch',
  headerName: 'Match %',
  width: 120,
  renderCell: (params) => getMatchCircle(params.value)
},
{
  field: 'voiceAuthentication',
  headerName: 'Voice Auth',
  width: 160,
  renderCell: (params) => {
    const matchValue = parseInt(params.row.percentageMatch.replace('%', ''));
    const status = matchValue >= 85 ? 'Success' : 'Failure';
    return getStatusIcon(status);
  }
},
  {
    field: 'phoneValidation',
    headerName: 'Phone Validation',
    width: 160,
    renderCell: (params) => getStatusIcon(params.value)
  }
];

export default function CallListTable() {
  const [rows, setRows] = useState([]);

useEffect(() => {
  // Load existing data once
  fetchCallList().then((data) => {
    const formatted = data.map((item, index) => ({ id: index + 1, ...item }));
    setRows(formatted);
  });
}, []);



  return (
    <div className="table-container">
      <h3>📋 Voice Recognition Dashboard</h3>
<DataGrid
  rows={rows}
  columns={columns}
  pageSize={10}
  rowsPerPageOptions={[10]}
  style={{ height: 600, width: '100%' }} // fixed height
/>
    </div>
  );
}