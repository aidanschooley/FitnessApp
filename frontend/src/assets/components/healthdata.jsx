import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function HealthData(healthtype) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [healthData, setHealthData] = useState('');
  const submit = () => {
        // Handle form submission logic here
        if (!healthData) {
            alert('Please enter health data before submitting.');
            return;
        }
        fetch('http://localhost:5000/api/healthdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                healthType: healthtype.healthtype,
                data: healthData,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to submit health data');
                }
            })
            .then((data) => {
                console.log('Health data submitted successfully:', data);
                handleClose();
            })
            .catch((error) => {
                console.error('Error submitting health data:', error);
            });
    }
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        New {healthtype.healthtype}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New {healthtype.healthtype}</Modal.Title>
        </Modal.Header>
         <Modal.Body></Modal.Body>
        <form id="healthDataForm" onSubmit={submit}>
       
          <div className="mb-3">
            <label htmlFor="healthDataInput" className="form-label">
              Enter {healthtype.healthtype} data:
            </label>
            <input
              type="text"
              className="form-control"
              id="healthDataInput"
              placeholder={`Enter ${healthtype.healthtype} data`}
            />
          </div>
        </form>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button form="healthDataForm" variant="primary" onClick={submit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default HealthData;