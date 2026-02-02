import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema(
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
    messages: [{
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        relaventChunks: [{ type: [Number], default: [] }],
    }],
  },
  { timestamps: true },
);
    
//index for faster querying by userId and documentId
chatHistorySchema.index({ userId: 1, documentId: 1 });

const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);
export default ChatHistory;
