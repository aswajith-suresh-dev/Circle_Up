import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
const PostDetail = () => {
    const { user } = useAuth();
  const { postId } = useParams();
  const [data, setData] = useState(null);
  const [replyText, setReplyText] = useState("");

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
      fetchPost(); // refresh replies
    } catch (err) {
      console.error(err);
    }
  };
  const handleSolve = async (replyId) => {
  try {
    await api.put(`/replies/solve/${postId}/${replyId}`);
    fetchPost(); // refresh post + replies
  } catch (err) {
    console.error(err.response?.data?.message || err.message);
  }
};
const handleUpvote = async (replyId) => {
  try {
    await api.put(`/replies/upvote/${replyId}`);
    fetchPost(); // refresh to get updated upvote count
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
  const isPostAuthor = data.post.author._id === user?.id;
  const isDoubt = data.post.type === "doubt";
  const alreadySolved = data.post.isSolved;

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
      <p>{reply.content}</p>
      <small>— {reply.author.name}</small>

      <div style={{ marginTop: "6px" }}>
        <button onClick={() => handleUpvote(reply._id)}>
          👍 {reply.upvotes.length}
        </button>

        {/* Solve button */}
        {isDoubt && isPostAuthor && !alreadySolved && (
          <button
  disabled={reply.author._id === user?.id}
onClick={() => handleSolve(reply._id)}  style={{
    opacity: reply.author._id === user?.id ? 0.5 : 1,
    cursor: reply.author._id === user?.id ? "not-allowed" : "pointer",
  }}
>
            ✅ Mark as Solved
          </button>
        )}

        {/* Solved label */}
        {isSolvedReply && (
          <span style={{ marginLeft: "10px", color: "green" }}>
            ✔ Solved Answer
          </span>
        )}
      </div>
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

export default PostDetail;