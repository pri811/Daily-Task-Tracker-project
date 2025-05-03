const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Create new task
router.post('/', async (req, res) => {
  const { name, completed, deadline } = req.body;
  const task = new Task({ name, completed, deadline });
  await task.save();
  res.json(task);
});

// Update task
router.put('/:id', async (req, res) => {
  const { name, completed, deadline } = req.body;
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    { name, completed, deadline },
    { new: true }
  );
  res.json(updatedTask);
});

// Delete task
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

module.exports = router;
