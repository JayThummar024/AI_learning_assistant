import mongoose from "mongoose";
import User from "./User.js";

const quizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doumentId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        validate: [(array) => array.length === 4, "Must provide exactly 4 options"],
        correctAnswer: { type: Number, required: true },
        explanation: { type: String, default: "" },
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },
      },
    ],

    userAnswers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, required: true },       
        selectedAnswer: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
        answeredAt: { type: Date, default: Date.now },
      },
    ],
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, required: true },
    completedAt: { type: Date , default: null },

  },
  { timestamps: true },
);


//index for faster querying by userId and documentId
quizSchema.index({ userId: 1, doumentId: 1 });

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;