import React, { useState } from "react";

function TaskForm({ addTask }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Work");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTask(text, category);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Enter task..." 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Urgent">Urgent</option>
      </select>
      <button type="submit">Add</button>
    </form>
  );
}

export default TaskForm;
