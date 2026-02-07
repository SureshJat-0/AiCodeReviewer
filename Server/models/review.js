import mongoose from "mongoose";

const ReviewSchema = mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
    },
    output: {
      summary: {
        type: String,
      },
      bugs: [
        {
          issue: {
            type: String,
            required: true,
          },
          severity: {
            type: String,
            required: true,
            enum: ["low", "medium", "high"],
          },
          explanation: {
            type: String,
            required: true,
          },
        },
      ],
      security: [
        {
          issue: {
            type: String,
            required: true,
          },
          severity: {
            type: String,
            required: true,
            enum: ["low", "medium", "high"],
          },
          explanation: {
            type: String,
            required: true,
          },
        },
      ],
      bestPractices: [
        {
          issue: {
            type: String,
            required: true,
          },
          severity: {
            type: String,
            required: true,
            enum: ["low", "medium", "high"],
          },
          explanation: {
            type: String,
            required: true,
          },
        },
      ],
      improvedCode: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

const Review = mongoose.model("review", ReviewSchema);

export default Review;
