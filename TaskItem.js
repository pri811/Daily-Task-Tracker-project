import React from 'react';

const TaskItem = ({ task, toggleComplete, deleteTask }) => {
  return (
    <li className={task.completed ? 'completed' : ''} style={{ marginBottom: '10px' }}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={toggleComplete}
        style={{ marginRight: '10px' }}
      />
      <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
        {task.name}
      </span>
      <button onClick={deleteTask} style={{ marginLeft: '10px' }}>Delete</button>
    </li>
  );
};

export default TaskItem;
