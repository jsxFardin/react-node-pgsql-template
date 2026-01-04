const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Get student by student_id
app.get('/api/students/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM students WHERE student_id = $1',
      [studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Student not found',
        message: `No student found with ID: ${studentId}`
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Get all students (optional endpoint)
app.get('/api/students', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT student_id, first_name, last_name, email, major FROM students ORDER BY student_id'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

