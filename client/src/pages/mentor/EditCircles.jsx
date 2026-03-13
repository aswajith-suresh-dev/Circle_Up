// src/pages/mentor/EditCircle.jsx

import { useEffect,useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../../api/axios";

import "../../css/EditCircles.css";

const EditCircle = () => {

const { circleId } = useParams();
const navigate = useNavigate();

const [name,setName] = useState("");
const [description,setDescription] = useState("");
const [topic,setTopic] = useState("");
const [level,setLevel] = useState("beginner");


const fetchCircle = async () => {

try{

const res = await api.get(`/circles/${circleId}`);

setName(res.data.name);
setDescription(res.data.description);
setTopic(res.data.topic);
setLevel(res.data.level);

}catch(err){

console.error(err);

}

};


useEffect(()=>{

fetchCircle();

},[]);


const handleSubmit = async (e) => {

e.preventDefault();

try{

await api.put(`/circles/${circleId}`,{
name,
description,
topic,
level
});

navigate("/mentor/circles");

}catch(err){

console.error(err);

}

};


return(

<div className="mentor-edit-circle-page">

<div className="mentor-edit-circle-card">

<h2 className="mentor-edit-circle-title">
Edit Circle
</h2>

<form onSubmit={handleSubmit}>

<input
className="mentor-edit-circle-input"
value={name}
onChange={(e)=>setName(e.target.value)}
placeholder="Circle Name"
/>

<textarea
className="mentor-edit-circle-input"
value={description}
onChange={(e)=>setDescription(e.target.value)}
placeholder="Description"
/>

<input
className="mentor-edit-circle-input"
value={topic}
onChange={(e)=>setTopic(e.target.value)}
placeholder="Topic"
/>

<select
className="mentor-edit-circle-input"
value={level}
onChange={(e)=>setLevel(e.target.value)}
>

<option value="beginner">Beginner</option>
<option value="intermediate">Intermediate</option>
<option value="advanced">Advanced</option>

</select>

<button
className="mentor-edit-circle-btn"
>
Update Circle
</button>

</form>

</div>

</div>

);

};

export default EditCircle;