import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../css/CreatePost.css";

const CreatePost = () => {
  const { circleId } = useParams();
  const navigate = useNavigate();

  const [type, setType] = useState("doubt");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState("");

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [success, setSuccess] = useState(false);
const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setImages([file]);
  setPreviewImages([URL.createObjectURL(file)]);
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("circleId", circleId);

    const linksArray = links
      ? links.split(",").map((l) => l.trim())
      : [];

    linksArray.forEach((link) => {
      formData.append("links", link);
    });

    // only one image
    if (images.length > 0) {
      formData.append("images", images[0]);
    }

    await api.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setSuccess(true);

    setTimeout(() => {
      navigate(`/circles/${circleId}`);
    }, 1500);

  } catch (error) {
    console.error(error);
    alert("Failed to create post");
  }
};

  return (
    <div className="create-post-page">

      <div className="create-post-card">

        <h2>Create Post</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Post Type</label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="doubt">Doubt</option>
              <option value="discussion">Discussion</option>
            </select>
          </div>

          <div className="form-group">
            <label>Title</label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)} placeholder="Enter title"
              required 
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description..."
              required
            />
          </div>

          <div className="form-group">
            <label>Links (optional)</label>

            <input
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              placeholder="comma separated links"
            />
          </div>

          <div className="form-group">
            <label>Images (optional)</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {previewImages.length > 0 && (

            <div className="image-preview-grid">

              {previewImages.map((img, index) => (

                <img
                  key={index}
                  src={img}
                  alt="preview"
                />

              ))}

            </div>

          )}

          <button className="post-btn">
            Create Post
          </button>

        </form>

      </div>

      {success && (
        <div className="snackbar">
          Post created successfully 🎉
        </div>
      )}

    </div>
  );
};

export default CreatePost;