import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import "../../css/ApplyMentor.css";

const MentorStatus = () => {

const [status,setStatus] = useState(null);
const navigate = useNavigate();

useEffect(()=>{

const fetchStatus = async () => {

try{

const res = await api.get("/mentor/application-status");

setStatus(res.data.status);

}catch(err){
console.error(err);
}

};

fetchStatus();

},[]);

if(status === null){

return(
<div className="mentor-loading">
Loading application status...
</div>
);

}

return(

<div className="mentor-apply-page">

<div className="mentor-apply-card mentor-status-card">

<h2>Mentor Application Status</h2>


{/* PENDING */}

{status === "pending" && (

<div className="mentor-status pending">

<FiClock className="mentor-status-icon"/>

<h3>Application Submitted</h3>

<p>
Your mentor application is currently waiting for admin approval.
</p>

</div>

)}


{/* APPROVED */}

{status === "approved" && (

<div className="mentor-status approved">

<FiCheckCircle className="mentor-status-icon"/>

<h3>🎉 Congratulations!</h3>

<p>
Your mentor application has been approved.
You can now create circles and challenges.
</p>

<button
className="mentor-submit-btn"
onClick={()=>navigate("/mentor")}
>
Go to Dashboard
</button>

</div>

)}


{/* REJECTED */}

{status === "rejected" && (

<div className="mentor-status rejected">

<FiXCircle className="mentor-status-icon"/>

<h3>Application Rejected</h3>

<p>
Unfortunately your mentor application was not approved.
You can improve your contribution and apply again later.
</p>

</div>

)}

</div>

</div>

);

};

export default MentorStatus;