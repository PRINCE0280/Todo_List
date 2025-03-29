import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { AiOutlineEdit } from "react-icons/ai";

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

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }, [tasks, completedTasks]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDatetime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const isDuplicate = tasks.some(
      (task) => task.title.toLowerCase() === newTitle.toLowerCase()
    );
    if (isDuplicate) {
      setNewTitle("");
      return;
    }

    const newTask = {
      title: newTitle,
      description: newDescription.trim() || "",
      id: Date.now(),
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
      description: newDescription.trim() || "",
    };
    setTasks(updatedTasks);
    setEditIndex(null);
    setNewTitle("");
    setNewDescription("");
  };

  const handleCompleteTask = (index) => {
    const completedTask = {
      ...tasks[index],
      completedOn: new Date().toLocaleString(),
    };
    setCompletedTasks([...completedTasks, completedTask]);
    handleDeleteTask(index);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    if (editIndex === index) setEditIndex(null);
  };

  const handleClearAll = () => {
    setTasks([]);
    setCompletedTasks([]);
    localStorage.removeItem("tasks");
    localStorage.removeItem("completedTasks");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] font-poppins p-4">
<div className="bg-white/10 p-5 rounded-xl shadow-2xl w-full max-w-md text-center border border-white/20 backdrop-blur-lg">
<header>
<h1 className="text-2xl font-bold text-[#00d4ff] drop-shadow-lg mb-2">Todo List</h1>
<div className="text-md font-medium text-white mb-2">{datetime}</div>
        </header>

        <form
          className="flex flex-col sm:flex-row justify-between items-center gap-2 flex-wrap"
          onSubmit={editIndex === null ? handleAddTask : handleUpdateTask}
        >
          <input
            type="text"
            className="flex-1 p-3 rounded-lg outline-none text-base bg-transparent text-white border border-opacity-60 border-[#00d4ff] shadow-lg transition-all w-full placeholder:text-opacity-60 placeholder:text-gray-300 focus:border-[#00d4ff] focus:shadow-xl"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task title"
            required
          />
          <input
            type="text"
            className="flex-1 p-3 rounded-lg outline-none text-base bg-transparent text-white border border-opacity-60 border-[#00d4ff] shadow-lg transition-all w-full placeholder:text-opacity-60 placeholder:text-gray-300 focus:border-[#00d4ff] focus:shadow-xl"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Task description"
          />
          <button
            type="submit"
            className="p-3 rounded-lg bg-gradient-to-r from-[#00feba] to-[#00d4ff] text-black font-bold uppercase shadow-lg transition-all w-full hover:bg-gradient-to-r hover:from-[#00d4ff] hover:to-[#00feba] hover:shadow-xl hover:scale-105"
          >
            {editIndex === null ? "Add Task" : "Update Task"}
          </button>
        </form>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-5">
          <button
            className={`p-3 text-base font-bold uppercase rounded-lg transition-all bg-gradient-to-r from-[#00feba] to-[#00d4ff] text-black shadow-lg hover:bg-gradient-to-r hover:from-[#00d4ff] hover:to-[#00feba] hover:shadow-xl hover:scale-105 ${
              !isCompleteScreen && "bg-gradient-to-r from-[#00d4ff] to-[#00feba] shadow-xl scale-105"
            }`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Active Tasks
          </button>
          <button
            className={`p-3 text-base font-bold uppercase rounded-lg transition-all bg-gradient-to-r from-[#00feba] to-[#00d4ff] text-black shadow-lg hover:bg-gradient-to-r hover:from-[#00d4ff] hover:to-[#00feba] hover:shadow-xl hover:scale-105 ${
              isCompleteScreen && "bg-gradient-to-r from-[#00d4ff] to-[#00feba] shadow-xl scale-105"
            }`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed Tasks
          </button>
        </div>

        <section className="mt-5">
          {!isCompleteScreen
            ? tasks.map((task, index) => (
                <div
                  className="flex flex-col sm:flex-row justify-between items-center bg-black bg-opacity-40 p-3 rounded-lg mb-2 border border-opacity-40 border-[#00ffff] shadow-lg transition-all hover:scale-103 flex-wrap"
                  key={task.id}
                >
                  <div className="flex-grow text-left">
                    <strong className="text-base text-[#00d4ff] block mb-1">
                      {task.title}
                    </strong>
                    {task.description && (
                      <p className="text-sm text-white text-opacity-70 text-shadow">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 items-center mt-2 sm:mt-0">
                    <FaCheckCircle
                      className="text-2xl text-[#11ff00] cursor-pointer transition-colors hover:text-[#00ff1e] hover:scale-110"
                      onClick={() => handleCompleteTask(index)}
                      title="Mark Complete"
                    />
                    <AiOutlineEdit
                      className="text-2xl text-orange cursor-pointer transition-colors hover:text-darkorange hover:scale-110 bg-opacity-20 bg-yellow-500 rounded-full p-1"
                      onClick={() => handleEditTask(index)}
                      title="Edit Task"
                    />
                    <RiDeleteBin2Fill
                      className="text-2xl text-red-500 cursor-pointer transition-colors hover:text-red-700 hover:scale-110"
                      onClick={() => handleDeleteTask(index)}
                      title="Delete Task"
                    />
                  </div>
                </div>
              ))
            : completedTasks.map((task) => (
                <div
                  className="flex flex-col sm:flex-row justify-between items-center bg-black bg-opacity-40 p-3 rounded-lg mb-2 border border-opacity-40 border-[#00ffff] shadow-lg transition-all hover:scale-103 flex-wrap"
                  key={task.id}
                >
                  <div className="flex-grow text-left">
                    <strong className="text-base text-[#00d4ff] block mb-1">
                      {task.title}
                    </strong>
                    {task.description && (
                      <p className="text-sm text-white text-opacity-70 text-shadow">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 items-center mt-2 sm:mt-0">
                    <small className="text-xs text-white text-opacity-70">
                      Completed: {task.completedOn}
                    </small>
                  </div>
                </div>
              ))}
        </section>

        <button
          className="bg-red-500 rounded-lg border-none cursor-pointer text-base p-2 text-white font-bold mt-5 hover:bg-red-700"
          onClick={handleClearAll}
        >
          Clear all
        </button>
      </div>
    </div>
  );
};

export default Todo;