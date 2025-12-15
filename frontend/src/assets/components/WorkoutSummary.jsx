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
  
  const submitWorkout = async () => {
    console.log("Submitting workout:", JSON.stringify(userData));
    try {
      const response = await fetch('http://localhost:5000/api/activities/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        console.warn('Received non-JSON response:', text);
        data = { raw: text };
      }

      console.log('Upload response:', response.status, data);

      const successMsg = 'Activity uploaded successfully';
      if (response.ok && (data.message === successMsg || (data.raw && data.raw.includes(successMsg)))) {
        alert('Workout submitted!');
        navigate('/', { replace: true });
      } else if (data.error === 'Missing required fields' || data.message === 'Missing Required Fields' || (data.raw && data.raw.includes('Missing'))) {
        alert('Missing Required Fields. Please check your input.');
      } else {
        alert('Failed to upload activity. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting workout:', error);
      alert('An error occurred. Please try again.');
    }
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