// src/pages/mentor/EditChallenge.jsx

import { useEffect,useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../../api/axios";

import "../../css/EditChallenge.css";

const EditChallenge = () => {

const { challengeId } = useParams();
const navigate = useNavigate();

const [title,setTitle] = useState("");
const [description,setDescription] = useState("");

useEffect(()=>{

const fetchChallenge = async () => {

try{

const res = await api.get(`/challenges/${challengeId}`);

setTitle(res.data.challenge.title);
setDescription(res.data.challenge.description);

}catch(err){

console.error(err);

}

};

fetchChallenge();

},[challengeId]);

const handleSubmit = async (e)=>{

e.preventDefault();

try{

await api.put(`/challenges/${challengeId}`,{
title,
description
});

navigate("/mentor/challenges");

}catch(err){

console.error(err);

}

};

return(

<div className="edit-challenge-page">

<h2 className="edit-challenge-title">
Edit Challenge
</h2>

<form
onSubmit={handleSubmit}
className="edit-challenge-form"
>

<input
className="edit-input"
placeholder="Challenge Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>

<textarea
className="edit-textarea"
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>

<button
type="submit"
className="update-btn"
>
Update Challenge
</button>

</form>

</div>

);

};

export default EditChallenge;