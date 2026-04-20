import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../css/personal/personalSpace.css";

import {
  FiEdit2,
  FiTrash2,
  FiFolder,
  FiMoreHorizontal,
  FiCheckCircle,
} from "react-icons/fi";

const PersonalSpace = () => {
  const navigate = useNavigate();

  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);

  const [menuOpenId, setMenuOpenId] = useState(null);

  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editName, setEditName] = useState("");

  const [snackbar, setSnackbar] = useState("");

  /* FETCH FOLDERS */

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

  /* CREATE FOLDER */

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;

    try {
      setLoading(true);

      await api.post("/personal/folders", {
        name: folderName,
      });

      setFolderName("");
      fetchFolders();

      /* SHOW SNACKBAR */

      setSnackbar("Folder created successfully");

      setTimeout(() => {
        setSnackbar("");
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  /* DELETE FOLDER */

  const handleDeleteFolder = async (id) => {
    const confirmDelete = window.confirm("Delete this folder?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/personal/folders/${id}`);

      fetchFolders();

      setSnackbar("Folder deleted successfully");

      setTimeout(() => {
        setSnackbar("");
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  /* UPDATE FOLDER */

  const handleUpdateFolder = async () => {
    if (!editName.trim()) return;

    try {
      await api.put(`/personal/folders/${editingFolderId}`, {
        name: editName,
      });

      setEditingFolderId(null);
      setEditName("");

      fetchFolders();

      setSnackbar("Folder updated successfully");

      setTimeout(() => {
        setSnackbar("");
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="personal-container">
      <h2>Personal Space</h2>

      {/* CREATE FOLDER */}

      <div className="create-folder">
        <input
          type="text"
          placeholder="Folder Name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />

        <button onClick={handleCreateFolder} disabled={loading}>
          {loading ? "Creating..." : "Create Folder"}
        </button>
      </div>

      <h3>Folders</h3>

      {/* FOLDER GRID */}

      <div className="folder-grid">
        {folders.map((folder) => (
          <div key={folder._id} className="folder-card">
            <div className="folder-top">
              <div className="folder-icon">
                <FiFolder />
              </div>

              <div
                className="folder-menu"
                onMouseLeave={() => setMenuOpenId(null)}
              >
                <button
                  className="menu-button"
                  onClick={() =>
                    setMenuOpenId(menuOpenId === folder._id ? null : folder._id)
                  }
                >
                  <FiMoreHorizontal />
                </button>

                {menuOpenId === folder._id && (
                  <div className="dropdown-menu">
                    <button
                      onClick={() => {
                        setEditingFolderId(folder._id);
                        setEditName(folder.name);
                        setMenuOpenId(null);
                      }}
                    >
                      <FiEdit2 /> Edit
                    </button>

                    <button onClick={() => handleDeleteFolder(folder._id)}>
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="folder-content">
              {editingFolderId === folder._id ? (
                <div className="edit-folder">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />

                  <button onClick={handleUpdateFolder}>Save</button>
                </div>
              ) : (
                <h4>{folder.name}</h4>
              )}
              <p>{folder.taskCount || 0} Tasks</p>

{editingFolderId !== folder._id && (
  <div className="folder-bottom">                <div className="folder-divider"></div>

                <div
                  className="view-button"
                  onClick={() => navigate(`/personal/folders/${folder._id}`)}
                >
                  <span>View</span>
                  <span className="arrow">→</span>
                </div>
              </div>
)}
            </div>
          </div>
        ))}
      </div>

      {/* SNACKBAR */}

      {snackbar && (
        <div className="snackbar">
          <FiCheckCircle />

          <span>{snackbar}</span>
        </div>
      )}
    </div>
  );
};

export default PersonalSpace;
