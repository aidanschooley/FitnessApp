import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function WorkoutSummary({ aiResponse, userData }) {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  
  const submitWorkout = () => {
    console.log("Submitting workout:", JSON.stringify(userData));
    
     fetch('http://localhost:5000/api/activities/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((data) => {
            console.log(data);
                if (data.message === '"Activity uploaded successfully"') {
                  alert("Workout submitted!");
                  navigate("/", { replace: true });
                } else if (data.message === 'Missing Required Fields') {
                    alert('Missing Required Fields. Please check your input.');
                } else {
                    alert('Failed to upload activity. Please try again.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
  };
  return (
    <>
      <Offcanvas style={{ height: '55vh' }} show={show} onHide={handleClose} placement="bottom">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Workout Summary</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            {aiResponse && aiResponse !== "Activity created successfully!" ? (
              <>
                <h5>AI Summary</h5>
                <p>{aiResponse}</p>
              </>
            ) : (
              <p><em>No AI summary available. Activity created without analysis.</em></p>
            )}
            <h5>Your Workout Data:</h5>
            <ul>
              {Object.entries(userData).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
            <Button variant="secondary" onClick={submitWorkout}>
            Submit
            </Button>
        </Offcanvas.Body>
        
      </Offcanvas>
    </>
  );
}

export default WorkoutSummary;