import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { FiEdit2, FiTrash2, FiPlus, FiCalendar } from "react-icons/fi";
import "../../css/personal/personalSpace.css";

const FolderDetail = () => {
  const { folderId } = useParams();

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskSources, setTaskSources] = useState("");

const [editTaskSources, setEditTaskSources] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");

  const [showLogFormFor, setShowLogFormFor] = useState(null);
  const [logDate, setLogDate] = useState("");
  const [logStartTime, setLogStartTime] = useState("");
  const [logEndTime, setLogEndTime] = useState("");
const [editingLogId, setEditingLogId] = useState(null);
  // 🔹 Fetch Tasks
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

  // 🔹 Create Task
  const handleCreateTask = async () => {
    if (!taskTitle.trim()) return;

    try {
      setLoading(true);

      await api.post("/personal/task", {
  title: taskTitle,
  description: taskDescription,
  folderId,
  sources: taskSources
    ? taskSources.split(",").map((s) => s.trim())
    : [],
});

      setTaskTitle("");
      setTaskDescription("");
      setTaskSources("");
      fetchTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Add Study Log
  const handleAddLog = async (taskId) => {
  if (!logDate || !logStartTime || !logEndTime) return;

  try {
    if (editingLogId) {
      // Update existing log
      await api.put(
        `/personal/task/${taskId}/log/${editingLogId}`,
        {
          date: logDate,
          startTime: logStartTime,
          endTime: logEndTime,
        }
      );
    } else {
      // Create new log
      await api.post(`/personal/task/${taskId}/log`, {
        date: logDate,
        startTime: logStartTime,
        endTime: logEndTime,
      });
    }

    setEditingLogId(null);
    setShowLogFormFor(null);
    fetchTasks();
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="personal-container">
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Tasks</h2>

        <div
          className="icon-wrapper"
          data-label="Add Task"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <FiPlus size={20} />
        </div>
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            style={{ padding: "8px", width: "100%", marginBottom: "8px" }}
          />

          <textarea
            rows="3"
            placeholder="Task Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            style={{ padding: "8px", width: "100%", marginBottom: "8px" }}
          />
<textarea
  rows="2"
  placeholder="Source links (comma separated)"
  value={taskSources}
  onChange={(e) => setTaskSources(e.target.value)}
  style={{
    padding: "8px",
    width: "100%",
    marginBottom: "8px",
  }}
/>
          <button
            onClick={async () => {
              await handleCreateTask();
              setShowCreateForm(false);
            }}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>
      )}

      {tasks.length === 0 && <p>No tasks yet.</p>}

      {/* Task List */}
      {tasks.map((task) => (
        <div key={task._id} className="folder-card">
          {editingTaskId === task._id ? (
            <>
              <input
                type="text"
                value={editTaskTitle}
                onChange={(e) => setEditTaskTitle(e.target.value)}
                style={{ padding: "6px", width: "100%", marginBottom: "6px" }}
              />

              <textarea
                rows="2"
                value={editTaskDescription}
                onChange={(e) =>
                  setEditTaskDescription(e.target.value)
                }
                style={{ padding: "6px", width: "100%", marginBottom: "6px" }}
              />
<textarea
  rows="2"
  value={editTaskSources}
  onChange={(e) => setEditTaskSources(e.target.value)}
  placeholder="Source links (comma separated)"
  style={{
    padding: "6px",
    width: "100%",
    marginBottom: "6px",
  }}
/>
              <button
                onClick={async () => {
                  await api.put(`/personal/task/${task._id}`, {
  title: editTaskTitle,
  description: editTaskDescription,
  sources: editTaskSources
    ? editTaskSources.split(",").map((s) => s.trim())
    : [],
});

                  setEditingTaskId(null);
                  fetchTasks();
                }}
              >
                Save
              </button>

              <button
                onClick={() => setEditingTaskId(null)}
                style={{ marginLeft: "8px" }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <div className="folder-row">
                <div>
                  <strong>{task.title}</strong>
                  <p style={{ fontSize: "14px" }}>
                    {task.description}
                  </p>
                  {task.sources && task.sources.length > 0 && (
  <div style={{ marginTop: "6px" }}>
    <strong>Sources:</strong>
    {task.sources.map((src, index) => (
      <div key={index}>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#3b82f6", fontSize: "14px" }}
        >
          {src}
        </a>
      </div>
    ))}
  </div>
)}
                </div>

                <div className="icon-group">
                  <div
                    className="icon-wrapper"
                    data-label="Edit"
                    onClick={() => {
                      setEditingTaskId(task._id);
                      setEditTaskTitle(task.title);
                      setEditTaskDescription(task.description || "");
                      setEditTaskSources(task.sources?.join(", ") || "");
                    }}
                  >
                    <FiEdit2 size={18} />
                  </div>

                  <div
                    className="icon-wrapper"
                    data-label="Delete"
                    onClick={async () => {
                      await api.delete(`/personal/task/${task._id}`);
                      fetchTasks();
                    }}
                  >
                    <FiTrash2 size={18} color="red" />
                  </div>

                  <div
                    className="icon-wrapper"
                    data-label="Add Log"
                    onClick={() => {
                      setShowLogFormFor(task._id);
                      setLogDate("");
                      setLogStartTime("");
                      setLogEndTime("");
                    }}
                  >
                    <FiCalendar size={18} />
                  </div>
                </div>
              </div>
{/* Total Hours */}
{task.studyLogs && task.studyLogs.length > 0 && (
  <div style={{ marginTop: "10px", fontWeight: "bold" }}>
    Total Hours:{" "}
    {task.studyLogs
      .reduce((total, log) => {
        const start = new Date(`1970-01-01T${log.startTime}`);
        const end = new Date(`1970-01-01T${log.endTime}`);
        const diff = (end - start) / (1000 * 60 * 60);
        return total + diff;
      }, 0)
      .toFixed(2)}{" "}
    hrs
  </div>
)}
              {/* Study Log Form */}
              {showLogFormFor === task._id && (
                <div style={{ marginTop: "15px" }}>
                  <input
                    type="date"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    style={{ marginRight: "8px" }}
                  />

                  <input
                    type="time"
                    value={logStartTime}
                    onChange={(e) => setLogStartTime(e.target.value)}
                    style={{ marginRight: "8px" }}
                  />

                  <input
                    type="time"
                    value={logEndTime}
                    onChange={(e) => setLogEndTime(e.target.value)}
                    style={{ marginRight: "8px" }}
                  />

                  <button
                    onClick={() => handleAddLog(task._id)}
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setShowLogFormFor(null)}
                    style={{ marginLeft: "8px" }}
                  >
                    Cancel
                  </button>
                  
                </div>
              )}

              {/* Study Logs List */}
              {task.studyLogs && task.studyLogs.length > 0 && (
  <div style={{ marginTop: "15px" }}>
    <strong>Study Logs:</strong>

    {task.studyLogs.map((log) => (
      <div
        key={log._id}
        style={{
          fontSize: "14px",
          marginTop: "6px",
          padding: "8px",
          background: "#f9fafb",
          borderRadius: "6px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {new Date(log.date).toLocaleDateString()} |{" "}
          {log.startTime} – {log.endTime}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {/* Edit */}
          <FiEdit2
            size={16}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowLogFormFor(task._id);
              setLogDate(log.date.split("T")[0]);
              setLogStartTime(log.startTime);
              setLogEndTime(log.endTime);
              setEditingLogId(log._id);
            }}
          />

          {/* Delete */}
          <FiTrash2
            size={16}
            color="red"
            style={{ cursor: "pointer" }}
            onClick={async () => {
              await api.delete(
                `/personal/task/${task._id}/log/${log._id}`
              );
              fetchTasks();
            }}
          />
        </div>
      </div>
    ))}
  </div>
)}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default FolderDetail;