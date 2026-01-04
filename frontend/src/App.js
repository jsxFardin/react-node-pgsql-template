import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [studentId, setStudentId] = useState('');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!studentId.trim()) {
      setError('Please enter a student ID');
      return;
    }

    setLoading(true);
    setError(null);
    setStudent(null);

    try {
      const response = await axios.get(`${API_URL}/students/${studentId.trim()}`);
      setStudent(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(`Student with ID "${studentId}" not found. Please try another ID (e.g., STU0001 to STU0100)`);
      } else {
        setError('Error fetching student information. Please try again.');
      }
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatGPA = (gpa) => {
    if (gpa === null || gpa === undefined) return 'N/A';
    const numGPA = typeof gpa === 'string' ? parseFloat(gpa) : gpa;
    if (isNaN(numGPA)) return 'N/A';
    return numGPA.toFixed(2);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>Student Information System</h1>
          <p>Search for student information by Student ID</p>
        </header>

        <form onSubmit={handleSearch} className="search-form">
          <div className="input-group">
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value.toUpperCase())}
              placeholder="Enter Student ID (e.g., STU0001)"
              className="search-input"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="search-button"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {student && (
          <div className="student-card">
            <div className="student-header">
              <h2>{student.first_name} {student.last_name}</h2>
              <span className="student-id">ID: {student.student_id}</span>
            </div>
            
            <div className="student-details">
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{student.email}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{student.phone || 'N/A'}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Date of Birth:</span>
                <span className="detail-value">{formatDate(student.date_of_birth)}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{student.address || 'N/A'}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Major:</span>
                <span className="detail-value">{student.major || 'N/A'}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">GPA:</span>
                <span className="detail-value">{formatGPA(student.gpa)}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Enrollment Date:</span>
                <span className="detail-value">{formatDate(student.enrollment_date)}</span>
              </div>
            </div>
          </div>
        )}

        {!student && !error && !loading && (
          <div className="info-message">
            <p>Enter a Student ID to search (e.g., STU0001, STU0002, ..., STU0100)</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

