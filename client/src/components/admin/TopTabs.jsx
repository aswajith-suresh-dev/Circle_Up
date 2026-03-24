import { useState } from "react";

const TopTabs = ({ data }) => {

  const [active,setActive] = useState("mentors");

  let list = [];

  if(active==="circles") list = data.topCircles;
  if(active==="challenges") list = data.topChallenges;
  if(active==="users") list = data.topUsers;
  if(active==="mentors") list = data.topMentors;

  return (

    <div className="admin-top-section">

      {/* Tabs */}

      <div className="admin-tabs">

        <button
          className={active==="circles" ? "active" : ""}
          onClick={()=>setActive("circles")}
        >
          Top Circles
        </button>

        <button
          className={active==="challenges" ? "active" : ""}
          onClick={()=>setActive("challenges")}
        >
           Top Challenges
        </button>

        <button
          className={active==="users" ? "active" : ""}
          onClick={()=>setActive("users")}
        >
           Top Users
        </button>

        <button
          className={active==="mentors" ? "active" : ""}
          onClick={()=>setActive("mentors")}
        >
           Top Mentors
        </button>

      </div>

      {/* Cards */}

      <div className="admin-top-cards">

        {list.map(item => (

          <div key={item._id} className="admin-top-card">

            {active==="circles" && (
              <>
                <h4>{item.name}</h4>
                <p>Topic: {item.topic}</p>
                
              </>
            )}

            {active==="challenges" && (
              <>
                <h4>{item.title}</h4>
                <p>Participants: {item.participantsCount}</p>
                <p>Level: {item.level}</p>
              </>
            )}

            {active==="users" && (
              <>
                <h4>{item.name}</h4>
                <p>Upvotes: {item.replyUpvotesCount}</p>
                <p>Solutions: {item.solvedRepliesCount}</p>
              </>
            )}

            {active==="mentors" && (
              <>
                <h4>{item.name}</h4>
                <p>Solutions: {item.solvedRepliesCount}</p>
                <p>Upvotes: {item.replyUpvotesCount}</p>
              </>
            )}

          </div>

        ))}

      </div>

    </div>

  );

};

export default TopTabs;