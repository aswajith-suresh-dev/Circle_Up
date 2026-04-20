import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

import {
  FiArrowUp,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiMessageSquare,
} from "react-icons/fi";

import "../../css/PostDetail.css";

const PostDetail = () => {
  const { user } = useAuth();
  const { postId } = useParams();

  const [data, setData] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [snackbar, setSnackbar] = useState("");

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

  const showSnackbar = (msg) => {
    setSnackbar(msg);
    setTimeout(() => setSnackbar(""), 2000);
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;

    try {
      await api.post(`/replies/${postId}`, {
        content: replyText,
      });

      setReplyText("");
      fetchPost();
      showSnackbar("Reply added");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReply = async (replyId) => {
    if (!window.confirm("Delete reply?")) return;

    try {
      await api.delete(`/replies/${replyId}`);
      fetchPost();
      showSnackbar("Reply deleted");
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
      showSnackbar("Reply updated");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSolve = async (replyId) => {
    try {
      await api.put(`/replies/solve/${postId}/${replyId}`);
      fetchPost();
      showSnackbar("Marked as solved");
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const handleUpvote = async (replyId) => {
    try {
      const res = await api.put(`/replies/upvote/${replyId}`);
      fetchPost();
      showSnackbar(res.data.message);
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Error");
    }
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="postdetail-container">

      {/* POST */}
      <div className="post-card">
        <h2>{data.post.title}</h2>
        <p className="post-description">{data.post.description}</p>
      </div>

      {/* REPLIES */}
      <h3 className="reply-title">
        <FiMessageSquare /> Replies
      </h3>

      {data.replies.length === 0 && (
        <p className="empty-text">No replies yet</p>
      )}

      {data.replies.map((reply) => {

        const isSolvedReply = data.post.solvedBy === reply._id;
        const isPostAuthor = data.post.author._id === user?._id;
        const isReplyAuthor = reply.author._id === user?._id;
        const isDoubt = data.post.type === "doubt";
        const alreadySolved = data.post.isSolved;

        const isReplyByPostAuthor =
          reply.author._id === data.post.author._id;

        return (
          <div
            key={reply._id}
            className={`reply-card 
              ${isSolvedReply ? "solved" : ""}
              ${isReplyByPostAuthor ? "author-reply" : ""}
            `}
          >

            {editingReplyId === reply._id ? (

              /* EDIT MODE */
              <div className="reply-edit-mode">

                <textarea
                  value={editReplyText}
                  onChange={(e) => setEditReplyText(e.target.value)}
                  className="reply-editor"
                />

                <div className="edit-actions">
                  <button
                    onClick={() => updateReply(reply._id)}
                    className="btn-save"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingReplyId(null)}
                    className="btn-cancel"
                  >
                    Cancel
                  </button>
                </div>

              </div>

            ) : (

              <>
                {/* AUTHOR NAME + BADGE */}
                <div className="reply-author">
                  {reply.author.name}

                  {isReplyByPostAuthor && (
                    <span className="author-badge">Author</span>
                  )}
                </div>

                {/* CONTENT */}
                <div className="reply-row">
                  <p className="reply-text">{reply.content}</p>

                  <div className="reply-actions">

                    {/* UPVOTE */}
                    <button
                      className="upvote-btn"
                      onClick={() => handleUpvote(reply._id)}
                    >
                      <FiArrowUp />
                      {reply.upvotes.length}
                    </button>

                    {/* EDIT / DELETE */}
                    {isReplyAuthor && (
                      <>
                        <button
                          className="icon-btn"
                          onClick={() => startEditReply(reply)}
                        >
                          <FiEdit />
                        </button>

                        <button
                          className="icon-btn delete"
                          onClick={() => deleteReply(reply._id)}
                        >
                          <FiTrash2 />
                        </button>
                      </>
                    )}

                    {/* SOLVE */}
                    {isDoubt &&
                      isPostAuthor &&
                      !alreadySolved &&
                      reply.author._id !== user?._id && (
                        <button
                          className="solve-btn"
                          onClick={() => handleSolve(reply._id)}
                        >
                          <FiCheckCircle />
                          Mark Solved
                        </button>
                      )}

                    {/* SOLVED LABEL */}
                    {isSolvedReply && (
                      <span className="solved-label">
                        ✔ Solved Answer
                      </span>
                    )}

                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* REPLY INPUT */}
      <div className="reply-input-box">
        <textarea
          rows="3"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write your reply..."
        />

        <button onClick={handleReply} className="reply-submit-btn">
          Reply
        </button>
      </div>

      {/* SNACKBAR */}
      {snackbar && <div className="snackbar">{snackbar}</div>}

    </div>
  );
};

export default PostDetail;