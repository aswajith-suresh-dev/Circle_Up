import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiCalendar,
  FiCheckCircle,
} from "react-icons/fi";

import "../../css/personal/FolderDetail.css";

const FolderDetail = () => {
  const { folderId } = useParams();

  const [tasks, setTasks] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskSources, setTaskSources] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editTaskSources, setEditTaskSources] = useState("");

  const [showLogFormFor, setShowLogFormFor] = useState(null);

  const [logDate, setLogDate] = useState("");
  const [logStartTime, setLogStartTime] = useState("");
  const [logEndTime, setLogEndTime] = useState("");

  const [editingLogId, setEditingLogId] = useState(null);

  const [snackbar, setSnackbar] = useState("");

  const today = new Date().toISOString().split("T")[0];

  /* SNACKBAR */

  const showSnack = (msg) => {
    setSnackbar(msg);
    setTimeout(() => setSnackbar(""), 3000);
  };

  /* TIME FORMAT */

  const formatTime = (time) => {
    if (!time) return "";

    const [hour, minute] = time.split(":");

    let h = parseInt(hour);

    const ampm = h >= 12 ? "PM" : "AM";

    h = h % 12;
    h = h ? h : 12;

    return `${h}:${minute} ${ampm}`;
  };

  /* FETCH TASKS */

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/personal/tasks/${folderId}`);

      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [folderId]);

  /* CREATE TASK */

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) return;

    try {
      await api.post("/personal/task", {
        title: taskTitle,
        description: taskDescription,
        folderId,
        sources: taskSources ? taskSources.split(",").map((s) => s.trim()) : [],
      });

      setTaskTitle("");
      setTaskDescription("");
      setTaskSources("");

      fetchTasks();

      showSnack("Task created");
    } catch (err) {
      console.error(err);
    }
  };

  /* UPDATE TASK */

  const handleUpdateTask = async (id) => {
    try {
      await api.put(`/personal/task/${id}`, {
        title: editTaskTitle,
        description: editTaskDescription,
        sources: editTaskSources
          ? editTaskSources.split(",").map((s) => s.trim())
          : [],
      });

      setEditingTaskId(null);

      fetchTasks();

      showSnack("Task updated");
    } catch (err) {
      console.error(err);
    }
  };

  /* DELETE TASK */

  const handleDeleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/personal/task/${id}`);

      fetchTasks();

      showSnack("Task deleted");
    } catch (err) {
      console.error(err);
    }
  };

  /* TOGGLE TASK COMPLETE */

  const toggleComplete = async (id) => {
    try {
      await api.put(`/personal/task/${id}/toggle`);

      fetchTasks();

      showSnack("Task status updated");
    } catch (err) {
      console.error(err);
    }
  };

  /* ADD / UPDATE STUDY LOG */

  const handleAddLog = async (taskId) => {
    if (!logDate || !logStartTime || !logEndTime) return;

    try {
      if (editingLogId) {
        await api.put(`/personal/task/${taskId}/log/${editingLogId}`, {
          date: logDate,
          startTime: logStartTime,
          endTime: logEndTime,
        });

        showSnack("Study log updated");
      } else {
        await api.post(`/personal/task/${taskId}/log`, {
          date: logDate,
          startTime: logStartTime,
          endTime: logEndTime,
        });

        showSnack("Study log added");
      }

      setEditingLogId(null);
      setShowLogFormFor(null);

      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  /* DELETE STUDY LOG */

  const handleDeleteLog = async (taskId, logId) => {
    const confirmDelete = window.confirm("Delete this study log?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/personal/task/${taskId}/log/${logId}`);

      fetchTasks();

      showSnack("Study log deleted");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="folder-detail-container">
      {/* HEADER */}

      <div className="task-header">
        <h2>Tasks</h2>

        <button
          className="add-task-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <FiPlus /> Add Task
        </button>
      </div>

      {/* CREATE TASK FORM */}

      {showCreateForm && (
        <div className="task-form">
          <input
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />

          <textarea
            rows="3"
            placeholder="Task Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />

          <textarea
            rows="2"
            placeholder="Source links (comma separated)"
            value={taskSources}
            onChange={(e) => setTaskSources(e.target.value)}
          />

          <button
            onClick={async () => {
              await handleCreateTask();
              setShowCreateForm(false);
            }}
          >
            Create Task
          </button>
        </div>
      )}

      {/* TASK LIST */}

      {tasks.map((task) => (
        <div
          key={task._id}
          className={`task-card ${task.completed ? "completed" : ""}`}
        >
          {editingTaskId === task._id ? (
            <div className="edit-task-form">
              <input
                value={editTaskTitle}
                onChange={(e) => setEditTaskTitle(e.target.value)}
              />

              <textarea
                rows="2"
                value={editTaskDescription}
                onChange={(e) => setEditTaskDescription(e.target.value)}
              />

              <textarea
                rows="2"
                value={editTaskSources}
                onChange={(e) => setEditTaskSources(e.target.value)}
              />

              <div className="edit-buttons">
                <button onClick={() => handleUpdateTask(task._id)}>Save</button>

                <button onClick={() => setEditingTaskId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="task-top">
                {/* BIG CHECK BUTTON */}

                <div
                  className={`task-check ${task.completed ? "done" : ""}`}
                  onClick={() => toggleComplete(task._id)}
                >
                  {task.completed && <FiCheckCircle />}
                </div>

                {/* TASK CONTENT */}

                <div className="task-content">
                  <strong>{task.title}</strong>

                  <p>{task.description}</p>
                </div>

                {/* ICONS */}

                <div className="task-icons">
                  <span data-label="Edit Task">
                    <FiEdit2
                      onClick={() => {
                        setEditingTaskId(task._id);
                        setEditTaskTitle(task.title);
                        setEditTaskDescription(task.description || "");
                        setEditTaskSources(task.sources?.join(", ") || "");
                      }}
                    />
                  </span>

                  <span data-label="Delete Task">
                    <FiTrash2 onClick={() => handleDeleteTask(task._id)} />
                  </span>

                  <span data-label="Add Study Log">
                    <FiCalendar
                      onClick={() => {
                        setShowLogFormFor(task._id);
                        setLogDate("");
                        setLogStartTime("");
                        setLogEndTime("");
                      }}
                    />
                  </span>
                </div>
              </div>

              {/* SOURCES */}

              {task.sources?.length > 0 && (
                <div className="sources">
                  <strong>Sources</strong>

                  {task.sources.map((s, i) => (
                    <a key={i} href={s} target="_blank" rel="noreferrer">
                      {s}
                    </a>
                  ))}
                </div>
              )}

              {/* STUDY LOG FORM */}

              {showLogFormFor === task._id && (
                <div className="log-form">
                  <input
                    type="date"
                    min={today}
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                  />

                  <input
                    type="time"
                    value={logStartTime}
                    onChange={(e) => setLogStartTime(e.target.value)}
                  />

                  <input
                    type="time"
                    value={logEndTime}
                    onChange={(e) => setLogEndTime(e.target.value)}
                  />
{/* 🔥 ADD HERE */}
    {(logStartTime || logEndTime) && (
      <p className="time-preview">
        {logStartTime && formatTime(logStartTime)}
        {logEndTime && " - " + formatTime(logEndTime)}
      </p>
    )}
                  <button onClick={() => handleAddLog(task._id)}>Save</button>
                </div>
              )}

              {/* STUDY LOG LIST */}

              {task.studyLogs?.length > 0 && (
                <div className="study-logs">
                  <strong>Study Logs</strong>

                  {task.studyLogs.map((log) => (
                    <div key={log._id} className="study-log">
                      <span>
                        {new Date(log.date).toLocaleDateString()}
                        {" | "}
                        {formatTime(log.startTime)}
                        {" - "}
                        {formatTime(log.endTime)}
                      </span>

                      <div className="log-icons">
                        <span data-label="Edit Log">
                          <FiEdit2
                            onClick={() => {
                              setShowLogFormFor(task._id);
                              setLogDate(log.date.split("T")[0]);
                              setLogStartTime(log.startTime);
                              setLogEndTime(log.endTime);
                              setEditingLogId(log._id);
                            }}
                          />
                        </span>

                        <span data-label="Delete Log">
                          <FiTrash2
                            onClick={() => handleDeleteLog(task._id, log._id)}
                          />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}

      {/* SNACKBAR */}

      {snackbar && (
        <div className="snackbar">
          <FiCheckCircle />

          {snackbar}
        </div>
      )}
    </div>
  );
};

export default FolderDetail;
