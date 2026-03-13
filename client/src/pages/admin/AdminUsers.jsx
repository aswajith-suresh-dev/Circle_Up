import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../css/AdminUsers.css";

const AdminUsers = () => {

  const [users,setUsers] = useState([]);
  const [search,setSearch] = useState("");

  const [roleFilter,setRoleFilter] = useState("all");
  const [sortOption,setSortOption] = useState("join");


  const fetchUsers = async () => {

    try{

      const res = await api.get("/admin/users");

      setUsers(res.data);

    }catch(err){
      console.error(err);
    }

  };


  useEffect(()=>{
    fetchUsers();
  },[]);



  const handleDelete = async (id,name) => {

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name}?`
    );

    if(!confirmDelete) return;

    try{

      await api.delete(`/admin/users/${id}`);

      setUsers(prev =>
        prev.filter(user => user._id !== id)
      );

    }catch(err){
      console.error(err);
    }

  };



  /* SEARCH */

  let filteredUsers = users.filter(user =>

    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())

  );



  /* ROLE FILTER */

  if(roleFilter !== "all"){

    filteredUsers = filteredUsers.filter(
      user => user.role === roleFilter
    );

  }



  /* SORTING */

  if(sortOption === "reputation"){

    filteredUsers.sort((a,b)=>

      (b.replyUpvotesCount + b.solvedRepliesCount) -
      (a.replyUpvotesCount + a.solvedRepliesCount)

    );

  }


  if(sortOption === "join"){

    filteredUsers.sort((a,b)=>

      new Date(b.createdAt) - new Date(a.createdAt)

    );

  }



  return(

    <div className="admin-users-page">

      <h2 className="admin-users-title">
        Platform Users
      </h2>


      {/* SEARCH */}

      <input
        className="admin-users-search"
        placeholder="Search users..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />


      {/* FILTERS */}

      <div className="admin-users-controls">

        <select
          value={roleFilter}
          onChange={(e)=>setRoleFilter(e.target.value)}
        >

          <option value="all">All Users</option>
          <option value="mentor">Mentors</option>
          <option value="contributor">Contributors</option>

        </select>


        <select
          value={sortOption}
          onChange={(e)=>setSortOption(e.target.value)}
        >

          <option value="join">
            Sort by Join Date
          </option>

          <option value="reputation">
            Sort by Reputation
          </option>

        </select>

      </div>



      {/* EMPTY */}

      {filteredUsers.length === 0 && (

        <p className="admin-users-empty">
          No users found
        </p>

      )}



      {/* USERS GRID */}

      <div className="admin-users-grid">

        {filteredUsers.map(user => (

          <div
            key={user._id}
            className="admin-users-card"
          >

            <h3>{user.name}</h3>

            <p>Email: {user.email}</p>

            <p>Role: {user.role}</p>

            <p>
              Upvotes: {user.replyUpvotesCount || 0}
            </p>

            <p>
              Solutions: {user.solvedRepliesCount || 0}
            </p>

            <p>
              Joined: {
                new Date(user.createdAt)
                .toLocaleDateString()
              }
            </p>


            <button
              className="admin-users-delete"
              onClick={()=>
                handleDelete(user._id,user.name)
              }
            >
              Delete User
            </button>

          </div>

        ))}

      </div>

    </div>

  );

};

export default AdminUsers;