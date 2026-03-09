import { useEffect, useState } from "react";
import api from "../../api/axios";
const RightSidebar = () => {

const [circles,setCircles] = useState([]);
const [challenges,setChallenges] = useState([]);

const fetchData = async () => {

try{

const circlesRes = await api.get("/circles/top");

const challengesRes = await api.get("/challenges/popular");

setCircles(circlesRes.data);
setChallenges(challengesRes.data);

}catch(err){

console.error(err);

}

};

useEffect(()=>{

fetchData();

},[]);

return(

<div className="right-sidebar">

{/* Top Circles */}

<div className="right-card">

<h4>🔥 Top Circles</h4>

{circles.map(circle => (

<p key={circle._id}>
{circle.name}
</p>

))}

</div>

{/* Popular Challenges */}

<div className="right-card">

<h4>🏆 Popular Challenges</h4>

{challenges.map(ch => (

<p key={ch._id}>
{ch.title}
</p>

))}

</div>

</div>

);

};

export default RightSidebar;