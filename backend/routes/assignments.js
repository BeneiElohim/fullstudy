const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', authMiddleware , async (req, res) => {
    try {
      const userId = req.user.userId;
      const getAssignments = (userId) => {
        return new Promise((resolve, reject) => {
          const sql = 'SELECT * FROM assignments WHERE user_id = ?';
          db.all(sql, [userId], (err, rows) => { 
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        });
      };
      const assignments = await getAssignments(userId);
      res.json(assignments);
    } catch (error) {
      res.status(500).send('Server error');
    }
});

module.exports = router;