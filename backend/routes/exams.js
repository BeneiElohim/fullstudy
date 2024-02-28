const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', authMiddleware , async (req, res) => {
    try {
      const userId = req.user.userId;
      const getExams = (userId) => {
        return new Promise((resolve, reject) => {
          const sql = 'SELECT exams.*, subjects.subject_name FROM exams JOIN subjects ON exams.subject_id = subjects.subject_id WHERE exams.user_id = ?';
          db.all(sql, [userId], (err, rows) => { 
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        });
      };
      const exams = await getExams(userId);
      res.json(exams);
    } catch (error) {
      res.status(500).send('Server error');
    }
});

router.post('/new-exam', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    const { title, subject_name, exam_date, priority, description } = req.body;

    // Validate input data
    if (!title || !subject_name || !exam_date || !priority) {
        return res.status(400).json({ msg: "Please provide title, subject name, due date, and priority for the exam." });
    }

    // Optional: Validate priority
    if (!['High', 'Medium', 'Low'].includes(priority)) {
        return res.status(400).json({ msg: "Priority must be one of 'High', 'Medium', 'Low'." });
    }

    const findSubjectIdSql = "SELECT subject_id FROM subjects WHERE subject_name = ?";

    global.db.get(findSubjectIdSql, [subject_name], (subjectErr, subjectRow) => {
        if (subjectErr) {
            res.status(400).json({ "error": subjectErr.message });
            return;
        }
  
        if (!subjectRow) {
            res.status(404).json({ "error": "Subject not found" });
            return;
        }

        const subject_id = subjectRow.subject_id;

        const insertSql = `INSERT INTO exams (title, subject_id, user_id, exam_date, priority, description) VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(insertSql, [title, subject_id, userId, exam_date, priority, description], function(insertErr) {
            if (insertErr) {
                res.status(400).json({ "error": insertErr.message });
                return;
            }
            res.json({
                "message": "success",
                "data": {
                    "id": this.lastID
                }
            });
        });
    });
});


module.exports = router;