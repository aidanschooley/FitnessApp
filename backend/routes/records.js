import express from "express";
import { getRecords, makeRecord } from "../controllers/recordsController.js";

const router = express.Router();

router.post("/makeRecord", makeRecord);
router.get("/:userId", getRecords);

export default router;