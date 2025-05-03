const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/taskdb')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error(err));

// Mongoose Schema and Model
const taskSchema = new mongoose.Schema({
  title: String,
  dueDate: Date,
  completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

// API Routes

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add new task
app.post('/api/tasks', async (req, res) => {
  const { title, dueDate } = req.body;
  const newTask = new Task({ title, dueDate });
  await newTask.save();
  res.status(201).json(newTask);
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
