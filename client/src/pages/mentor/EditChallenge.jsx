import { useEffect,useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../../api/axios";

const EditChallenge = () => {

const { challengeId } = useParams();
const navigate = useNavigate();

const [title,setTitle] = useState("");
const [description,setDescription] = useState("");

useEffect(()=>{

const fetchChallenge = async () => {

const res = await api.get(`/challenges/${challengeId}`);

setTitle(res.data.challenge.title);
setDescription(res.data.challenge.description);

};

fetchChallenge();

},[]);

const handleSubmit = async (e)=>{

e.preventDefault();

await api.put(`/challenges/${challengeId}`,{
title,
description
});

navigate("/mentor/challenges");

};

return(

<div style={{padding:"20px"}}>

<h2>Edit Challenge</h2>

<form onSubmit={handleSubmit}>

<input
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>

<textarea
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>

<button>
Update Challenge
</button>

</form>

</div>

);

};

export default EditChallenge;