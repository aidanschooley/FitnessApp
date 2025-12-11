import { useState } from "react";
import WorkoutSummary from "./WorkoutSummary";

export default function ActivityAnalyzer() {
  const [activityType, setActivityType] = useState("Running");
  const [intensity, setIntensity] = useState("");
  const [response, setResponse] = useState("");

  // Running-specific inputs
  const [runDistance, setRunDistance] = useState("");
  const [runDuration, setRunDuration] = useState("");
  const [runPace, setRunPace] = useState("");
  const [runCadence, setRunCadence] = useState("");
  const [runElevation, setRunElevation] = useState("");

  // Biking-specific inputs
  const [bikeDistance, setBikeDistance] = useState("");
  const [bikeDuration, setBikeDuration] = useState("");
  const [bikeSpeed, setBikeSpeed] = useState("");
  const [bikeElevation, setBikeElevation] = useState("");
  const [bikeRPM, setBikeRPM] = useState("");

  // Swimming-specific inputs
  const [swimTime, setSwimTime] = useState("");
  const [swimStroke, setSwimStroke] = useState("");
  const [swimPace, setSwimPace] = useState("");
  const [swimDistance, setSwimDistance] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shouldAnalyze, setShouldAnalyze] = useState(true);

  //Workout Summary Offcanvas
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false)

  const getActivityData = () => {
    const user = localStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    const userId = parsedUser.idUsers;
    // console.log("Get User ID from localStorage:", parsedUser.idUsers);
    const baseData = {
      userid: userId,
      activityType: activityType,
      intensity: Number(intensity)
    };

    switch (activityType) {
      case "Running":
        return {
          ...baseData,
          distance: Number(runDistance),
          duration: runDuration,
          pace: runPace,
          cadence: Number(runCadence),
          elevation: Number(runElevation)
        };
      case "Biking":
        return {
          ...baseData,
          distance: bikeDistance,
          duration: bikeDuration,
          speed: bikeSpeed,
          elevation: bikeElevation,
          rpm: bikeRPM
        };
      case "Swimming":
        return {
          ...baseData,
          time: swimTime,
          stroke: swimStroke,
          pace: swimPace,
          distance: swimDistance
        };
      default:
        print(baseData)
        return baseData;
    }
  };

  async function handleSubmit() {
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      const validationError = validateRequiredFields();
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }

      const userData = getActivityData();

      if (shouldAnalyze) {
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
      } else {
        setResponse("Activity created successfully!");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Error processing activity");
    } finally {
      setLoading(false);
    }
  }

  const validateRequiredFields = () => {
    switch (activityType) {
      case "Running":
        if (!runDistance) return "Distance is required for Running";
        if (!runDuration) return "Duration is required for Running";
        if (!runPace) return "Pace is required for Running";
        break;
      case "Biking":
        if (!bikeDistance) return "Distance is required for Biking";
        if (!bikeDuration) return "Duration is required for Biking";
        if (!bikeSpeed) return "Speed is required for Biking";
        break;
      case "Swimming":
        if (!swimTime) return "Time is required for Swimming";
        if (!swimStroke) return "Stroke Type is required for Swimming";
        if (!swimPace) return "Pace is required for Swimming";
        if (!swimDistance) return "Distance is required for Swimming";
        break;
    }
    if (!intensity) return "Intensity is required";
    return null;
  };

  const renderActivityInputs = () => {
    switch (activityType) {
      case "Running":
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', margin: '10px 0' }}>
            <input className="mx-2" placeholder="Distance (miles) *" value={runDistance} onChange={(e) => setRunDistance(e.target.value)} required style={{ flex: '1', minWidth: '140px' }} />
            <input className="mx-2" placeholder="Duration (minutes) *" value={runDuration} onChange={(e) => setRunDuration(e.target.value)} required style={{ flex: '1', minWidth: '140px' }} />
            <input className="mx-2" placeholder="Pace (min/mile) *" value={runPace} onChange={(e) => setRunPace(e.target.value)} required style={{ flex: '1', minWidth: '140px' }} />
            <input className="mx-2" placeholder="Cadence (steps/min)" value={runCadence} onChange={(e) => setRunCadence(e.target.value)} style={{ flex: '1', minWidth: '140px' }} />
            <input className="mx-2" placeholder="Elevation Gain (feet)" value={runElevation} onChange={(e) => setRunElevation(e.target.value)} style={{ flex: '1', minWidth: '140px' }} />
            <input className="mx-2" placeholder="Intensity (1-10) *" value={intensity} onChange={(e) => setIntensity(e.target.value)} required style={{ flex: '1', minWidth: '140px' }} />
          </div>
        );
      case "Biking":
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', margin: '10px 0' }}>
            <input className="mx-2" placeholder="Distance (miles) *" value={bikeDistance} onChange={(e) => setBikeDistance(e.target.value)} required style={{ flex: '1', minWidth: '140px' }} />
            <input className="mx-2" placeholder="Duration (minutes) *" value={bikeDuration} onChange={(e) => setBikeDuration(e.target.value)} required style={{ flex: '1', minWidth: '140px' }} />
            <input className="mx-2" placeholder="Speed (mph) *" value={bikeSpeed} onChange={(e) => setBikeSpeed(e.target.value)} required style={{ flex: '1', minWidth: '140px' }} />
            <input className="mx-2" placeholder="RPM" value={bikeRPM} onChange={(e) => setBikeRPM(e.target.value)} style={{ flex: '1', minWidth: '140px' }} />
            <input className="mx-2" placeholder="Elevation Gain (feet)" value={bikeElevation} onChange={(e) => setBikeElevation(e.target.value)} style={{ flex: '1', minWidth: '140px' }} />
            <input className="mx-2" placeholder="Intensity (1-10) *" value={intensity} onChange={(e) => setIntensity(e.target.value)} required style={{ flex: '1', minWidth: '140px' }} />
          </div>
        );
      case "Swimming":
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', margin: '10px 0' }}>
            <input className="mx-2" placeholder="Time (minutes) *" value={swimTime} onChange={(e) => setSwimTime(e.target.value)} required style={{ flex: '1', minWidth: '140px' }} />
            <input className="mx-2" placeholder="Distance (meters) *" value={swimDistance} onChange={(e) => setSwimDistance(e.target.value)} required style={{ flex: '1', minWidth: '140px' }} />
            <input className="mx-2" placeholder="Pace (min/100m) *" value={swimPace} onChange={(e) => setSwimPace(e.target.value)} required style={{ flex: '1', minWidth: '140px' }} />
            <input className="mx-2" placeholder="Stroke Type *" value={swimStroke} onChange={(e) => setSwimStroke(e.target.value)} required style={{ flex: '1', minWidth: '140px' }} />
            <input className="mx-2" placeholder="Intensity (1-10) *" value={intensity} onChange={(e) => setIntensity(e.target.value)} required style={{ flex: '1', minWidth: '140px' }} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h2>Create and Analyze Activity</h2>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
      <select value={activityType} onChange={(e) => setActivityType(e.target.value)}>
        <option>Running</option>
        <option>Biking</option>
        <option>Swimming</option>
      </select>
      </div>
      <p style={{ fontStyle: 'italic' }}>* indicates required fields</p>

      {renderActivityInputs()}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh', gap: '10px' }}>
        <label>
          <input 
            type="checkbox" 
            checked={shouldAnalyze} 
            onChange={(e) => setShouldAnalyze(e.target.checked)} 
          />
          Analyze Activity
        </label>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? (shouldAnalyze ? "Creating and Analyzing..." : "Creating...") : (shouldAnalyze ? "Create and Analyze" : "Create")}
      </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {response && (
        <div>
          <WorkoutSummary
          aiResponse={response}
          userData={getActivityData()}
         />
        </div>
      
      )}
    </div>
  );
}
