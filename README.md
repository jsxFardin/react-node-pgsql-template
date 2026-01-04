# Student Information System

A full-stack application to display student information by Student ID, built with React (frontend), Node.js/Express (backend), and PostgreSQL (database).

## Project Structure

```
.
├── backend/          # Node.js/Express backend
│   ├── db.js        # PostgreSQL connection
│   ├── server.js    # Express server and API routes
│   ├── seed.js      # Database seeding script
│   └── package.json
├── frontend/        # React frontend
│   ├── src/
│   │   ├── App.js   # Main React component
│   │   ├── App.css  # Styles
│   │   └── index.js # Entry point
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE studentdb;

# Exit psql
\q
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example and update with your database credentials)
cp .env.example .env

# Edit .env file with your PostgreSQL credentials:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=studentdb
# DB_USER=postgres
# DB_PASSWORD=your_password
# PORT=5000

# Seed the database with 100 dummy students
npm run seed

# Start the backend server
npm start
# Or for development with auto-reload:
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Get Student by ID
```
GET /api/students/:studentId
```

Example:
```
GET /api/students/STU0001
```

Response:
```json
{
  "id": 1,
  "student_id": "STU0001",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe1@university.edu",
  "phone": "+1-123-456-7890",
  "date_of_birth": "2000-05-15",
  "address": "123 Main St, New York, NY 10001",
  "major": "Computer Science",
  "gpa": 3.75,
  "enrollment_date": "2021-09-01",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Get All Students
```
GET /api/students
```

### Health Check
```
GET /api/health
```

## Student IDs

The database is seeded with 100 students with IDs ranging from:
- `STU0001` to `STU0100`

## Features

- Search for students by Student ID
- Display comprehensive student information
- Modern, responsive UI
- Error handling for invalid Student IDs
- Loading states during API calls

## Technologies Used

- **Frontend**: React 18, Axios
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Styling**: CSS3 with modern design

## Development

To run both frontend and backend simultaneously:

1. Terminal 1: `cd backend && npm run dev`
2. Terminal 2: `cd frontend && npm start`

## Notes

- Make sure PostgreSQL is running before starting the backend
- The frontend is configured to proxy API requests to `http://localhost:5000`
- Student IDs are case-insensitive in the search (automatically converted to uppercase)

