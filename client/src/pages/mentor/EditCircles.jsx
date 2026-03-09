import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const EditCircle = () => {

  const { circleId } = useParams();
  const navigate = useNavigate();

  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const [topic,setTopic] = useState("");
  const [level,setLevel] = useState("beginner");

  const fetchCircle = async () => {
    try {
      const res = await api.get(`/circles/${circleId}`);

      setName(res.data.name);
      setDescription(res.data.description);
      setTopic(res.data.topic);
      setLevel(res.data.level);

    } catch(err){
      console.error(err);
    }
  };

  useEffect(()=>{
    fetchCircle();
  },[]);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await api.put(`/circles/${circleId}`,{
        name,
        description,
        topic,
        level
      });

      navigate("/mentor/circles");

    } catch(err){
      console.error(err);
    }

  };

  return(

    <div style={{padding:"20px",maxWidth:"600px"}}>

      <h2>Edit Circle</h2>

      <form onSubmit={handleSubmit}>

        <input
          value={name}
          onChange={(e)=>setName(e.target.value)}
          placeholder="Circle Name"
          style={input}
        />

        <textarea
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          placeholder="Description"
          style={input}
        />

        <input
          value={topic}
          onChange={(e)=>setTopic(e.target.value)}
          placeholder="Topic"
          style={input}
        />

        <select
          value={level}
          onChange={(e)=>setLevel(e.target.value)}
          style={input}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <button style={button}>
          Update Circle
        </button>

      </form>

    </div>

  );

};

const input = {
  width:"100%",
  padding:"8px",
  marginBottom:"10px",
  borderRadius:"6px",
  border:"1px solid #ccc"
};

const button = {
  padding:"8px 16px",
  border:"none",
  borderRadius:"6px",
  background:"#3b82f6",
  color:"white",
  cursor:"pointer"
};

export default EditCircle;