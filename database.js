const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./tasks.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to the SQLite database.');

    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT 0
    )`, (err) => {
      if (err) {
        console.error('Error creating tasks table', err);
      }
    });
  }
});

module.exports = {
  addTask: (title, description, callback) => {
    db.run('INSERT INTO tasks (title, description) VALUES (?, ?)', 
      [title, description], 
      function(err) {
        callback(err, this.lastID);
      }
    );
  },

  getAllTasks: (callback) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
      callback(err, rows);
    });
  },

  updateTaskStatus: (id, completed, callback) => {
    db.run('UPDATE tasks SET completed = ? WHERE id = ?', 
      [completed, id], 
      (err) => {
        callback(err);
      }
    );
  },

  deleteTask: (id, callback) => {
    db.run('DELETE FROM tasks WHERE id = ?', id, (err) => {
      callback(err);
    });
  }
};