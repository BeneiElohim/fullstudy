const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');


router.get('/', authMiddleware , async (req, res) => {
    try {
      const userId = req.user.userId;
      const getSubjects = (userId) => {
        return new Promise((resolve, reject) => {
          const sql = 'SELECT * FROM subjects WHERE user_id = ?'; 
          db.all(sql, [userId], (err, rows) => { 
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        });
      };
      const subjects = await getSubjects(userId);
      res.json(subjects);
    } catch (error) {
      res.status(500).send('Server error');
    }
})
  
router.post("/new-subject", authMiddleware, (req, res) => {
    const subject_name  = req.body.subject_name;
    const userId = req.user.userId;
  
    const insertSql = "INSERT INTO subjects (subject_name, user_id) VALUES (?, ?)";
    global.db.run(insertSql, [subject_name, userId], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            message: "success",
            data: {
                id: this.lastID
            }
        });
    });
});


module.exports = router;