// src/pages/circles/CreateCircle.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import "../../css/CreateCircle.css";

const CreateCircle = () => {

const navigate = useNavigate();

const [name,setName] = useState("");
const [description,setDescription] = useState("");
const [topic,setTopic] = useState("");
const [level,setLevel] = useState("beginner");

const [loading,setLoading] = useState(false);
const [error,setError] = useState("");


const handleSubmit = async (e) => {

e.preventDefault();

if(!name || !description || !topic){

setError("All fields are required");

return;

}

try{

setLoading(true);
setError("");

const res = await api.post("/circles",{
name,
description,
topic,
level
});

navigate(`/circles/${res.data._id}`);

}catch(err){

setError(
err.response?.data?.message ||
"Failed to create circle"
);

}finally{

setLoading(false);

}

};


return(

<div className="mentor-create-circle-page">

<div className="mentor-create-circle-card">

<h2 className="mentor-create-circle-title">
Create New Circle
</h2>

<form onSubmit={handleSubmit}>

<input
className="mentor-create-circle-input"
type="text"
placeholder="Circle Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<textarea
className="mentor-create-circle-input"
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
style={{height:"80px"}}
/>

<input
className="mentor-create-circle-input"
type="text"
placeholder="Topic (e.g. React, DSA)"
value={topic}
onChange={(e)=>setTopic(e.target.value)}
/>

<select
className="mentor-create-circle-input"
value={level}
onChange={(e)=>setLevel(e.target.value)}
>

<option value="beginner">Beginner</option>
<option value="intermediate">Intermediate</option>
<option value="advanced">Advanced</option>

</select>

{error && (
<p className="mentor-create-circle-error">
{error}
</p>
)}

<button
className="mentor-create-circle-btn"
type="submit"
disabled={loading}
>

{loading ? "Creating..." : "Create Circle"}

</button>

</form>

</div>

</div>

);

};

export default CreateCircle;