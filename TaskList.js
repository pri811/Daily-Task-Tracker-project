import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, toggleComplete, deleteTask }) => {
  return (
    <ul>
      {tasks.map((task, index) => (
        <TaskItem
          key={index}
          task={task}
          toggleComplete={() => toggleComplete(index)}  // Pass the index to toggleComplete
          deleteTask={() => deleteTask(index)}  // Pass the index to deleteTask
        />
      ))}
    </ul>
  );
};

export default TaskList;
