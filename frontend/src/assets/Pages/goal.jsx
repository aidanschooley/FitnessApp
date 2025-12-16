import { useEffect, useState, Fragment } from 'react';
import SideMenu from "../components/sideMenu.jsx";
import Login from "./Login.jsx";
import CreateGoal from "../components/CreateGoal.jsx";

function Goals() {
    const rawUser = localStorage.getItem('user'); // Retrieve user data from local storage
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchActiveGoals = async () => {
        if (!rawUser) return;
        let user = {};
        try { user = JSON.parse(rawUser); } catch (e) { console.warn(e); }
        const userId = user.idUsers || user.id || user.ID;
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:5000/api/goals/${userId}?active=true`);
            if (!res.ok) throw new Error('Failed to fetch goals');
            const data = await res.json();
            setGoals(data || []);
        } catch (err) {
            console.error(err);
            setError('Could not load goals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveGoals();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!rawUser){
        return <Login />;
    }

    return (
        <div>
            <SideMenu />
            <h1>Goals</h1>
            <CreateGoal onCreated={fetchActiveGoals} />

            {loading && <p>Loading goals...</p>}
            {error && <p style={{color:'red'}}>{error}</p>}

            {!loading && goals.length === 0 && (
                <p>No active goals. Create one to get started.</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '1rem' }}>
                {goals.map(g => (
                    <div key={g.idGoals} style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '6px' }}>
                        <strong>{g.activityType || 'Activity'}</strong>
                        {g.distance ? (
                            <div>Distance: {g.distance}</div>
                        ) : null}
                        {g.duration ? (
                            <div>Duration: {g.duration}</div>
                        ) : null}
                        <div>Deadline: {g.deadlineDate ? new Date(g.deadlineDate).toLocaleDateString() : 'No deadline'}</div>
                        <div>Created: {g.dateCreated ? new Date(g.dateCreated).toLocaleDateString() : '—'}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Goals;