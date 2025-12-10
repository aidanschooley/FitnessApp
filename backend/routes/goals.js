import express from "express";
import { createGoal} from "../controllers/goalsController.js";

// getGoals, updateGoal, deleteGoal 

const router = express.Router();

router.post("/newGoal", createGoal);
// router.get("/:userId", getGoals);
// router.put("/:goalId", updateGoal);
// router.delete("/:goalId", deleteGoal);

export default router;