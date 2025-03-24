const mysql = require('mysql2');

// Global connection variable
let connection;

// Function to connect with retry
function connectWithRetry() {
  console.log('Attempting to connect to MySQL');

  const conn = mysql.createConnection({
    host: process.env.DB_HOST || 'k8snetpolicy-backend-mysql-service', // ✅ Use environment variable
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'todo_db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password'
  });

  conn.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err.message);
      console.log('Retrying in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
      return;
    }

    console.log('Connected to MySQL database');
    connection = conn;

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
        console.error('Error creating tasks table:', err.message);
      } else {
        console.log('Tasks table is ready');
      }
    });

    // Handle unexpected disconnection
    connection.on('error', (err) => {
      console.error('Database error:', err.message);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Reconnecting to MySQL...');
        connectWithRetry();
      } else {
        throw err;
      }
    });
  });
}

// Delayed initial connection attempt
setTimeout(connectWithRetry, 15000);

module.exports = {
  addTask: (title, description, callback) => {
    if (!connection) {
      return callback(new Error('Database connection not established'), null);
    }

    connection.query(
      'INSERT INTO tasks (title, description) VALUES (?, ?)',
      [title, description],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results.insertId);
      }
    );
  },

  getAllTasks: (callback) => {
    if (!connection) {
      return callback(new Error('Database connection not established'), null);
    }

    connection.query('SELECT * FROM tasks', (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  updateTaskStatus: (id, completed, callback) => {
    if (!connection) {
      return callback(new Error('Database connection not established'));
    }

    connection.query(
      'UPDATE tasks SET completed = ? WHERE id = ?',
      [completed, id],
      (err) => {
        if (err) return callback(err);
        callback(null);
      }
    );
  },

  deleteTask: (id, callback) => {
    if (!connection) {
      return callback(new Error('Database connection not established'));
    }

    connection.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
      if (err) return callback(err);
      callback(null);
    });
  }
};
