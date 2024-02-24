//backend/databaseHelper.js
const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      db.get(sql, [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
};

const createUser = (user) => {
    return new Promise((resolve, reject) => {
      const { full_name, email, password_hash } = user;
      const sql = `INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)`;
  
      db.run(sql, [full_name, email, password_hash], function (err) {
        if (err) reject(err);
        resolve({ id: this.lastID });
      });
    });
};


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

module.exports = { findUserByEmail, createUser };
// , getCourses