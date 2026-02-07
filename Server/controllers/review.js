import Review from "../models/review.js";
import User from "../models/user.js";
import CustomExpressError from "../ExpressError.js";
import mongoose from "mongoose";

const addReview = async (req, res) => {
  try {
    const { input, output, userId } = req.body;
    const review = { input, output };
    if (!input || !output || !userId)
      throw new CustomExpressError(400, "All fields are required");
    const DbUser = await User.findById(userId);
    if (!DbUser) throw new CustomExpressError(400, "User does not exist");
    const dbReview = await Review.create(review);
    await User.findByIdAndUpdate(
      userId,
      { $push: { reviews: dbReview } },
      { new: true, runValidators: true },
    );
    res.status(201).send({
      status: "success",
      message: "Review added successfully",
      id: dbReview._id,
    });
  } catch (err) {
    console.log(err);
    throw new CustomExpressError(
      err.statusCode || 500,
      err.message || "Failed to add review to database. Please try again later",
    );
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).send(reviews);
  } catch (err) {
    console.log(err);
    throw new CustomExpressError(
      err.statusCode || 500,
      err.message || "Failed to retrieve reviews. Please try again later",
    );
  }
};

const getReview = async (req, res) => {
  try {
    const { _reviewId } = req.params;
    if (!_reviewId) throw new CustomExpressError(400, "Review ID is required");
    if (!mongoose.Types.ObjectId.isValid(_reviewId))
      throw new CustomExpressError(400, "Invalid ID formate");
    const review = await Review.findById(_reviewId);
    if (!review)
      throw new CustomExpressError(
        400,
        "Review you requested for does not exist",
      );
    res.status(200).json(review);
  } catch (err) {
    console.error(err);
    throw new CustomExpressError(
      err.statusCode || 500,
      err.message || "Failed to retrieve review. Please try again later",
    );
  }
};

const getReviewsOfUser = async (req, res) => {
  try {
    const { _userId } = req.params;
    if (!_userId) throw new CustomExpressError(400, "User ID is required");
    const user = await User.findById(_userId).populate("reviews");
    const reviews = user.reviews;
    res.status(200).json(reviews);
  } catch (err) {
    console.log(err);
    throw new CustomExpressError(
      err.statusCode || 500,
      err.message || "Failed to retrieve user reviews. Please try again later",
    );
  }
};

const deleteReview = async (req, res) => {
  try {
    const { _reviewId, _userId } = req.params;
    if (!_reviewId || !_userId)
      throw new CustomExpressError(400, "Review ID and User ID are required");
    const review = await Review.findById(_reviewId);
    if (!review) throw new CustomExpressError(404, "Review not found");
    const user = await User.findById(_userId);
    if (!user) throw new CustomExpressError(404, "User not found");
    const updatedUser = await User.findByIdAndUpdate(
      _userId,
      { $pull: { reviews: _reviewId } },
      { new: true },
    );
    if (!updatedUser) throw new CustomExpressError(404, "User not found");
    await Review.findByIdAndDelete(_reviewId);
    res
      .status(200)
      .send({ status: "success", message: "Review deleted successfully" });
  } catch (err) {
    console.error(err);
    throw new CustomExpressError(
      err.statusCode || 500,
      err.message || "Failed to delete review. Please try again later",
    );
  }
};

export { addReview, getAllReviews, deleteReview, getReviewsOfUser, getReview };
