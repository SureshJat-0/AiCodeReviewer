import mongoose, { mongo } from "mongoose";

const UserSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "review",
    },
  ],
});

const User = mongoose.model("user", UserSchema);

export default User;
