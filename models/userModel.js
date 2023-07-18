import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required:  true },
  email: { type: String, required: true },
  password: { type: String },
  id: { type: String },
  profilePicture : String,
  email_verified:{type : Boolean, default : false},
  country : String,
  follower : String,
  following : String
});

export default mongoose.model("User", userSchema);