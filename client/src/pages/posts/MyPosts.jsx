import { useEffect,useState } from "react";
import api from "../../api/axios";

const MyPosts = () => {

const [posts,setPosts] = useState([]);

const fetchPosts = async () => {

try{

const res = await api.get("/posts/my");

setPosts(res.data);

}catch(err){
console.error(err);
}

};

useEffect(()=>{
fetchPosts();
},[]);

const deletePost = async (postId) => {

const confirmDelete = window.confirm("Delete this post?");

if(!confirmDelete) return;

try{

await api.delete(`/posts/${postId}`);

fetchPosts();

}catch(err){
console.error(err);
}

};

return(

<div style={{padding:"20px"}}>

<h2>My Posts</h2>

{posts.length === 0 && (
<p>You haven't created posts yet</p>
)}

{posts.map(post => (

<div
key={post._id}
style={{
border:"1px solid #ddd",
padding:"12px",
marginBottom:"12px",
borderRadius:"8px"
}}
>

<h3>{post.title}</h3>

<p>
{post.type} · {post.circle?.name}
</p>

<button
onClick={()=>deletePost(post._id)}
style={{
marginTop:"10px",
padding:"6px 12px",
border:"none",
borderRadius:"6px",
background:"#ef4444",
color:"white",
cursor:"pointer"
}}
>
Delete Post
</button>

</div>

))}

</div>

);

};

export default MyPosts;