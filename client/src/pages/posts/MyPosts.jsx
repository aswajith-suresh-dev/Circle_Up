import { useEffect, useState } from "react";
import api from "../../api/axios";

const MyPosts = () => {

  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts/my");
      
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const deletePost = async (postId) => {

    const confirmDelete = window.confirm("Delete this post?");
    if (!confirmDelete) return;

    try {

      await api.delete(`/posts/${postId}`);

      fetchPosts();

    } catch (err) {
      console.error(err);
    }

  };

  const startEdit = (post) => {

    setEditingPostId(post._id);
    setEditTitle(post.title);
    setEditContent(post.description || "");

  };

  const cancelEdit = () => {

    setEditingPostId(null);
    setEditTitle("");
    setEditContent("");

  };

  const updatePost = async (postId) => {

    try {

      await api.put(`/posts/${postId}`, {
        title: editTitle,
        description: editContent
      });

      setEditingPostId(null);
      fetchPosts();

    } catch (err) {
      console.error(err);
    }

  };

  return (

    <div style={{ padding: "20px" }}>

      <h2>My Posts</h2>

      {posts.length === 0 && (
        <p>You haven't created posts yet</p>
      )}

      {posts.map(post => (

        <div
          key={post._id}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "8px"
          }}
        >

          {editingPostId === post._id ? (

            <>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{
                  width: "100%",
                  marginBottom: "8px",
                  padding: "6px"
                }}
              />

              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                style={{
                  width: "100%",
                  marginBottom: "8px",
                  padding: "6px"
                }}
              />

              <button
                onClick={() => updatePost(post._id)}
                style={saveButton}
              >
                Save
              </button>

              <button
                onClick={cancelEdit}
                style={cancelButton}
              >
                Cancel
              </button>

            </>

          ) : (

            <>
              <h3>{post.title}</h3>
<p style={{ marginTop: "6px", color: "#374151" }}>
  {post.description}
</p>

              <p>
                {post.type} · {post.circle?.name}
              </p>

              <button
                onClick={() => startEdit(post)}
                style={editButton}
              >
                Edit
              </button>

              <button
                onClick={() => deletePost(post._id)}
                style={deleteButton}
              >
                Delete
              </button>

            </>

          )}

        </div>

      ))}

    </div>

  );

};

const editButton = {
  marginTop: "10px",
  marginRight: "8px",
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  background: "#3b82f6",
  color: "white",
  cursor: "pointer"
};

const deleteButton = {
  marginTop: "10px",
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  background: "#ef4444",
  color: "white",
  cursor: "pointer"
};

const saveButton = {
  marginRight: "8px",
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  background: "#10b981",
  color: "white",
  cursor: "pointer"
};

const cancelButton = {
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  background: "#6b7280",
  color: "white",
  cursor: "pointer"
};

export default MyPosts;