import "../../css/Testimonials.css";
import arjunImg from "../../assets/testimonials/arjun.jpg";
import meeraImg from "../../assets/testimonials/meera.jpg";
import rahulImg from "../../assets/testimonials/rahul.jpg";
import ananyaImg from "../../assets/testimonials/ananya.jpg";
import vishnuImg from "../../assets/testimonials/vishnu.jpg";
import snehaImg from "../../assets/testimonials/sneha.jpg";
const testimonials = [
{
title:"Great Learning Community",
text:"CircleUp helped me find people who share my interests. I can ask doubts and get helpful replies quickly.",
name:"Arjun Nair",
role:"Computer Science Student",
image:arjunImg
},
{
title:"Helpful Discussions",
text:"The discussions inside circles are very insightful. I often discover new ways to solve problems.",
name:"Meera Joseph",
role:"Frontend Developer",
image:meeraImg
},
{
title:"Motivating Challenges",
text:"Participating in challenges keeps me motivated to learn consistently and improve my skills effectively.",
name:"Rahul Menon",
role:"Contributor",
image:rahulImg
},
{
title:"Learning From Different Perspectives",
text:"Reading replies from other members helps me understand topics from different perspectives better.",
name:"Ananya Das",
role:"Student",
image:ananyaImg
},
{
title:"Sharing Knowledge",
text:"Answering doubts and helping others is very rewarding. Being recognized as a contributor feels great.",
name:"Vishnu Raj",
role:"Contributor",
image:vishnuImg
},
{
title:"Supportive Community",
text:"CircleUp feels like a real learning community where mentors and members support each other.",
name:"Sneha Krishnan",
role:"Developer",
image:snehaImg
}
];

const Testimonials = () => {
return (

<section className="testimonials-section">

<div className="testimonials-header">
<span>TESTIMONIALS</span>
<h2>What Our Community Says</h2>
<p>Real experiences from people learning and growing with CircleUp.</p>
</div>

<div className="testimonials-grid">

{testimonials.map((item,index)=>(
<div className="testimonial-card" key={index}>

<h4>{item.title}</h4>

<p className="testimonial-text">
{item.text}
</p>

<div className="testimonial-user">

<img
src={item.image}
alt={item.name}
className="avatar"
/>

<div>
<span className="user-name">{item.name}</span>
<span className="user-role">{item.role}</span>
</div>

</div>

</div>
))}

</div>

</section>

);
};

export default Testimonials;