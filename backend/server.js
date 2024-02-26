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

    res.status(201).json({ message: 'User created successfully', userId: newUser.id });
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

////////////MIDDLEWARE/////////////////////
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET); 
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send(error.message);
  }
};

///////COURSES ////////////////////////
app.get('/subjects', authMiddleware , async (req, res) => {
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
    const courses = await getSubjects(userId);
    res.json(courses);
  } catch (error) {
    res.status(500).send('Server error');
  }
})


///////COURSES ////////////////////////
app.get('/assignments', authMiddleware , async (req, res) => {
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
})

////////MATRIALS//////////////////////
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

app.get('/materials', authMiddleware, async (req, res) => {
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


app.post("/materials/new-material", authMiddleware, upload.single('file') , (req, res) => {
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

app.put("/materials/update-material/:id", authMiddleware, upload.single('file'), (req, res) => {
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


app.delete("/materials/delete-material/:id", authMiddleware, (req, res) => {
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

////////////////////SUBJECTS//////////////////////
app.get("/subjects", authMiddleware, (req, res) => {
  const userId = req.user.userId;
  const getSubjectsSql = "SELECT * FROM subjects WHERE user_id = ?";
  global.db.all(getSubjectsSql, [userId], (err, rows) => {
      if (err) {
          res.status(400).json({ "error": err.message });
          return;
      }
      res.json(rows);
  });
});

app.post("/subjects/new-subject", upload.none(), authMiddleware, (req, res) => {
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
}
);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
