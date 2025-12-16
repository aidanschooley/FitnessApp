import { useState, useEffect } from "react";
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

  // Notes
  const [notes, setNotes] = useState("");

  // Helpers to calculate and format pace/speed
  const parseTimeToMinutes = (input) => {
    if (input === null || input === undefined) return NaN;
    const s = String(input).trim();
    if (s === "") return NaN;
    // If it's a plain number (minutes), accept it
    if (!s.includes(':')) {
      const n = parseFloat(s);
      return isFinite(n) ? n : NaN;
    }

    const parts = s.split(':').map(p => p.trim());
    // support mm:ss or h:mm:ss
    if (parts.length === 2) {
      const mins = parseInt(parts[0], 10);
      const secs = parseFloat(parts[1]);
      if (!isFinite(mins) || !isFinite(secs)) return NaN;
      return (mins * 60 + secs) / 60;
    }
    if (parts.length === 3) {
      const hrs = parseInt(parts[0], 10);
      const mins = parseInt(parts[1], 10);
      const secs = parseFloat(parts[2]);
      if (!isFinite(hrs) || !isFinite(mins) || !isFinite(secs)) return NaN;
      return (hrs * 3600 + mins * 60 + secs) / 60;
    }
    return NaN;
  };

  const formatMinSec = (minutesPerUnit) => {
    if (!isFinite(minutesPerUnit) || minutesPerUnit <= 0) return "";
    const totalSeconds = Math.round(minutesPerUnit * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-calc running pace (min/mile) when distance or duration change
  useEffect(() => {
    const d = parseFloat(runDistance);
    const t = parseTimeToMinutes(runDuration);
    if (d > 0 && t > 0) {
      const paceMinPerMile = t / d; // duration is in minutes
      setRunPace(formatMinSec(paceMinPerMile));
    }
  }, [runDistance, runDuration]);

  // Auto-calc biking speed (mph) when distance or duration change
  useEffect(() => {
    const d = parseFloat(bikeDistance);
    const t = parseTimeToMinutes(bikeDuration);
    if (d > 0 && t > 0) {
      const hours = t / 60;
      const mph = d / hours;
      setBikeSpeed(isFinite(mph) ? mph.toFixed(2) : "");
    }
  }, [bikeDistance, bikeDuration]);

  // Auto-calc swim pace (min/100yds) when time or distance change
  useEffect(() => {
    const d = parseFloat(swimDistance);
    const t = parseTimeToMinutes(swimTime);
    if (d > 0 && t > 0) {
      const pacePer100 = (t * 100) / d; // minutes per 100yds
      setSwimPace(formatMinSec(pacePer100));
    }
  }, [swimDistance, swimTime]);

  const getActivityData = () => {
    const user = localStorage.getItem('user');
    if (!user) throw new Error('User not logged in');
    let parsedUser;
    try {
      parsedUser = JSON.parse(user);
    } catch (e) {
      throw new Error('Invalid user data in localStorage; please log in again');
    }
    const userId = parsedUser && parsedUser.idUsers;
    if (!userId) throw new Error('User ID missing; please log in');
    const baseData = {
      userid: userId,
      activityType: activityType,
      intensity: Number(intensity),
      notes: notes || null
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
          distance: Number(swimDistance),
          duration: swimTime,
          pace: swimPace,
          stroke: swimStroke
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
        const aiUserData = { ...userData };
        // Do not send notes to the AI
        delete aiUserData.notes;

        // Fetch active goals for the user and include them in the AI input
        let goals = [];
        try {
          const gRes = await fetch(`http://localhost:5000/api/goals/${userData.userid}?active=true`);
          if (gRes.ok) {
            goals = await gRes.json();
          } else {
            console.warn('Failed to fetch goals for AI context');
          }
        } catch (e) {
          console.warn('Error fetching goals for AI context', e);
        }

        const res = await fetch("http://localhost:5000/api/chatbot/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ activityType, userData: aiUserData, goals })
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Request failed (${res.status})`);
        }

        const text = await res.text();
        console.log("Raw response:", text);

        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error("Server did not return valid JSON");
        }

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
            <input className="mx-2" placeholder="Distance (miles) *" value={runDistance} onChange={(e) => setRunDistance(e.target.value)} required style={{ flex: '1', minWidth: '200px' }} />
            <input className="mx-2" placeholder="Duration (mm:ss or h:mm:ss) *" value={runDuration} onChange={(e) => setRunDuration(e.target.value)} required style={{ flex: '1', minWidth: '200px' }} />
            <input className="mx-2" placeholder="Pace (min/mile) *" value={runPace} onChange={(e) => setRunPace(e.target.value)} required style={{ flex: '1', minWidth: '200px' }} />
            <input className="mx-2" placeholder="Cadence (steps/min)" value={runCadence} onChange={(e) => setRunCadence(e.target.value)} style={{ flex: '1', minWidth: '200px' }} />
            <input className="mx-2" placeholder="Elevation Gain (feet)" value={runElevation} onChange={(e) => setRunElevation(e.target.value)} style={{ flex: '1', minWidth: '200px' }} />
            <input className="mx-2" placeholder="Intensity (1-10) *" value={intensity} onChange={(e) => setIntensity(e.target.value)} required style={{ flex: '1', minWidth: '200px', maxWidth: '221px' }} />
          </div>
        );
      case "Biking":
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', margin: '10px 0' }}>
            <input className="mx-2" placeholder="Distance (miles) *" value={bikeDistance} onChange={(e) => setBikeDistance(e.target.value)} required style={{ flex: '1', minWidth: '200px' }} />
            <input className="mx-2" placeholder="Duration (mm:ss or h:mm:ss) *" value={bikeDuration} onChange={(e) => setBikeDuration(e.target.value)} required style={{ flex: '1', minWidth: '200px' }} />
            <input className="mx-2" placeholder="Speed (mph) *" value={bikeSpeed} onChange={(e) => setBikeSpeed(e.target.value)} required style={{ flex: '1', minWidth: '200px' }} />
            <input className="mx-2" placeholder="RPM" value={bikeRPM} onChange={(e) => setBikeRPM(e.target.value)} style={{ flex: '1', minWidth: '200px' }} />
            <input className="mx-2" placeholder="Elevation Gain (feet)" value={bikeElevation} onChange={(e) => setBikeElevation(e.target.value)} style={{ flex: '1', minWidth: '200px' }} />
            <input className="mx-2" placeholder="Intensity (1-10) *" value={intensity} onChange={(e) => setIntensity(e.target.value)} required style={{ flex: '1', minWidth: '200px', maxWidth: '221px' }} />
          </div>
        );
      case "Swimming":
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', margin: '10px 0' }}>
            <input className="mx-2" placeholder="Time (mm:ss or h:mm:ss) *" value={swimTime} onChange={(e) => setSwimTime(e.target.value)} required style={{ flex: '1', minWidth: '140px' }} />
            <input className="mx-2" placeholder="Distance (yards) *" value={swimDistance} onChange={(e) => setSwimDistance(e.target.value)} required style={{ flex: '1', minWidth: '200px' }} />
            <input className="mx-2" placeholder="Pace (min/100yds) *" value={swimPace} onChange={(e) => setSwimPace(e.target.value)} required style={{ flex: '1', minWidth: '200px' }} />
            <input className="mx-2" placeholder="Stroke Type *" value={swimStroke} onChange={(e) => setSwimStroke(e.target.value)} required style={{ flex: '1', minWidth: '200px' }} />
            <input className="mx-2" placeholder="Intensity (1-10) *" value={intensity} onChange={(e) => setIntensity(e.target.value)} required style={{ flex: '1', minWidth: '200px' }} />
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
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          style={{ width: '80%', minWidth: '220px', padding: '8px' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh', gap: '10px' }}>
        <label>
          <input 
            style={{ marginRight: "5px" }}
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
