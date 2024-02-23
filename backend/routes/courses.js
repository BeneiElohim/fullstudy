//backend/routes/courses.js
const express = require('express');
const router = express.Router();
const { getCourses } = require('../databaseHelper');


const jwt = require('jsonwebtoken');

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


app.get('/api/courses', authMiddleware , async (req, res) => {
  try {
    // Extract user_id from the request; the actual implementation depends on your auth setup
    //const token = jwt.sign({ userId: user.user_id }, 'your_jwt_secret', { expiresIn: '1h' });
    const userId = req.user.userId;
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

module.exports = router;