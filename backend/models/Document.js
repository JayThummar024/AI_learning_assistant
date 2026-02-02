import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },  
        title: {
            type: String,
            required: true,
        },  
        fileName: {
            type: String,
            required: true,
        },
        filePath: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number,
            required: true,
        },
        extractedText: {
            type: String,
            default: "",
        },
        chunkes : [
            {
                content: { type: String, required: true },
                pageNumber: { type: Number,  default: 0 },
                chunkIndex: { type: Number, required: true },
            }
        ],
        uploadedAt: { type: Date, default: Date.now },
        lastAccessed: { type: Date, default: Date.now },
        status : {
            type : String,
            enum : ['processing', 'ready', 'failed'],
            default : 'processing'
        }
    },
    { timestamps: true },
);

// index for faster querying by userId
documentSchema.index({ userId: 1, uploadedAt: -1 });

const Document = mongoose.model("Document", documentSchema);
export default Document;
