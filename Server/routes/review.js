import express from "express";
import {
  addReview,
  deleteReview,
  getAllReviews,
  getReview,
  getReviewsOfUser,
} from "../controllers/review.js";

const reviewRouter = express.Router();

reviewRouter.route("/new").post(addReview);
reviewRouter.route("/all").get(getAllReviews);
reviewRouter.route("/:_reviewId").get(getReview);
reviewRouter.route("/get/:_userId").get(getReviewsOfUser);
reviewRouter.route("/:_userId/:_reviewId").delete(deleteReview);

export default reviewRouter;
