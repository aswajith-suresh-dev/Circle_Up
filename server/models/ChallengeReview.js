import mongoose from "mongoose";

const challengeReviewSchema = new mongoose.Schema({

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  challenge:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Challenge",
    required:true
  },

  rating:{
    type:Number,
    min:1,
    max:5,
    required:true
  },

  review:{
    type:String,
    trim:true
  }

},{
  timestamps:true
});

export default mongoose.model("ChallengeReview",challengeReviewSchema);