import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../css/AdminManageChallenges.css";

const AdminManageChallenges = () => {

  const [challenges,setChallenges] = useState([]);
  const [search,setSearch] = useState("");
  const [sortOption,setSortOption] = useState("participants");


  const fetchChallenges = async () => {

    try{

      const res = await api.get("/admin/challenges");

      setChallenges(res.data);

    }catch(err){
      console.error(err);
    }

  };


  useEffect(()=>{
    fetchChallenges();
  },[]);



  const handleDelete = async (id,title) => {

    const confirmDelete = window.confirm(
      `This will permanently delete "${title}". Continue?`
    );

    if(!confirmDelete) return;

    try{

      await api.delete(`/admin/challenges/${id}`);

      setChallenges(prev =>
        prev.filter(ch => ch._id !== id)
      );

    }catch(err){
      console.error(err);
    }

  };



  /* SEARCH */

  let filteredChallenges = challenges.filter(ch =>

    ch.title.toLowerCase().includes(search.toLowerCase()) ||
    ch.circle?.name?.toLowerCase().includes(search.toLowerCase())

  );



  /* SORT */

  if(sortOption === "participants"){

    filteredChallenges.sort((a,b)=>
      b.participantsCount - a.participantsCount
    );

  }


  if(sortOption === "date"){

    filteredChallenges.sort((a,b)=>
      new Date(b.createdAt) - new Date(a.createdAt)
    );

  }



  return(

    <div className="admin-manage-challenges-page">

      <h2 className="admin-manage-challenges-title">
        Manage Challenges
      </h2>


      <input
        className="admin-manage-challenges-search"
        placeholder="Search challenges..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />


      <div className="admin-manage-challenges-controls">

        <select
          value={sortOption}
          onChange={(e)=>setSortOption(e.target.value)}
        >

          <option value="participants">
            Sort by Participants
          </option>

          <option value="date">
            Sort by Created Date
          </option>

        </select>

      </div>



      {filteredChallenges.length === 0 && (

        <p className="admin-manage-challenges-empty">
          No challenges found
        </p>

      )}



      <div className="admin-manage-challenges-grid">

        {filteredChallenges.map(ch => (

          <div
            key={ch._id}
            className="admin-manage-challenges-card"
          >

            <h3>{ch.title}</h3>

            <p>Mentor: {ch.mentor?.name}</p>

            <p>Circle: {ch.circle?.name}</p>

            <p>Price: ₹{ch.price}</p>

            <p>
              Participants: {ch.participantsCount}
            </p>

            <p>
              Created: {
                new Date(ch.createdAt)
                .toLocaleDateString()
              }
            </p>


            <button
              className="admin-manage-challenges-delete"
              onClick={()=>handleDelete(ch._id,ch.title)}
            >
              Delete Challenge
            </button>

          </div>

        ))}

      </div>

    </div>

  );

};

export default AdminManageChallenges;