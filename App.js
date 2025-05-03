import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [notifiedTasks, setNotifiedTasks] = useState([]); // ✅ NEW

  useEffect(() => {
    fetchTasks();

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Initial check after 1 second
    setTimeout(() => {
      notifyOverdue();
    }, 1000);

    const interval = setInterval(() => {
      notifyOverdue();
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:5000/api/tasks');
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title || !dueDate) return alert('Please enter title and due date');
    await axios.post('http://localhost:5000/api/tasks', { title, dueDate });
    setTitle('');
    setDueDate('');
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    setNotifiedTasks(prev => prev.filter(taskId => taskId !== id)); // ✅ Remove from notified list
    fetchTasks();
  };

  const toggleComplete = async (task) => {
    await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
      ...task,
      completed: !task.completed,
    });
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
  };

  const saveEdit = async (id) => {
    await axios.put(`http://localhost:5000/api/tasks/${id}`, {
      title: editTitle,
    });
    setEditingId(null);
    fetchTasks();
  };

  const notifyOverdue = () => {
    const now = new Date();
    tasks.forEach(task => {
      const due = new Date(task.dueDate);
      if (!task.completed && due < now && !notifiedTasks.includes(task._id)) {
        showNotification(`⏰ Task "${task.title}" is overdue!`);
        setNotifiedTasks(prev => [...prev, task._id]); // ✅ Mark as notified
      }
    });
  };

  const showNotification = (message) => {
    if (Notification.permission === "granted") {
      new Notification("🚨 Overdue Task Alert", {
        body: message,
        icon: "https://cdn-icons-png.flaticon.com/512/3986/3986760.png"
      });
    } else {
      alert(message);
    }
  };

  return (
    <div className="container">
      <h1>📋 Daily Task Tracker</h1>
      <div className="form">
        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className={task.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task)}
            />
            {editingId === task._id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <button onClick={() => saveEdit(task._id)}>Save</button>
              </>
            ) : (
              <>
                <span>{task.title}</span>
                <small>Due: {new Date(task.dueDate).toLocaleString()}</small>
                <button onClick={() => startEdit(task)}>Edit</button>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
