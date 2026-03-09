import { useEffect,useState } from "react";
import api from "../../api/axios";

const MentorChallenges = () => {

const [challenges,setChallenges] = useState([]);

const fetchChallenges = async () => {

try{

const res = await api.get("/mentor/challenges");

setChallenges(res.data);

}catch(err){
console.error(err);
}

};

useEffect(()=>{
fetchChallenges();
},[]);

const handleDelete = async (challengeId) => {

const confirmDelete = window.confirm(
"Are you sure you want to delete this challenge?"
);

if(!confirmDelete) return;

try{

await api.delete(`mentor/challenges/${challengeId}`);

fetchChallenges();

}catch(err){
console.error(err);
}

};

return(

<div style={{padding:"20px"}}>

<h2>My Challenges</h2>

{challenges.length === 0 && (
<p>No challenges created</p>
)}

{challenges.map((challenge)=>(

<div
key={challenge._id}
style={{
border:"1px solid #ddd",
padding:"12px",
marginBottom:"12px",
borderRadius:"8px",
background:"#fafafa"
}}
>

{/* TITLE + TYPE BADGE */}

<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}>

<h3>{challenge.title}</h3>

<span
style={{
padding:"4px 8px",
borderRadius:"6px",
fontSize:"12px",
background:
challenge.type === "free"
? "#dcfce7"
: "#fde68a",
color:
challenge.type === "free"
? "#065f46"
: "#92400e"
}}
>
{challenge.type === "free" ? "FREE" : "PAID"}
</span>

</div>

<p>{challenge.totalDays} Days</p>

<p>Participants: {challenge.participantsCount || 0}</p>

<p>Revenue: ₹{challenge.revenue || 0}</p>

<p>Status: {challenge.approvalStatus}</p>

<button
onClick={()=>handleDelete(challenge._id)}
style={{
marginTop:"10px",
padding:"6px 12px",
borderRadius:"6px",
border:"none",
background:"#ef4444",
color:"white",
cursor:"pointer"
}}
>
Delete Challenge
</button>

</div>

))}

</div>

);

}

export default MentorChallenges;