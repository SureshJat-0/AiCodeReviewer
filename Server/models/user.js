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
  oauthProvider: {
    type: String,
    default: null,
  },
  oauthId: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    default: null,
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
