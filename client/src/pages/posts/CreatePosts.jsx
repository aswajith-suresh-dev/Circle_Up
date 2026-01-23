import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CreatePost = () => {
  const { circleId } = useParams();
  const navigate = useNavigate();

  const [type, setType] = useState("doubt");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/posts", {
        title,
        description,
        type,
        circleId,
        links: links
          ? links.split(",").map((l) => l.trim())
          : [],
      });

      // go back to circle
      navigate(`/circles/${circleId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create post");
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <h2>Create Post</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="doubt">Doubt</option>
            <option value="discussion">Discussion</option>
          </select>
        </div>

        <div>
          <label>Title:</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Links (comma separated):</label>
          <input
            value={links}
            onChange={(e) => setLinks(e.target.value)}
          />
        </div>

        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;