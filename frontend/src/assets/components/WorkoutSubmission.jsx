import ActivityAnalyzer from "../components/ActivityAnalyzer.jsx";
import WorkoutSummary from "./WorkoutSummary.jsx";

function WorkoutSubmission() {
    return (
        <div>
            <ActivityAnalyzer />
            <WorkoutSummary 
            aiResponse={"this is your ai response"}
            userData={{ 
                type: "Running",
                distance: "5km",
                duration: "30min",
                pace: "6min/km",
                "perceived intensity": "7"
            }}
            />
        </div>
    );
}

export default WorkoutSubmission;