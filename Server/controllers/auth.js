import CustomExpressError from "../ExpressError.js";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
      throw new CustomExpressError(400, "All fields are required");
    const user = await User.findOne({ email });
    if (user)
      throw new CustomExpressError(400, "User with this email already exists");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      fullName,
      email,
      password: hashedPassword,
    };
    const createdUser = await User.create(newUser);
    console.log(createdUser);
    res.status(200).json({ message: "User created" });
  } catch (err) {
    console.error(err);
    throw new CustomExpressError(
      err.statusCode || 500,
      err.message || "Something went wrong",
    );
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new CustomExpressError(400, "All fields are required");
    const user = await User.findOne({ email });
    if (!user) throw new CustomExpressError(400, "Invalid Credentials");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new CustomExpressError(400, "Invalid Credentials");
    const token = getToken(user);
    res.status(200).json({
      user: { _id: user._id, fullName: user.fullName, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    throw new CustomExpressError(
      err.statusCode || 500,
      err.message || "Something went wrong",
    );
  }
};

function getToken(user) {
  const token = jwt.sign(
    { id: user.id, fullName: user.fullName, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "30d" },
  );
  return token;
}

export { signup, login };
