const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const path = require('path');

router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer storage and file filter setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Files will be saved in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Naming the file with a timestamp prefix
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // Accept images and PDFs only
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Not an image or PDF!'), false);
    }
  };
  
  const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // Limit file size to 5MB
  
  router.get('/', authMiddleware, async (req, res) => {
    try{
      const userId = req.user.userId;
      const getMaterials = (userId) => {
        return new Promise((resolve, reject) => {
          const sql = 'SELECT study_materials.*, subjects.subject_name FROM study_materials JOIN subjects ON study_materials.subject_id = subjects.subject_id WHERE study_materials.user_id = ?';
          db.all(sql, [userId], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        });
      };
      const materials = await getMaterials(userId);
      res.json(materials);
    } catch (error) {
      res.status(500).send('Server error');
    }
  });
  
  
router.post("/new-material", authMiddleware, upload.single('file') , (req, res) => {
    const { title, material_type, subject_name, link_url, notes } = req.body;
    const file_path = req.file ? req.file.path : null; 
    const userId = req.user.userId;
  
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
  
        const insertSql = "INSERT INTO study_materials (title, material_type, subject_id, user_id, file_path, link_url, notes) VALUES (?, ?, ?, ?, ?, ?, ?)";
        global.db.run(insertSql, [title, material_type, subject_id, userId, file_path, link_url, notes], function(insertErr) {
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
  
  router.put("/update-material/:id", authMiddleware, upload.single('file'), (req, res) => {
    const { title, material_type, subject_name, link_url, notes } = req.body;
    let file_path = req.file ? req.file.path : null;
  
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
  
        if (!file_path) {
            const getExistingFilePathSql = "SELECT file_path FROM study_materials WHERE material_id = ?";
            global.db.get(getExistingFilePathSql, [req.params.id], (err, row) => {
                if (err) {
                    res.status(400).json({ "error": err.message });
                    return;
                }
                file_path = row ? row.file_path : null;
  
                executeUpdate(title, material_type, subject_id, file_path, link_url, notes, req.params.id, res);
            });
        } else {
            executeUpdate(title, material_type, subject_id, file_path, link_url, notes, req.params.id, res);
        }
    });
  });
  
  function executeUpdate(title, material_type, subject_id, file_path, link_url, notes, material_id, res) {
    const updateSql = "UPDATE study_materials SET title = ?, material_type = ?, subject_id = ?, file_path = ?, link_url = ?, notes = ? WHERE material_id = ?";
    global.db.run(updateSql, [title, material_type, subject_id, file_path, link_url, notes, material_id], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            message: "success",
            data: {
                id: material_id
            }
        });
    });
  }
  
  
  router.delete("/delete-material/:id", authMiddleware, (req, res) => {
    const userId = req.user.userId;
    const materialId = req.params.id;
  
    const deleteSql = "DELETE FROM study_materials WHERE material_id = ? AND user_id = ?";
    global.db.run(deleteSql, [materialId, userId], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        if (this.changes > 0) {
          res.json({ message: "deleted", changes: this.changes });
        } else {
          res.status(404).json({ message: "No material found with the given ID for this user" });
        }
    });
  });

module.exports = router;