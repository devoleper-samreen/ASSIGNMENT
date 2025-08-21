import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Store", StoreSchema);
