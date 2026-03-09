import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const CreateChallenge = () => {

const navigate = useNavigate();

const [title,setTitle] = useState("");
const [description,setDescription] = useState("");
const [level,setLevel] = useState("beginner");
const [type,setType] = useState("free");
const [price,setPrice] = useState("");
const [circleId,setCircleId] = useState("");

const [circles,setCircles] = useState([]);

const [days,setDays] = useState([
{
dayNumber:1,
content:"",
resources:[]
}
]);

const totalDays = days.length;

useEffect(()=>{

const fetchCircles = async () => {

try{

const res = await api.get("/circles/my");

setCircles(res.data);

}catch(err){
console.error(err);
}

};

fetchCircles();

},[]);

const handleDayChange = (index,value)=>{

const updated = [...days];

updated[index].content = value;

setDays(updated);

};

const addDay = () => {

setDays([
...days,
{
dayNumber: days.length + 1,
content:"",
resources:[]
}
]);

};

const addResource = (dayIndex) => {

const updated = [...days];

updated[dayIndex].resources.push({
title:"",
url:""
});

setDays(updated);

};

const handleResourceChange = (dayIndex,resIndex,field,value)=>{

const updated = [...days];

updated[dayIndex].resources[resIndex][field] = value;

setDays(updated);

};

const handleSubmit = async (e)=>{

e.preventDefault();

try{

await api.post("/challenges",{
title,
description,
level,
type,
price: type==="paid" ? Number(price) : 0,
totalDays,
days,
circleId
});

alert("Challenge created");

navigate("/mentor/challenges");

}catch(err){

console.error(err.response?.data?.message || err.message);

}

};

return(

<div style={{padding:"20px",maxWidth:"750px"}}>

<h2>Create Challenge</h2>

<form onSubmit={handleSubmit}>

{/* TITLE */}

<input
placeholder="Challenge Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
style={input}
/>

{/* DESCRIPTION */}

<textarea
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
style={input}
/>

{/* LEVEL */}

<select
value={level}
onChange={(e)=>setLevel(e.target.value)}
style={input}
>

<option value="beginner">Beginner</option>
<option value="intermediate">Intermediate</option>
<option value="advanced">Advanced</option>

</select>

{/* TYPE */}

<select
value={type}
onChange={(e)=>setType(e.target.value)}
style={input}
>

<option value="free">Free</option>
<option value="paid">Paid</option>

</select>

{/* PRICE */}

{type==="paid" && (

<input
type="number"
placeholder="Price"
value={price}
onChange={(e)=>setPrice(e.target.value)}
style={input}
/>

)}

{/* CIRCLE */}

<select
value={circleId}
onChange={(e)=>setCircleId(e.target.value)}
style={input}
>

<option value="">Select Circle</option>

{circles.map(circle => (

<option key={circle._id} value={circle._id}>
{circle.name}
</option>

))}

</select>

<h3>Challenge Days</h3>

{days.map((day,index)=>(

<div key={index} style={dayBox}>

<h4>Day {day.dayNumber}</h4>

<textarea
placeholder="Day content"
value={day.content}
onChange={(e)=>handleDayChange(index,e.target.value)}
style={input}
/>

{/* RESOURCES */}

{/* RESOURCES (ONLY FOR PAID CHALLENGES) */}

{type === "paid" && (

<>

{day.resources.map((res,resIndex)=>(

<div key={resIndex} style={{marginTop:"10px"}}>

<input
placeholder="Resource Title"
value={res.title}
onChange={(e)=>
handleResourceChange(index,resIndex,"title",e.target.value)
}
style={input}
/>

<input
placeholder="Resource URL"
value={res.url}
onChange={(e)=>
handleResourceChange(index,resIndex,"url",e.target.value)
}
style={input}
/>

</div>

))}

<button
type="button"
onClick={()=>addResource(index)}
style={smallButton}
>
Add Resource
</button>

</>

)}

</div>

))}

<button
type="button"
onClick={addDay}
style={button}
>
Add Day
</button>

<br/>

<button
type="submit"
style={button}
>
Create Challenge
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
marginTop:"10px",
padding:"8px 16px",
borderRadius:"6px",
border:"none",
background:"#3b82f6",
color:"white",
cursor:"pointer"
};

const smallButton = {
marginTop:"8px",
padding:"5px 10px",
borderRadius:"6px",
border:"none",
background:"#10b981",
color:"white",
cursor:"pointer"
};

const dayBox = {
border:"1px solid #ddd",
padding:"12px",
marginBottom:"15px",
borderRadius:"8px",
background:"#fafafa"
};

export default CreateChallenge;