import 'bootstrap/dist/css/bootstrap.min.css';
import HealthData from './healthdata';
function DashCard({content}) {
    function Distance() {
        switch(content.title) {
            case 'Distance':
                return <><a href="workout"><button  className="btn btn-primary">New Workout</button></a></>;
        }}
    return (

        <div className="card m-3" style={{width: "18rem"}}>
        <div className="card-body"> 
        <h5 className="card-title">{content.title}</h5>
        <h6 className="card-subtitle mb-2 text-body-secondary">{content.content}</h6>
        <p className="card-text">{content.defaultValue}</p>
        {Distance(content.title)}
        </div>
        </div>
    );
}


export default DashCard;