import React, { useState, useEffect } from 'react';
import './index.css'; // Ensure this file is inside src/

function Dashboard() {
  const [task, setTask] = useState('');
  const [dueDateTime, setDueDateTime] = useState('');
  const [tasks, setTasks] = useState([]);
  const [notification, setNotification] = useState('');

  const addTask = () => {
    if (!task || !dueDateTime) {
      alert('Please enter task and due date');
      return;
    }

    const newTask = {
      id: Date.now(),
      text: task,
      dueDateTime,
      completed: false,
      editing: false
    };

    setTasks([...tasks, newTask]);
    setTask('');
    setDueDateTime('');
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, editing: true } : task
      )
    );
  };

  const saveTask = (id, newText, newDueDateTime) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, text: newText, dueDateTime: newDueDateTime, editing: false }
          : task
      )
    );
  };

  // Overdue Task Notification Logic (checks every 60 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const overdue = tasks.filter(
        (task) => !task.completed && new Date(task.dueDateTime) < now
      );
      if (overdue.length > 0) {
        setNotification(`⚠️ ${overdue.length} task(s) are overdue!`);
      } else {
        setNotification('');
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="container">
      <h2>📝 Daily Task Tracker</h2>
      {notification && <div className="notification">{notification}</div>}
      <div className="form-container">
        <input
          type="text"
          placeholder="Enter Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <input
          type="datetime-local"
          value={dueDateTime}
          onChange={(e) => setDueDateTime(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task.id)}
            />
            {task.editing ? (
              <>
                <input
                  type="text"
                  defaultValue={task.text}
                  onChange={(e) => (task.newText = e.target.value)}
                />
                <input
                  type="datetime-local"
                  defaultValue={task.dueDateTime}
                  onChange={(e) => (task.newDueDateTime = e.target.value)}
                />
                <button
                  onClick={() =>
                    saveTask(
                      task.id,
                      task.newText || task.text,
                      task.newDueDateTime || task.dueDateTime
                    )
                  }
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                  }}
                >
                  {task.text} (Due: {new Date(task.dueDateTime).toLocaleString()})
                </span>
                <button onClick={() => editTask(task.id)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
