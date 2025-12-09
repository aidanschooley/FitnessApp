import express from "express";
import { uploadActivity } from "../controllers/activities.js";
import e from "express";

const router = express.Router();

router.post("/upload", uploadActivity);
// router.get("/summary", getActivitySummary);

export default router;
