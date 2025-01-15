const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'ba0lclihacahtqv4kv8x-mysql.services.clever-cloud.com',
  user: 'uj7tzj9hsq7o3pwe',
  password: 'a2EekrCMOkx3YtHqulga', // Replace with your MySQL password
  database: 'ba0lclihacahtqv4kv8x',       // Replace with your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// API Routes

// Get all data
app.get('/data', (req, res) => {
  const query = 'SELECT * FROM data';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Failed to fetch data' });
    } else {
      res.json(results);
    }
  });
});


app.post('/data', (req, res) => {
    const { timestamp, pm25, pm10, temperature, pressure, humidity } = req.body;
  
    // Log the incoming data for debugging
    console.log(req.body);
  
    // Ensure all fields are provided in the request body
    if (!timestamp || pm25 === undefined || pm10 === undefined || temperature === undefined || pressure === undefined || humidity === undefined) {
      return res.status(400).json({ error: 'All fields (timestamp, pm25, pm10, temperature, pressure, humidity) are required' });
    }
  
    // SQL query with all placeholders
    const query = 'INSERT INTO eco (id, timestamp, pm25, pm10, temperature, pressure, humidity) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
    // Insert data into the database
    db.query(query, [null, timestamp, pm25, pm10, temperature, pressure, humidity], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Failed to save data' });
      } else {
        res.status(201).json({ message: 'Data saved successfully', id: result.insertId });
      }
    });
  });
  





// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
