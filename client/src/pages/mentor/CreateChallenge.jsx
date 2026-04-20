// src/pages/mentor/CreateChallenge.jsx

import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

import "../../css/CreateChallenge.css";

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

  /* FETCH MENTOR CIRCLES */

  useEffect(()=>{
    const fetchCircles = async () => {
      try{
        const res = await api.get("/mentor/circles");
        setCircles(res.data);
      }catch(err){
        console.error(err);
      }
    };

    fetchCircles();
  },[]);

  /* DAY CONTENT CHANGE */

  const handleDayChange = (index,value)=>{
    const updated = [...days];
    updated[index].content = value;
    setDays(updated);
  };

  /* ADD DAY */

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

  /* ADD RESOURCE */

  const addResource = (dayIndex) => {
    const updated = [...days];
    updated[dayIndex].resources.push({
      title:"",
      url:""
    });
    setDays(updated);
  };

  /* RESOURCE CHANGE */

  const handleResourceChange = (dayIndex,resIndex,field,value)=>{
    const updated = [...days];
    updated[dayIndex].resources[resIndex][field] = value;
    setDays(updated);
  };

  /* SUBMIT */

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
    <div className="create-challenge-page">

      <h2 className="create-challenge-title">
        Create Challenge
      </h2>

      <form onSubmit={handleSubmit} className="challenge-form">

        {/* TITLE */}
        <input
          className="challenge-input"
          placeholder="Challenge Title" 
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          required
        />

        {/* DESCRIPTION */}
        <textarea
          className="challenge-textarea large-textarea"
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          required
        />

        {/* LEVEL */}
        <select
          className="challenge-select"
          value={level}
          onChange={(e)=>setLevel(e.target.value)}
          required
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        {/* TYPE */}
        <select
          className="challenge-select"
          value={type}
          onChange={(e)=>setType(e.target.value)}
          required
        >
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>

        {/* PRICE */}
        {type==="paid" && (
          <input
            type="number"
            className="challenge-input"
            placeholder="Price"
            value={price}
            onChange={(e)=>setPrice(e.target.value)}
            required
            min="1"
          />
        )}

        {/* SELECT CIRCLE */}
        <select
          className="challenge-select"
          value={circleId}
          onChange={(e)=>setCircleId(e.target.value)}
          required
        >
          <option value="">Select Circle</option>

          {circles.map(circle => (
            <option key={circle._id} value={circle._id}>
              {circle.name}
            </option>
          ))}
        </select>

        {/* CHALLENGE DAYS */}
        <h3 className="challenge-days-title">
          Challenge Days
        </h3>

        {days.map((day,index)=>(
          <div key={index} className="day-card">

            <h4>Day {day.dayNumber}</h4>

            <textarea
              className="challenge-textarea large-textarea"
              placeholder="Day content"
              value={day.content}
              onChange={(e)=>handleDayChange(index,e.target.value)}
              required
            />

            {/* RESOURCES */}
            {type === "paid" && (
              <>
                {day.resources.map((res,resIndex)=>(
                  <div key={resIndex} className="resource-box">

                    <input
                      className="challenge-input"
                      placeholder="Resource Title"
                      value={res.title}
                      onChange={(e)=>
                        handleResourceChange(index,resIndex,"title",e.target.value)
                      }
                      required
                    />

                    <input
                      className="challenge-input"
                      placeholder="Resource URL"
                      value={res.url}
                      onChange={(e)=>
                        handleResourceChange(index,resIndex,"url",e.target.value)
                      }
                      required
                    />

                  </div>
                ))}

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={()=>addResource(index)}
                >
                  Add Resource
                </button>
              </>
            )}

          </div>
        ))}

        {/* ADD DAY */}
        <button
          type="button"
          className="add-day-btn"
          onClick={addDay}
        >
          Add Day
        </button>

        {/* SUBMIT */}
        <button
          type="submit"
          className="submit-btn"
        >
          Create Challenge
        </button>

      </form>
    </div>
  );
};

export default CreateChallenge;