import 'bootstrap/dist/css/bootstrap.min.css';
function DashCard({content}) {
    return (

        <div className="card m-3" style={{width: "18rem"}}>
        <div className="card-body"> 
        <h5 className="card-title">{content.title}</h5>
        <h6 className="card-subtitle mb-2 text-body-secondary">{content.content}</h6>
        <p className="card-text">{content.defaultValue}</p>
        </div>
        </div>
    );
}

export default DashCard;