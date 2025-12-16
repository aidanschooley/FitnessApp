import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

export default function CreateGoal({ onCreated }) {
  const [show, setShow] = useState(false);
  const [activityType, setActivityType] = useState('Running');
  const [goalType, setGoalType] = useState('distance');
  const [value, setValue] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const submitGoal = async () => {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
      alert('You must be logged in to create a goal.');
      return;
    }
    let user = {};
    try {
      user = JSON.parse(rawUser);
    } catch (e) {
      console.warn('Failed to parse user from localStorage', e);
    }
    const userId = user.idUsers || user.id || user.ID;
    if (!userId) {
      alert('Could not determine user id.');
      return;
    }

    const body = {
      userId,
      distance: goalType === 'distance' ? value : null,
      duration: goalType === 'duration' ? value : null,
      targetDate: deadline,
      activityType,
    };

    try {
      const res = await fetch('http://localhost:5000/api/goals/newGoal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        alert('Goal created successfully');
        handleClose();
        // reset form
        setValue('');
        setDeadline('');
        setGoalType('distance');
        setActivityType('Running');
        if (typeof onCreated === 'function') onCreated();
      } else {
        console.error('Create goal failed', data);
        alert(data.error || data.message || 'Failed to create goal');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating goal');
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} style={{ margin: '1rem' }}>
        Create Goal
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="bottom" style={{ height: '60vh' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Create Goal</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="mb-3">
            <label className="form-label">Activity</label>
            <select className="form-select" value={activityType} onChange={(e) => setActivityType(e.target.value)}>
              <option>Running</option>
              <option>Biking</option>
              <option>Swimming</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Goal Type</label>
            <select className="form-select" value={goalType} onChange={(e) => setGoalType(e.target.value)}>
              <option value="distance">Distance</option>
              <option value="duration">Duration</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Value ({goalType === 'distance' ? 'miles' : 'minutes'})</label>
            <input
              type="text"
              className="form-control"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={goalType === 'distance' ? 'e.g. 5' : 'e.g. 30'}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Deadline</label>
            <input type="date" className="form-control" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" onClick={submitGoal}>Submit</Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
