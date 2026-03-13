// src/pages/mentor/MentorCircles.jsx

import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import "../../css/MentorCircles.css";

const MentorCircles = () => {

const [circles,setCircles] = useState([]);
const navigate = useNavigate();


const fetchCircles = async () => {

try{

const res = await api.get("/circles/mentor");

setCircles(res.data);

}catch(err){

console.error(err);

}

};


useEffect(()=>{

fetchCircles();

},[]);


const deleteCircle = async (id) => {

if(!window.confirm("Delete this circle?")) return;

try{

await api.delete(`/circles/${id}`);

fetchCircles();

}catch(err){

console.error(err);

}

};


return(

<div className="mentor-circle-page">

<h2 className="mentor-circle-title">
My Created Circles
</h2>


{/* EMPTY STATE */}

{circles.length === 0 && (

<div className="mentor-circle-empty">

<p className="mentor-circle-empty-text">
You haven't created any circles yet.
</p>

<button
className="mentor-circle-create-btn"
onClick={()=>navigate("/create-circle")}
>

Create Circle

</button>

</div>

)}


{/* CIRCLE LIST */}

{circles.map((circle)=>(

<div
key={circle._id}
className="mentor-circle-card"
>

<h3 className="mentor-circle-name">
{circle.name}
</h3>

<p className="mentor-circle-description">
{circle.description}
</p>

<p className="mentor-circle-meta">
Topic: <strong>{circle.topic}</strong>
</p>

<p className="mentor-circle-meta">
Level: <strong>{circle.level}</strong>
</p>

<div className="mentor-circle-actions">

<button
className="mentor-circle-edit-btn"
onClick={()=>navigate(`/edit-circle/${circle._id}`)}
>
Edit
</button>

<button
className="mentor-circle-delete-btn"
onClick={()=>deleteCircle(circle._id)}
>
Delete
</button>

</div>

</div>

))}

</div>

);

};

export default MentorCircles;