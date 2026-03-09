import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const PostDetail = () => {

  const { user } = useAuth();
  const { postId } = useParams();

  const [data, setData] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${postId}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const handleReply = async () => {
    if (!replyText.trim()) return;

    try {

      await api.post(`/replies/${postId}`, {
        content: replyText,
      });

      setReplyText("");
      fetchPost();

    } catch (err) {
      console.error(err);
    }
  };

  const deleteReply = async (replyId) => {

    if (!window.confirm("Delete reply?")) return;

    try {

      await api.delete(`/replies/${replyId}`);

      fetchPost();

    } catch (err) {
      console.error(err);
    }

  };

  const startEditReply = (reply) => {

    setEditingReplyId(reply._id);
    setEditReplyText(reply.content);

  };

  const updateReply = async (replyId) => {

    try {

      await api.put(`/replies/${replyId}`, {
        content: editReplyText,
      });

      setEditingReplyId(null);
      fetchPost();

    } catch (err) {
      console.error(err);
    }

  };

  const handleSolve = async (replyId) => {

    try {

      await api.put(`/replies/solve/${postId}/${replyId}`);

      fetchPost();

    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }

  };

  const handleUpvote = async (replyId) => {

    try {

      await api.put(`/replies/upvote/${replyId}`);

      fetchPost();

    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }

  };

  if (!data) return <p>Loading...</p>;

  return (

    <div style={{ padding: "16px" }}>

      <h2>{data.post.title}</h2>
      <p>{data.post.description}</p>

      <hr />

      <h3>Replies</h3>

      {data.replies.length === 0 && <p>No replies yet</p>}

      {data.replies.map((reply) => {

        const isSolvedReply = data.post.solvedBy === reply._id;
        const isPostAuthor = data.post.author._id === user?._id;
        const isDoubt = data.post.type === "doubt";
        const alreadySolved = data.post.isSolved;
        const isReplyAuthor = reply.author._id === user?._id;

        return (

          <div
            key={reply._id}
            style={{
              marginBottom: "12px",
              padding: "10px",
              border: isSolvedReply
                ? "2px solid green"
                : "1px solid #ddd",
              background: isSolvedReply ? "#f0fff0" : "white",
            }}
          >

            {editingReplyId === reply._id ? (

              <>
                <textarea
                  value={editReplyText}
                  onChange={(e) => setEditReplyText(e.target.value)}
                  style={{ width: "100%", marginBottom: "8px" }}
                />

                <button
                  onClick={() => updateReply(reply._id)}
                  style={saveButton}
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingReplyId(null)}
                  style={cancelButton}
                >
                  Cancel
                </button>
              </>

            ) : (

              <>
                <p>{reply.content}</p>

                <small>— {reply.author.name}</small>

                <div style={{ marginTop: "6px" }}>

                  <button onClick={() => handleUpvote(reply._id)}>
                    👍 {reply.upvotes.length}
                  </button>

                  {isReplyAuthor && (
                    <>
                      <button
                        onClick={() => startEditReply(reply)}
                        style={editButton}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteReply(reply._id)}
                        style={deleteButton}
                      >
                        Delete
                      </button>
                    </>
                  )}

                  {isDoubt && isPostAuthor && !alreadySolved && (
                    <button
                      disabled={reply.author._id === user?._id}
                      onClick={() => handleSolve(reply._id)}
                      style={{
                        marginLeft: "8px",
                        opacity: reply.author._id === user?._id ? 0.5 : 1,
                        cursor:
                          reply.author._id === user?._id
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      ✅ Mark as Solved
                    </button>
                  )}

                  {isSolvedReply && (
                    <span
                      style={{ marginLeft: "10px", color: "green" }}
                    >
                      ✔ Solved Answer
                    </span>
                  )}

                </div>
              </>

            )}

          </div>

        );

      })}

      <hr />

      <h3>Add a reply</h3>

      <textarea
        rows="3"
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Write your reply..."
        style={{ width: "100%", marginBottom: "8px" }}
      />

      <button onClick={handleReply}>Reply</button>

    </div>
  );
};

const editButton = {
  marginLeft: "8px",
  padding: "4px 8px",
  border: "none",
  borderRadius: "6px",
  background: "#3b82f6",
  color: "white",
  cursor: "pointer",
};

const deleteButton = {
  marginLeft: "8px",
  padding: "4px 8px",
  border: "none",
  borderRadius: "6px",
  background: "#ef4444",
  color: "white",
  cursor: "pointer",
};

const saveButton = {
  marginRight: "8px",
  padding: "4px 10px",
  border: "none",
  borderRadius: "6px",
  background: "#10b981",
  color: "white",
  cursor: "pointer",
};

const cancelButton = {
  padding: "4px 10px",
  border: "none",
  borderRadius: "6px",
  background: "#6b7280",
  color: "white",
  cursor: "pointer",
};

export default PostDetail;