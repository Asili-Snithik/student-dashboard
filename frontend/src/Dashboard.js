import React, { useEffect, useState } from "react";
import "./App.css";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [courseInstructor, setCourseInstructor] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState("");

  useEffect(() => {
    fetchCourses();
    fetchTasks();
  }, []);

  const fetchCourses = async () => {
    const res = await fetch("http://localhost:5000/courses");
    setCourses(await res.json());
  };

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/tasks");
    setTasks(await res.json());
  };

  const addCourse = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: courseName, instructor: courseInstructor }),
    });
    const newCourse = await res.json();
    setCourses([newCourse, ...courses]);
    setCourseName("");
    setCourseInstructor("");
  };

  const addTask = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: taskTitle, due: taskDue }),
    });
    const newTask = await res.json();
    setTasks([newTask, ...tasks]);
    setTaskTitle("");
    setTaskDue("");
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1> Student Dashboard</h1>
      </nav>

      <main className="main">
        <section className="card">
          <h3> Courses Enrolled</h3>
          <form className="inline-form" onSubmit={addCourse}>
            <input
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Course name"
              required
            />
            <input
              value={courseInstructor}
              onChange={(e) => setCourseInstructor(e.target.value)}
              placeholder="Instructor"
              required
            />
            <button>Add</button>
          </form>

          {courses.map((c) => (
            <div key={c.id} className="item">
              <strong>{c.name}</strong>
              <p>{c.instructor}</p>
            </div>
          ))}
        </section>

        <section className="card">
          <h3> Upcoming Tasks</h3>
          <form className="inline-form" onSubmit={addTask}>
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Task title"
              required
            />
            <input
              value={taskDue}
              onChange={(e) => setTaskDue(e.target.value)}
              placeholder="Due date (YYYY-MM-DD)"
              required
            />
            <button>Add</button>
          </form>

          {tasks.map((t) => (
            <div key={t.id} className="item">
              <strong>{t.title}</strong>
              <p>Due: {t.due}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
