import { useEffect, useState, Fragment } from 'react';
import SideMenu from "../components/sideMenu.jsx";
import Login from "./Login.jsx";
import CreateGoal from "../components/CreateGoal.jsx";

function Goals() {
    const rawUser = localStorage.getItem('user'); // Retrieve user data from local storage
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [completingId, setCompletingId] = useState(null);
    const [showCompleted, setShowCompleted] = useState(false);

    const fetchGoals = async (completed = false) => {
        if (!rawUser) return;
        let user = {};
        try { user = JSON.parse(rawUser); } catch (e) { console.warn(e); }
        const userId = user.idUsers || user.id || user.ID;
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const url = completed
                ? `http://localhost:5000/api/goals/${userId}?completed=true`
                : `http://localhost:5000/api/goals/${userId}?active=true`;
            const res = await fetch(url);
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
        fetchGoals(showCompleted);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showCompleted]);

    if (!rawUser){
        return <Login />;
    }

    return (
        <div>
            <SideMenu />
            <h1>Goals</h1>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                <CreateGoal onCreated={() => fetchGoals(showCompleted)} />
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                    <button
                        onClick={() => setShowCompleted(false)}
                        style={{ padding: '6px 10px', background: showCompleted ? 'transparent' : '#007bff', color: showCompleted ? '#000' : '#fff', border: '1px solid #007bff', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setShowCompleted(true)}
                        style={{ padding: '6px 10px', background: showCompleted ? '#007bff' : 'transparent', color: showCompleted ? '#fff' : '#000', border: '1px solid #007bff', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Completed
                    </button>
                </div>
            </div>

            {loading && <p>Loading goals...</p>}
            {error && <p style={{color:'red'}}>{error}</p>}

            {!loading && goals.length === 0 && (
                <p>No active goals. Create one to get started.</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '1rem' }}>
                {goals.map(g => (
                    <div key={g.idGoals} style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '6px', position: 'relative' }}>
                        <strong>{g.activityType || 'Activity'}</strong>

                        {/* 3-dot menu */}
                        <button
                            onClick={() => setOpenMenuId(openMenuId === g.idGoals ? null : g.idGoals)}
                            aria-label="more"
                            style={{ position: 'absolute', right: '8px', top: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#555', fontSize: '20px' }}
                        >
                            ⋮
                        </button>

                        {openMenuId === g.idGoals && (
                            <div style={{ position: 'absolute', right: '8px', top: '34px', background: 'white', border: '1px solid #ccc', borderRadius: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.12)', zIndex: 20 }}>
                                <button
                                    onClick={async () => {
                                        if (completingId) return;
                                        const confirmMark = window.confirm('Mark this goal as completed?');
                                        if (!confirmMark) return;
                                        try {
                                            setCompletingId(g.idGoals);
                                            const now = new Date().toISOString();
                                            const res = await fetch(`http://localhost:5000/api/goals/${g.idGoals}`, {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ dateCompleted: now })
                                            });
                                            if (!res.ok) throw new Error('Failed to mark completed');
                                            // refresh list according to current filter
                                            await fetchGoals(showCompleted);
                                            setOpenMenuId(null);
                                        } catch (err) {
                                            console.error(err);
                                            alert('Could not mark goal completed');
                                        } finally {
                                            setCompletingId(null);
                                        }
                                    }}
                                    style={{ display: 'block', padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#007bff', width: '100%', textAlign: 'left' }}
                                >
                                    {completingId === g.idGoals ? 'Completing...' : 'Mark Completed'}
                                </button>
                            </div>
                        )}

                        {showCompleted ? (
                            <>
                                {g.distance ? <div>Goal (distance): {g.distance} {g.activityType === 'Swimming' ? 'yards' : 'miles'}</div> : null}
                                {g.duration ? <div>Goal (duration): {g.duration}{typeof g.duration === 'string' && g.duration.includes(':') ? '' : ' minutes'}</div> : null}
                                <div>Created: {g.dateCreated ? new Date(g.dateCreated).toLocaleDateString() : '—'}</div>
                                <div>Completed: {g.dateCompleted ? new Date(g.dateCompleted).toLocaleDateString() : '—'}</div>
                            </>
                        ) : (
                            <>
                                {g.distance ? <div>Distance: {g.distance} {g.activityType === 'Swimming' ? 'yards' : 'miles'}</div> : null}
                                {g.duration ? <div>Duration: {g.duration}{typeof g.duration === 'string' && g.duration.includes(':') ? '' : ' minutes'}</div> : null}
                                <div>Deadline: {g.deadlineDate ? new Date(g.deadlineDate).toLocaleDateString() : 'No deadline'}</div>
                                <div>Created: {g.dateCreated ? new Date(g.dateCreated).toLocaleDateString() : '—'}</div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Goals;