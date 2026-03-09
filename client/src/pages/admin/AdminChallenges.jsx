import { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminChallenges = () => {

  const [challenges,setChallenges] = useState([]);
const [expanded, setExpanded] = useState(null);
  const fetchChallenges = async () => {

    try{

      const res = await api.get("/admin/challenges/pending");

      setChallenges(res.data);

    }catch(err){

      console.error(err);

    }

  };
  const togglePreview = (id) => {
  if (expanded === id) {
    setExpanded(null);
  } else {
    setExpanded(id);
  }
};

  useEffect(()=>{

    fetchChallenges();

  },[]);
const approve = async (id) => {
  try {

    await api.patch(`/admin/challenges/${id}/approve`);

    fetchChallenges();

  } catch (err) {
    console.error(err);
  }
};
const reject = async (id) => {
  try {

    await api.patch(`/admin/challenges/${id}/reject`);

    fetchChallenges();

  } catch (err) {
    console.error(err);
  }
};

  return (

    <div style={{padding:"20px",maxWidth:"700px"}}>

      <h2>Pending Challenges</h2>

      {challenges.length === 0 && (
        <p>No pending challenges</p>
      )}

     {challenges.map((challenge) => (

  <div key={challenge._id} className="admin-card">

    <h3>{challenge.title}</h3>

    <p><strong>Mentor:</strong> {challenge.mentor?.name}</p>
    <p><strong>Circle:</strong> {challenge.circle?.name}</p>
    <p><strong>Level:</strong> {challenge.level}</p>
    <p><strong>Days:</strong> {challenge.totalDays}</p>

    <p>
      <strong>Type:</strong>{" "}
      {challenge.type === "free"
        ? "Free"
        : `₹${challenge.price}`}
    </p>

    <button onClick={() => togglePreview(challenge._id)}>
      {expanded === challenge._id ? "Hide Preview" : "View Details"}
    </button>

    {expanded === challenge._id && (
      <div className="challenge-preview">

        <p>{challenge.description}</p>

        {challenge.days.map((day) => (
          <div key={day.dayNumber} className="day-box">

            <h4>Day {day.dayNumber}</h4>

            <p>{day.content}</p>

            {day.resources?.map((res, index) => (
              <a
                key={index}
                href={res.url}
                target="_blank"
                rel="noreferrer"
              >
                {res.title}
              </a>
            ))}

          </div>
        ))}

      </div>
    )}

    <div className="admin-buttons">

      <button
        onClick={() => approve(challenge._id)}
        className="approve-btn"
      >
        Approve
      </button>

      <button
        onClick={() => reject(challenge._id)}
        className="reject-btn"
      >
        Reject
      </button>

    </div>

  </div>

))}

    </div>

  );

};

export default AdminChallenges;