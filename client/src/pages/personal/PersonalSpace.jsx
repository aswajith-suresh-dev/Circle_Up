import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import "../../css/personal/personalSpace.css";
const PersonalSpace = () => {
    const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editName, setEditName] = useState("");
const [editingTaskId, setEditingTaskId] = useState(null);
const [editTaskTitle, setEditTaskTitle] = useState("");
const [editTaskDescription, setEditTaskDescription] = useState("");
  const fetchFolders = async () => {
    try {
      const res = await api.get("/personal/folders");
      setFolders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;

    try {
      setLoading(true);
      await api.post("/personal/folders", { name: folderName });
      setFolderName("");
      fetchFolders();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (folderId) => {
    try {
      const res = await api.get(`/personal/tasks/${folderId}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async () => {
    if (!taskTitle.trim() || !selectedFolder) return;

    try {
      setLoading(true);
      await api.post("/personal/task", {
        title: taskTitle,
        description: taskDescription,
        folderId: selectedFolder._id,
      });

      setTaskTitle("");
      setTaskDescription("");
      fetchTasks(selectedFolder._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="personal-container">
      <h2>Personal Space</h2>

      {/* Create Folder */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Create Folder</h3>
        <input
          type="text"
          placeholder="Folder Name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          style={{ padding: "8px", width: "70%", marginRight: "10px" }}
        />
        <button onClick={handleCreateFolder} disabled={loading}>
          {loading ? "Creating..." : "Create Folder"}
        </button>
      </div>

      <h3>My Folders</h3>

      {folders.length === 0 && <p>No folders yet.</p>}

      {folders.map((folder) => (
        <div
          key={folder._id}
          className={`folder-card ${
            selectedFolder?._id === folder._id ? "active" : ""
          }`}
        >
          {editingFolderId === folder._id ? (
            <>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{ padding: "6px", width: "100%", marginBottom: "8px" }}
              />

              <button
                onClick={async () => {
                  if (!editName.trim()) return;
                  await api.put(`/personal/folders/${folder._id}`, {
                    name: editName,
                  });
                  setEditingFolderId(null);
                  setEditName("");
                  fetchFolders();
                }}
              >
                Save
              </button>

              <button
                onClick={() => {
                  setEditingFolderId(null);
                  setEditName("");
                }}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </>
          ) : (
            <div className="folder-row">
              <div
                className="folder-name"
                onClick={() => {
                  navigate(`/personal/folders/${folder._id}`);
                }}
              >
                {folder.name}
              </div>

              <div className="icon-group">
                <div
                  className="icon-wrapper"
                  data-label="Edit"
                  onClick={() => {
                    setEditingFolderId(folder._id);
                    setEditName(folder.name);
                  }}
                >
                  <FiEdit2 size={18} />
                </div>

                <div
                  className="icon-wrapper"
                  data-label="Delete"
                  onClick={async () => {
                    await api.delete(
                      `/personal/folders/${folder._id}`
                    );

                    if (selectedFolder?._id === folder._id) {
                      setSelectedFolder(null);
                      setTasks([]);
                    }

                    fetchFolders();
                  }}
                >
                  <FiTrash2 size={18} color="red" />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Task Section */}
      {selectedFolder && (
        <>
          <hr style={{ margin: "40px 0" }} />

          <h3>Tasks in {selectedFolder.name}</h3>

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

            <button onClick={handleCreateTask} disabled={loading}>
              {loading ? "Adding..." : "Add Task"}
            </button>
          </div>

          {tasks.length === 0 && <p>No tasks yet.</p>}

          {tasks.map((task) => (
            <div
              key={task._id}
              style={{
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                marginBottom: "10px",
              }}
            >
              <strong>{task.title}</strong>
              <p style={{ fontSize: "14px" }}>{task.description}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default PersonalSpace;