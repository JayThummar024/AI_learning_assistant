import express from "express";

import Document from "../models/Document.js";
import Flascard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import { extractFromPdf } from "../utils/pdfParser.js";
import { chunkText } from "../utils/textChunker.js";

import fs from "fs";
import mongoose from "mongoose";

//@desc Upload a new Document
//@route POST /api/documents/upload
//@access Private
export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
        statusCode: 400,
      });
    }
    const { title, description } = req.body;
    const filePath = req.file.path;
    const extractedText = await extractFromPdf(filePath);
    const textChunks = chunkText(extractedText, 1000); // Chunk size of 1000 characters
    const document = new Document({
      title,
      description,
      filePath,
      owner: req.user._id,
      textChunks,
    });
    await document.save();
    res.status(201).json({
      success: true,
      data: document,
      statusCode: 201,
    });
  } catch (error) {
    if (req.file) {
      await fs
        .unlink(req.file.path)
        .catch((err) => console.error("Failed to delete file after error:", err));
    }
    next(error);
  }
};

//@desc Get all Documents for the logged-in user
//@route GET /api/documents
//@access Private
export const getDocuments = async (req, res, next) => {

}

//@desc Get Document by ID
//@route GET /api/documents/:id
//@access Private
export const getDocumentById = async (req, res, next) => {

}

//@desc Update Document by ID
//@route PUT /api/documents/:id
//@access Private
export const updateDocument = async (req, res, next) => {

}

//@desc Delete Document by ID
//@route DELETE /api/documents/:id
//@access Private
export const deleteDocument = async (req, res, next) => {

}

