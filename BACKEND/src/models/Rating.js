import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

export default mongoose.model("Rating", RatingSchema);
