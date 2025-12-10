import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import activitiesRoutes from "./routes/activities.js";
import goalsRoutes from "./routes/goals.js";
// import chatbotRoute from "./routes/chatbot.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
// Enable CORS for local development (adjust origin as needed)
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/chatbot", chatbotRoute);
app.use("/api/activities", activitiesRoutes);
app.use("/api/goals", goalsRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
