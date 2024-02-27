//backend/server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('./databaseHelper');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = '4u2h34uh23423j4h23jk4h2k34ery'
const router = express.Router();

app.use(cors());
app.use(express.json());

const path = require('path');

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


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


app.post('/register', async (req, res) => {
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
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({"token": token});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


///////SUBJECTS ////////////////////////
const subjectsRoutes = require('./routes/subjects')
app.use('/subjects', subjectsRoutes)


///////ASSIGNMENTS ////////////////////////
const assignmentsRoutes = require('./routes/assignments')
app.use('/assignments', assignmentsRoutes)


////////MATRIALS//////////////////////
const materialsRoutes = require('./routes/materials')
app.use('/materials', materialsRoutes)





app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
