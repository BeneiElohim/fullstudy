const express = require('express');
const router = express.Router();
const multer = require('multer');

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

router.get('/', (req, res) => {
    const studyMaterialsPromise = new Promise((resolve, reject) => {
        // Query to get study materials along with their subject names for user_id = 1235
        const sql = 'SELECT study_materials.*, subjects.subject_name FROM study_materials JOIN subjects ON study_materials.subject_id = subjects.subject_id WHERE study_materials.user_id = 1235';
        global.db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });

    studyMaterialsPromise
        .then(studyMaterials => {
            res.json({
                "message": "success",
                "data": studyMaterials
            });
        })
        .catch(err => {
            res.status(400).json({ "error": err.message });
        });
});


router.post("/new-material", upload.single('file') , (req, res) => {
    const { title, material_type, subject_name, user_id, link_url, notes } = req.body;
    const file_path = req.file ? req.file.path : null; // Assuming the file's field name is 'file'

    // First, find the subject_id corresponding to the given subject_name
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

        // Now, insert the new material using the found subject_id
        const insertSql = "INSERT INTO study_materials (title, material_type, subject_id, user_id, file_path, link_url, notes) VALUES (?, ?, ?, ?, ?, ?, ?)";
        global.db.run(insertSql, [title, material_type, subject_id, user_id, file_path, link_url, notes], function(insertErr) {
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

//create an update route that will take the id of the material and update the title, material_type, subject_id, file_path, link_url, and notes
router.put("/update-material/:id", (req, res) => {
    const { title, material_type, subject, file_path, link_url, notes } = req.body;
    const sql = "UPDATE study_materials SET title = ?, material_type = ?, subject_id = ?, file_path = ?, link_url = ?, notes = ? WHERE material_id = ?";
    global.db.run(sql, [title, material_type, subject, file_path, link_url, notes, req.params.id], function(err) {
        if (err) {
            res.status(400).json({ "error": res.message });
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


router.delete("/delete-material/:id", (req, res) => {
    const sql = "DELETE FROM study_materials WHERE material_id = ?";
    global.db.run(sql, req.params.id, function(err) {
        if (err) {
            res.status(400).json({ "error": res.message });
            return;
        }
        res.json({ message: "deleted", changes: this.changes });
    });
});


module.exports = router;