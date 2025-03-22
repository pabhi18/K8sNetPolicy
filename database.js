const mysql = require('mysql2');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',      
  password: '',      
  database: 'taskmanager'  
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
  
  // Create tasks table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT false
    )
  `;
  
  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating tasks table:', err);
    } else {
      console.log('Tasks table ready');
    }
  });
});

module.exports = {
  addTask: (title, description, callback) => {
    connection.query(
      'INSERT INTO tasks (title, description) VALUES (?, ?)',
      [title, description],
      (err, results) => {
        callback(err, results ? results.insertId : null);
      }
    );
  },
  
  getAllTasks: (callback) => {
    connection.query(
      'SELECT * FROM tasks',
      (err, results) => {
        callback(err, results);
      }
    );
  },
  
  updateTaskStatus: (id, completed, callback) => {
    connection.query(
      'UPDATE tasks SET completed = ? WHERE id = ?',
      [completed, id],
      (err) => {
        callback(err);
      }
    );
  },
  
  deleteTask: (id, callback) => {
    connection.query(
      'DELETE FROM tasks WHERE id = ?',
      [id],
      (err) => {
        callback(err);
      }
    );
  }
};