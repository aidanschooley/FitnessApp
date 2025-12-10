import express from "express";
import { uploadActivity, getActivitySummary, getActivityById, updateActivity, deleteActivity, filterActivitiesByTypeDate} from "../controllers/activitiesController.js";
import e from "express";

const router = express.Router();

router.post("/upload", uploadActivity);
router.get("/summary", getActivitySummary);
router.get("/filter", filterActivitiesByTypeDate);
router.get("/:id", getActivityById);
router.put("/:id", updateActivity);
router.delete("/:id", deleteActivity);


export default router;
