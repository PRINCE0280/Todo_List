import { useEffect, useState } from "react";
import "./Todo.css";
import { FaCheckCircle } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";

export const Todo = () => {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem("completedTasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [datetime, setDatetime] = useState("");

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }, [tasks, completedTasks]);

  // Date time updater
  useEffect(() => {
    const interval = setInterval(() => {
      const dt = new Date();
      setDatetime(dt.toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask = {
      title: newTitle,
      description: newDescription,
      id: Date.now()
    };

    setTasks([...tasks, newTask]);
    setNewTitle("");
    setNewDescription("");
  };

  const handleEditTask = (index) => {
    setEditIndex(index);
    setNewTitle(tasks[index].title);
    setNewDescription(tasks[index].description);
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    const updatedTasks = [...tasks];
    updatedTasks[editIndex] = {
      ...updatedTasks[editIndex],
      title: newTitle,
      description: newDescription
    };
    setTasks(updatedTasks);
    setEditIndex(null);
    setNewTitle("");
    setNewDescription("");
  };

  const handleCompleteTask = (index) => {
    const completedTask = {
      ...tasks[index],
      completedOn: new Date().toLocaleString()
    };
    setCompletedTasks([...completedTasks, completedTask]);
    handleDeleteTask(index);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    if(editIndex === index) setEditIndex(null);
  };

  const handleDeleteCompleted = (index) => {
    const updated = completedTasks.filter((_, i) => i !== index);
    setCompletedTasks(updated);
  };

  const handleClearAll = () => {
    setTasks([]);
    setCompletedTasks([]);
  };

  return (
    <div className="todo-container">
      <header>
        <h1>Todo List</h1>
        <div className="date-time">{datetime}</div>
      </header>

      <form className="form" onSubmit={editIndex === null ? handleAddTask : handleUpdateTask}>
        <div className="input-group">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task title"
            required
          />
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Task description"
          />
        </div>
        <button type="submit" className="todo-btn">
          {editIndex === null ? "Add Task" : "Update Task"}
        </button>
      </form>

      <div className="view-switcher">
        <button
          className={`switch-btn ${!isCompleteScreen && "active"}`}
          onClick={() => setIsCompleteScreen(false)}
        >
          Active Tasks
        </button>
        <button
          className={`switch-btn ${isCompleteScreen && "active"}`}
          onClick={() => setIsCompleteScreen(true)}
        >
          Completed Tasks
        </button>
      </div>

      <section className="task-list">
        {!isCompleteScreen ? (
          tasks.map((task, index) => (
            <div className="task-item" key={task.id}>
              <div className="task-content">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
              </div>
              <div className="task-actions">
              <FaCheckCircle 
                 className="button-group"
                  onClick={() => handleCompleteTask(index)}
                  title="Mark Complete"
                />
                <AiOutlineEdit
                  className="icon edit-icon"
                  onClick={() => handleEditTask(index)}
                  title="Edit Task"
                />
                <RiDeleteBin2Fill
                  button className="delete-btn"
                  onClick={() => handleDeleteTask(index)}
                  title="Delete Task"
                />
              </div>
            </div>
          ))
        ) : (
          completedTasks.map((task, index) => (
            <div className="task-item completed" key={task.id}>
              <div className="task-content">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
                <small>Completed: {task.completedOn}</small>
              </div>
              <div className="task-actions">
                <AiOutlineDelete
                  className="icon delete-icon"
                  onClick={() => handleDeleteCompleted(index)}
                  title="Delete Task"
                />
              </div>
            </div>
          ))
        )}
      </section>

      <section className="btn-clear">
        <button className="clear-btn" onClick={handleClearAll}>Clear all</button>
      </section>
    </div>
  );
};