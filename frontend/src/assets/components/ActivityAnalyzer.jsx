import { useState } from "react";
import WorkoutSummary from "./WorkoutSummary";

export default function ActivityAnalyzer() {
  const [activityType, setActivityType] = useState("Running");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [pace, setPace] = useState("");
  const [intensity, setIntensity] = useState("");
  const [response, setResponse] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeActivity() {
    setLoading(true);
    setError("");

    try {
      const userData = { 
        type: activityType,
        distance,
        duration,
        pace,
        "perceived intensity": intensity
      };

      const res = await fetch("http://localhost:5000/api/chatbot/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityType, userData })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      console.error("Analyze error:", err);
      setError(err.message || "Error analyzing activity");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Activity Analyzer</h2>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
      <select value={activityType} onChange={(e) => setActivityType(e.target.value)}>
        <option>Running</option>
        <option>Biking</option>
        <option>Swimming</option>
      </select>
      </div>

      <input className="mx-4" placeholder="Distance" value={distance} onChange={(e) => setDistance(e.target.value)} />
      <input className="mx-4" placeholder="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
      <input className="mx-4" placeholder="Pace" value={pace} onChange={(e) => setPace(e.target.value)} />
      <input className="mx-4" placeholder="Intensity (1-10)" value={intensity} onChange={(e) => setIntensity(e.target.value)} />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
      <button onClick={analyzeActivity} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {response && (
        <div>
          <WorkoutSummary
          aiResponse={response}
          userData={{ 
            type: activityType,
            distance,
            duration,
            pace,
            "perceived intensity": intensity
          }} />
          {/* <h3>AI Summary</h3>
          <p>{response}</p> */}
        </div>
      
      )}
    </div>
  );
}
