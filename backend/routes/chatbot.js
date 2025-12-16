import express from "express";
import OpenAI from "openai";

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

router.post("/analyze", async (req, res) => {
  try {
    const { activityType, userData, goals = [] } = req.body;

    if (!activityType || !userData) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const systemMessage = {
      role: "system",
      content:
        "You are an athletic activity analyst that helps users summarize their daily activities and provides insights on improving their fitness routines. You will be given a small set of data from the user, including but not limited to activity type, duration [in format minutes:seconds], distance, and user's perceived intensity score out of 10. Note that unless specified, inputted data will be in imperial units. Heart rate data will not be included, so do not mention it in your response. Use this data to generate a concise summary of the user's activity and present some insights or further data you can gather from what was inputted. Then suggest 1 way to enhance their fitness regimen. You can also see the user's current goals if any were provided. If an activity clearly contributes to a goal, mention that in your summary. Otherwise, ignore the goals. Always respond in a positive and encouraging tone, and use at most 3 sentences in your response."
    };

    // Build a combined user message containing activity and goals so the AI can reason about both
    const combined = {
      activityType,
      activity: userData,
      goals
    };

    const response = await client.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        systemMessage,
        { role: "user", content: JSON.stringify(combined) }
      ]
    });

    const aiResponse = response.choices[0].message.content;
    res.json({ response: aiResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
