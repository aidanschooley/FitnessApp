import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatbotRoute from "./routes/chatbot.js";

const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());
// Enable CORS for local development (adjust origin as needed)
app.use(cors());

// Test route
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

app.use("/api/chatbot", chatbotRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});