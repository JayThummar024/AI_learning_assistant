import express from "express";
import cors from "cors";
import {
    uploadDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../controllers/documentController.js";
import { protect } from "../middlewares/authMiddleware.js"; 
const router = express.Router();

router.use(protect);

// Routes for document management   
router.post("/upload", upload.single("file") , uploadDocument);
router.get("/", getDocuments);
router.get("/:id", getDocumentById);
router.put("/:id", updateDocument);
router.delete("/:id", deleteDocument);

export default router;