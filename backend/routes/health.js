import express from "express";
import { updateHealthData, setHealthGoals, getHealthByUserId, setCurrentHealth, getHealthGoalsByUserId, updateCalorieIntake
, getCalorieIntakeByUserId, updateHydrationData, getHydrationDataByUserId, updateWeightData, getWeightDataByUserId
 } from "../controllers/healthController.js";


const router = express.Router();

router.post("/set", setCurrentHealth);
router.put("/update", updateHealthData);
router.put("/goals/set", setHealthGoals);
router.get("/goals/:userId", getHealthGoalsByUserId);

router.post("/calories/update", updateCalorieIntake);
router.get("/calories/:userId", getCalorieIntakeByUserId);

router.post("/hydration/update", updateHydrationData);
router.get("/hydration/:userId", getHydrationDataByUserId);

router.post("/weight/update", updateWeightData);
router.get("/weight/:userId", getWeightDataByUserId);

router.get("/:userId", getHealthByUserId);

export default router;