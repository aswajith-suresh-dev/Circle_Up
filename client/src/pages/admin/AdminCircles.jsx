import { useEffect,useState } from "react";
import api from "../../api/axios";
import "../../css/AdminCircles.css";

const AdminCircles = () => {

const [circles,setCircles] = useState([]);
const [search,setSearch] = useState("");
const [sortOption,setSortOption] = useState("members");

const fetchCircles = async () => {

try{

const res = await api.get("/admin/circles");

setCircles(res.data);

}catch(err){
console.error(err);
}

};

useEffect(()=>{
fetchCircles();
},[]);



const handleDelete = async (id,name) => {

const confirmDelete = window.confirm(
`Delete circle "${name}" ?`
);

if(!confirmDelete) return;

try{

await api.delete(`/admin/circles/${id}`);

setCircles(prev =>
prev.filter(circle => circle._id !== id)
);

}catch(err){
console.error(err);
}

};



/* SEARCH */

let filteredCircles = circles.filter(circle =>

circle.name.toLowerCase().includes(search.toLowerCase()) ||
circle.topic.toLowerCase().includes(search.toLowerCase())

);



/* SORT */

if(sortOption === "members"){

filteredCircles.sort((a,b)=>
b.membersCount - a.membersCount
);

}

if(sortOption === "date"){

filteredCircles.sort((a,b)=>
new Date(b.createdAt) - new Date(a.createdAt)
);

}



return(

<div className="admin-circles-page">

<h2 className="admin-circles-title">
Platform Circles
</h2>


<input
className="admin-circles-search"
placeholder="Search circles..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>


<div className="admin-circles-controls">

<select
value={sortOption}
onChange={(e)=>setSortOption(e.target.value)}
>

<option value="members">
Sort by Members
</option>

<option value="date">
Sort by Created Date
</option>

</select>

</div>



{filteredCircles.length === 0 && (

<p className="admin-circles-empty">
No circles found
</p>

)}



<div className="admin-circles-grid">

{filteredCircles.map(circle => (

<div
key={circle._id}
className="admin-circles-card"
>

<h3>{circle.name}</h3>

<p>Topic: {circle.topic}</p>

<p>
Mentor: {circle.mentor?.name || "Unknown"}
</p>

<p>
Members: {circle.membersCount || 0}
</p>

<p>
Created: {
new Date(circle.createdAt)
.toLocaleDateString()
}
</p>


<button
className="admin-circles-delete"
onClick={()=>
handleDelete(circle._id,circle.name)
}
>

Delete Circle

</button>

</div>

))}

</div>

</div>

);

};

export default AdminCircles;