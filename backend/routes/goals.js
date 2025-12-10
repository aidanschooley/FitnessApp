import express from "express";
import { createGoal, getGoals, updateGoal, deleteGoal } from "../controllers/goalsController.js";

// 

const router = express.Router();

router.post("/newGoal", createGoal);
router.get("/:userId", getGoals);
router.put("/:goalId", updateGoal);
router.delete("/:goalId", deleteGoal);

export default router;