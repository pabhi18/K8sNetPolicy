const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./database.js');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3001'  // React dev server runs on 3001 by default when backend is on 3000
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  db.addTask(title, description, (err, id) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id });
  });
});

app.get('/tasks', (req, res) => {
  db.getAllTasks((err, tasks) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(tasks);
  });
});

app.put('/tasks/:id', (req, res) => {
  const { completed } = req.body;
  db.updateTaskStatus(req.params.id, completed, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Task updated' });
  });
});

app.delete('/tasks/:id', (req, res) => {
  db.deleteTask(req.params.id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Task deleted' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
