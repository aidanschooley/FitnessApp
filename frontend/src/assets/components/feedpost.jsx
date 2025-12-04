import 'bootstrap/dist/css/bootstrap.min.css';
function FeedPost() {
    return (
        <div className="parent-container">
        <div className="card mb-3" style={{maxWidth: "540px"}}>
        <div className="row g-0">
            <div className="col-md-4">
            <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fblank-profile-picture&psig=AOvVaw2GZiZM4b30yyYfonE89QJC&ust=1764949440642000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCOD51aCjpJEDFQAAAAAdAAAAABAE" className="img-fluid rounded-start" alt="..."/>
            </div>
            <div className="col-md-8">
            <div className="card-body">
                <h5 className="card-title">Workout</h5>
                <p className="card-text">Note... This is my workout</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                    <p>0 miles</p>
                    <p>0:00 min/mi</p>
                    <p>0:00</p>
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