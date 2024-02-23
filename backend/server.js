//backend/server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('./databaseHelper');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// items in the global namespace are accessible throught out the node application
global.db = new sqlite3.Database('./database.db', function (err) {
  if (err) {
    console.error(err);
    process.exit(1); //Bail out we can't connect to the DB
  } else {
    console.log('Database connected');
    global.db.run('PRAGMA foreign_keys=ON'); //This tells SQLite to pay attention to foreign key constraints
  }
});


app.post('/api/register', async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await createUser({ full_name, email, password_hash });

    res.status(201).json({ message: 'User created successfully', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.user_id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// const courseRoute = require('./routes/courses');
// app.use('/api/courses', courseRoute);



const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Assuming the token is sent in the Authorization header
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace 'YOUR_SECRET_KEY' with your actual secret key
    req.user = decoded; // Add the decoded token payload to the request object
    next();
  } catch (error) {
    res.status(401).send(error.message);
  }
};


app.get('/api/courses',authMiddleware , async (req, res) => {
  try {
    // Extract user_id from the request; the actual implementation depends on your auth setup
    const userId = req.user.user_id; // Assuming req.user contains the authenticated user's info
    const getCourses = (userId) => {
      return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM courses WHERE user_id = ?'; // SQL query with a placeholder for user_id
        db.all(sql, [userId], (err, rows) => { // Pass userId as the parameter to fill the placeholder
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    };
    const courses = await getCourses(userId);
    res.json(courses);
  } catch (error) {
    res.status(500).send('Server error');
  }
})
//


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
