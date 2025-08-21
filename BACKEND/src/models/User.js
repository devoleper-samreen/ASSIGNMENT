import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 60 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, maxlength: 400 },
    role: { type: String, enum: ["admin", "user", "owner"], default: "user" },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
