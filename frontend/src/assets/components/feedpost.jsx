import 'bootstrap/dist/css/bootstrap.min.css';
import { formatDistance, subDays } from 'date-fns'
function FeedPost(props) {
    const { distance, duration, pace, elevationGained, cadence, intensity, picture, rpm, stroke, activityType, notes } = props;
    function activityImage() {
        switch (activityType) {
            case 'Running':
                return "../images/runningman.png";
            case 'Biking':
                return "../images/bikingman.png";
            case 'Swimming':
                return "../images/swimmingman.png";
            default:
                return "../images/runningman.png";
        }
    }
    function activityTypePost() {
        switch (activityType) {
            case 'Running':
                return <>
                    <p>{distance} miles</p>
                    <p>{duration}</p>
                    <p>{pace} min/mi</p>
                    <p>Cadence: {cadence} spm</p>
                    <p>Elevation: {elevationGained} ft</p>
                    <p>Intensity: {intensity}</p>
                    </>;
            case 'Biking':
                return <>
                    <p>{distance} miles</p>
                    <p>{duration}</p>
                    <p>{pace} mph</p>
                    <p>{cadence} rpm</p>
                    <p>Elevation: {elevationGained} ft</p>
                    <p>Intensity: {intensity}</p>
                    </>;
            case 'Swimming':
                return <>
                    <p>{distance} yards</p>
                    <p>{duration}</p>
                    <p>{pace} min/100yds</p>
                    <p>{stroke}</p>
                    <p>Intensity: {intensity}</p>
                    </>;
        }
        function LastUpdated({dateString}) {
            const now = new Date(dateString);
            const minutesAgo = Math.floor((now - new Date(props.time)) / 60000);
            return (
                <small className="text-body-secondary">Created {minutesAgo}</small>
            );
        }
    return (
        <div className="parent-container">
        <div className="card mb-3" style={{maxWidth: "540px"}}>
        <div className="row g-0">
            <div className="col-md-4">
            <img src={activityImage()} className="img-fluid rounded-start" alt="running man"/>
            </div>
            <div className="col-md-8">
            <div className="card-body">
                <h5 className="card-title">{activityType}</h5>
                <p className="card-text">{notes}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                    {activityTypePost()}
                </div>
                <p className="card-text"><small className="text-body-secondary">{LastUpdated({dateString: props.time})}</small></p>
            </div>
            </div>
        </div>
        </div>
        </div>
    )
}
}

export default FeedPost;