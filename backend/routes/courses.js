//backend/routes/courses.js
const express = require('express');
const router = express.Router();
const { getCourses } = require('../databaseHelper');


const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Assuming the token is sent in the Authorization header
    const decoded = jwt.verify(token, 'YOUR_SECRET_KEY'); // Replace 'YOUR_SECRET_KEY' with your actual secret key
    req.user = decoded; // Add the decoded token payload to the request object
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};


router.get('/',authMiddleware , async (req, res) => {
  try {
    // Extract user_id from the request; the actual implementation depends on your auth setup
    const userId = req.user.user_id; // Assuming req.user contains the authenticated user's info
    const courses = await getCourses(userId);
    res.json(courses);
  } catch (error) {
    res.status(500).send('Server error');
  }
})


module.exports = router;