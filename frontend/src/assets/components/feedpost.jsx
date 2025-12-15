import 'bootstrap/dist/css/bootstrap.min.css';
function FeedPost(props) {
    const { distance, duration, pace, elevationGained, cadence, intensity, picture, rpm, stroke, activityType, notes } = props;
    return (
        <div className="parent-container">
        <div className="card mb-3" style={{maxWidth: "540px"}}>
        <div className="row g-0">
            <div className="col-md-4">
            <img src="../images/runningman.png" className="img-fluid rounded-start" alt="running man"/>
            </div>
            <div className="col-md-8">
            <div className="card-body">
                <h5 className="card-title">{activityType}</h5>
                <p className="card-text">{notes}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                    <p>{distance} miles</p>
                    <p>{pace} min/mi</p>
                    <p>{duration}</p>
                </div>
                <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p>
            </div>
            </div>
        </div>
        </div>
        </div>
    )
}

export default FeedPost;