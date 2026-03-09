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

},[])

return(

<div style={{padding:"20px"}}>

<h2>My Challenges</h2>

{challenges.map((challenge)=>(

<div key={challenge._id}
style={{
border:"1px solid #ddd",
padding:"12px",
marginBottom:"10px"
}}>

<h3>{challenge.title}</h3>

<p>{challenge.totalDays} Days</p>
<p>Participants: {challenge.participants || 0}</p>

<p>Revenue: ₹{challenge.revenue || 0}</p>

</div>

))}

</div>

)

}

export default MentorChallenges;