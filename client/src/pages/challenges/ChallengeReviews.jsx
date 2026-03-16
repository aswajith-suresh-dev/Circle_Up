import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "../../css/ChallengeReviews.css";

const ChallengeReviews = () => {

  const { challengeId } = useParams();
  const { user } = useAuth();

  const [rating,setRating] = useState("");
  const [review,setReview] = useState("");
  const [reviews,setReviews] = useState([]);

  const [snackbar,setSnackbar] = useState("");

  const [editingId,setEditingId] = useState(null);
  const [isEditing,setIsEditing] = useState(false);

  const showSnackbar = (msg) => {
    setSnackbar(msg);
    setTimeout(()=>setSnackbar(""),2500);
  };

  const fetchReviews = async () => {

    try{

      const res = await api.get(`/reviews/${challengeId}`);

      const myReview = res.data.filter(
        r => r.user?._id === user?._id
      );

      setReviews(myReview);

      if(myReview.length > 0){

        setEditingId(myReview[0]._id);
        setRating(myReview[0].rating);
        setReview(myReview[0].review);

      }

    }catch(err){

      console.error(err);
      showSnackbar("Failed to load review");

    }

  };

  useEffect(()=>{
    if(user){
      fetchReviews();
    }
  },[challengeId,user]);


  const submitReview = async () => {

    if(!rating){
      showSnackbar("Please select a rating");
      return;
    }

    if(!review.trim()){
      showSnackbar("Please write a review");
      return;
    }

    try{

      if(editingId){

        await api.put(`/reviews/${editingId}`,{
          rating,
          review
        });

        showSnackbar("Review updated");

      }else{

        await api.post(`/reviews/${challengeId}`,{
          rating,
          review
        });

        showSnackbar("Review submitted");

      }

      setIsEditing(false);
      fetchReviews();

    }catch(err){

      showSnackbar(
        err.response?.data?.message || "Failed to submit review"
      );

    }

  };


  return(

    <div className="challenge-review-page">

      <h2>Your Review</h2>

      {/* FORM */}

      {(isEditing || reviews.length === 0) && (

        <div className="challenge-review-form">

          <select
            value={rating}
            onChange={(e)=>setRating(e.target.value)}
          >
            <option value="">Rating</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="2">⭐⭐</option>
            <option value="1">⭐</option>
          </select>

          <textarea
            placeholder="Write your review"
            value={review}
            onChange={(e)=>setReview(e.target.value)}
          />

          <div className="review-buttons">

            <button
              className="btn-submit"
              onClick={submitReview}
            >
              {editingId ? "Update Review" : "Submit Review"}
            </button>

            {editingId && (

              <button
                className="btn-cancel"
                onClick={()=>{

                  setIsEditing(false);

                }}
              >
                Cancel
              </button>

            )}

          </div>

        </div>

      )}


      {/* SHOW USER REVIEW */}

      {!isEditing && reviews.length > 0 && (

        <div className="challenge-review-card">

          <h4>{user?.name}</h4>

          <p>{"⭐".repeat(rating)}</p>

          <p>{review}</p>

          <div className="review-actions">

            <button
              className="btn-secondary"
              onClick={()=>setIsEditing(true)}
            >
              Edit Review
            </button>

          </div>

        </div>

      )}


      {/* SNACKBAR */}

      {snackbar && (

        <div className="snackbar">
          {snackbar}
        </div>

      )}

    </div>

  );

};

export default ChallengeReviews;