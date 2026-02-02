import mongoose from "mongoose";


const flashCardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
        required: true,
    },
    documentId: {
      type: String, 
        required: true, 
    },
    cards : [
        {   
            question: { type: String, required: true },
            answer: { type: String, required: true },
            explanation: { type: String, default: "" },
            difficulty: {
              type: String,
              enum: ["easy", "medium", "hard"],
              default: "medium",
            },
            lastReviewed: { type: Number, default: null },
            isStared: { type: Boolean, default: false  },
        }
    ],
  },
  { timestamps: true },
);

//index for faster querying by userId and documentId
flashCardSchema.index({ userId: 1, documentId: 1 });

const FlashCard = mongoose.model("FlashCard", flashCardSchema);
export default FlashCard;