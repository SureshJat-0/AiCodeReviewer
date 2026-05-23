import express from "express";
import {
  addReview,
  deleteReview,
  getAllReviews,
  getReview,
  getReviewsOfUser,
} from "../controllers/review.js";
import auth from "../middlewares/auth.js";

const reviewRouter = express.Router();

reviewRouter.route("/new").post(addReview);
reviewRouter.route("/all").get(getAllReviews);
reviewRouter.route("/:_reviewId").get(getReview);
reviewRouter.route("/get/:_userId").get(auth, getReviewsOfUser);
reviewRouter.route("/:_userId/:_reviewId").delete(auth, deleteReview);

export default reviewRouter;
