import ChallengeReview from "../models/ChallengeReview.js";

export const addReview = async (req,res) => {

  try{

    const { rating, review } = req.body;
    const challengeId = req.params.challengeId;

    const existing = await ChallengeReview.findOne({
      user:req.user.id,
      challenge:challengeId
    });

    if(existing){
      return res.status(400).json({
        message:"You already reviewed this challenge"
      });
    }

    const newReview = new ChallengeReview({
      user:req.user.id,
      challenge:challengeId,
      rating,
      review
    });

    await newReview.save();

    res.json({message:"Review added successfully"});

  }catch(err){
    console.error(err);
    res.status(500).json({message:"Failed to add review"});
  }

};
export const getChallengeReviews = async (req,res)=>{

  try{

    const reviews = await ChallengeReview.find({
      challenge:req.params.challengeId
    })
    .populate("user","name");

    res.json(reviews);

  }catch(err){
    console.error(err);
    res.status(500).json({message:"Failed to load reviews"});
  }

};
export const updateReview = async (req,res)=>{

  try{

    const review = await ChallengeReview.findById(req.params.reviewId);

    if(!review){
      return res.status(404).json({message:"Review not found"});
    }

    if(review.user.toString() !== req.user.id){
      return res.status(403).json({message:"Unauthorized"});
    }

    review.rating = req.body.rating;
    review.review = req.body.review;

    await review.save();

    res.json({message:"Review updated"});

  }catch(err){
    res.status(500).json({message:"Update failed"});
  }

};
