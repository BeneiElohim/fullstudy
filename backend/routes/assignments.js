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

router.post('/new-assignment', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming the user's ID is available from the authMiddleware
        const { title, subject_id, due_date, priority, description } = req.body;

        // Validate input data
        if (!title || !due_date || !priority) {
            return res.status(400).json({ msg: "Please provide title, due date, and priority for the assignment." });
        }

        // Optional: Validate priority
        if (!['High', 'Medium', 'Low'].includes(priority)) {
            return res.status(400).json({ msg: "Priority must be one of 'High', 'Medium', 'Low'." });
        }

        const addAssignment = (title, subject_id, user_id, due_date, priority, description) => {
            return new Promise((resolve, reject) => {
                const sql = `INSERT INTO assignments (title, subject_id, user_id, due_date, priority, description) VALUES (?, ?, ?, ?, ?, ?)`;
                db.run(sql, [title, subject_id, user_id, due_date, priority, description], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        // "this" refers to the statement object, and this.lastID refers to the ID of the last inserted row
                        resolve(this.lastID);
                    }
                });
            });
        };

        const assignmentId = await addAssignment(title, subject_id, userId, due_date, priority, description);
        res.status(201).json({ msg: "Assignment added successfully", assignmentId: assignmentId });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


module.exports = router;