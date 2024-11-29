// models/User.js
class User {
  constructor(db) {
      this.db = db;
  }

  createUser (userData, callback) {
      const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      this.db.query(sql, [userData.name, userData.email, userData.password], (err, results) => {
          if (err) return callback(err);
          callback(null, results);
      });
  }

  getAllUsers(callback) {
      const sql = 'SELECT * FROM users';
      this.db.query(sql, (err, results) => {
          if (err) return callback(err);
          callback(null, results);
      });
  }
}

module.exports = User;