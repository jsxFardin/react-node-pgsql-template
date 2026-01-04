const pool = require('./db');

// Helper function to generate random data
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomPhone() {
  return `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
}

async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        student_id VARCHAR(50) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        date_of_birth DATE,
        address TEXT,
        major VARCHAR(100),
        gpa DECIMAL(3, 2),
        enrollment_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table created successfully');
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
}

async function seedStudents() {
  try {
    // Clear existing data
    await pool.query('DELETE FROM students');
    console.log('Cleared existing student data');

    // Generate 100 dummy students
    const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Jessica', 'Robert', 'Amanda', 'William', 'Ashley', 'Richard', 'Melissa', 'Joseph', 'Nicole', 'Thomas', 'Michelle', 'Charles', 'Kimberly', 'Daniel', 'Amy', 'Matthew', 'Angela', 'Anthony', 'Lisa', 'Mark', 'Nancy', 'Donald', 'Karen', 'Steven', 'Betty', 'Paul', 'Helen', 'Andrew', 'Sandra', 'Joshua', 'Donna', 'Kenneth', 'Carol', 'Kevin', 'Ruth', 'Brian', 'Sharon', 'George', 'Michelle', 'Timothy', 'Laura', 'Ronald', 'Emily', 'Jason', 'Kimberly', 'Edward', 'Deborah', 'Jeffrey', 'Amy', 'Ryan', 'Angela', 'Jacob', 'Ashley', 'Gary', 'Brenda', 'Nicholas', 'Emma', 'Eric', 'Olivia', 'Jonathan', 'Cynthia', 'Stephen', 'Marie', 'Larry', 'Janet', 'Justin', 'Catherine', 'Scott', 'Frances', 'Brandon', 'Christine', 'Benjamin', 'Samantha', 'Samuel', 'Debra', 'Frank', 'Rachel', 'Gregory', 'Carolyn', 'Raymond', 'Janet', 'Alexander', 'Maria', 'Patrick', 'Heather', 'Jack', 'Diane', 'Dennis', 'Julie', 'Jerry', 'Joyce'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'];
    const majors = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering', 'Business Administration', 'Economics', 'Psychology', 'English Literature'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
    const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA'];
    
    const students = [];
    for (let i = 1; i <= 100; i++) {
      const firstName = randomElement(firstNames);
      const lastName = randomElement(lastNames);
      const studentId = `STU${String(i).padStart(4, '0')}`;
      const city = randomElement(cities);
      const state = randomElement(states);
      const zipCode = Math.floor(Math.random() * 90000) + 10000;
      const streetNum = Math.floor(Math.random() * 9999) + 1;
      const streetName = randomElement(['Main St', 'Oak Ave', 'Park Blvd', 'Elm St', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'First St', 'Second Ave', 'Third St']);
      
      // Generate date of birth (age 18-25)
      const today = new Date();
      const minAge = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
      const maxAge = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      const dateOfBirth = randomDate(minAge, maxAge);
      
      // Generate enrollment date (past 4 years)
      const enrollmentDate = randomDate(new Date(today.getFullYear() - 4, 0, 1), today);
      
      students.push({
        student_id: studentId,
        first_name: firstName,
        last_name: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@university.edu`,
        phone: randomPhone(),
        date_of_birth: dateOfBirth,
        address: `${streetNum} ${streetName}, ${city}, ${state} ${zipCode}`,
        major: randomElement(majors),
        gpa: parseFloat((Math.random() * 2 + 2).toFixed(2)), // GPA between 2.00 and 4.00
        enrollment_date: enrollmentDate
      });
    }

    // Insert students in batches
    const insertQuery = `
      INSERT INTO students (
        student_id, first_name, last_name, email, phone, 
        date_of_birth, address, major, gpa, enrollment_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    for (const student of students) {
      await pool.query(insertQuery, [
        student.student_id,
        student.first_name,
        student.last_name,
        student.email,
        student.phone,
        student.date_of_birth,
        student.address,
        student.major,
        student.gpa,
        student.enrollment_date
      ]);
    }

    console.log(`Successfully seeded ${students.length} students`);
  } catch (error) {
    console.error('Error seeding students:', error);
    throw error;
  }
}

async function main() {
  try {
    await createTable();
    await seedStudents();
    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

main();

