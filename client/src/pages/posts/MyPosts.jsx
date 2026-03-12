import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../css/MyPosts.css";

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

    <div className="myposts-container">

      <h2 className="myposts-title">My Posts</h2>

      {posts.length === 0 && (
        <p className="empty-text">You haven't created posts yet</p>
      )}

      {/* GRID CONTAINER */}
      <div className="myposts-grid">

        {posts.map(post => (

          <div
            key={post._id}
            className="mypost-card"
          >

            {editingPostId === post._id ? (

              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="edit-input"
                  placeholder="Post title"
                />

                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="edit-textarea"
                  placeholder="Post description"
                />

                <div className="edit-actions">

                  <button
                    onClick={() => updatePost(post._id)}
                    className="btn-save"
                  >
                    Save
                  </button>

                  <button
                    onClick={cancelEdit}
                    className="btn-cancel"
                  >
                    Cancel
                  </button>

                </div>
              </>

            ) : (

              <>
                <h3 className="post-title">
                  {post.title}
                </h3>

                <p className="post-desc">
                  {post.description}
                </p>

                <p className="post-meta">
                  {post.type} · {post.circle?.name}
                </p>

                <div className="post-actions">

                  <button
                    onClick={() => startEdit(post)}
                    className="btn-edit"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deletePost(post._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>

                </div>

              </>

            )}

          </div>

        ))}

      </div>

    </div>

  );

};

export default MyPosts;