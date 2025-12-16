import FeedPost from "./feedpost";
import { useEffect } from 'react';
import { useState } from 'react';
function Feed() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    function fetchFeedPosts() {
        
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.idUsers) {
            setError(true);
            setLoading(false);
            return;
        }
        const userid = user.idUsers;
        fetch(`http://localhost:5000/api/activities/summary?userid=${userid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then((response) => {
                        if (response.ok) {
                            //return json file
                            return response.json();
                        } else {
                            throw new Error('Failed to Fetch Activity');
                        }
                    })
                    .then((data) => {
                        console.log(`Activity Data: ${JSON.stringify(data)}`);
                        setError(false);
                        setActivities(data.activities);
                        setLoading(false);

                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        // alert(error.message);
                        setError(true);
                        setLoading(false);
                    });
      
     
    }
      useEffect(() => {
            fetchFeedPosts();
        }, []);
    if (loading) return <p>Loading feed...</p>;
    if (error) return <p>Failed to load activities.</p>;
    if (activities.length === 0) return <p>No activities yet.</p>;
    return (
        <div>
            <div>
                {activities.map((activity, index) => (
                <FeedPost
                    key={`${activity.dateCreated}-${index}`}
                    activityType={activity.activityType ?? "Unknown"}
                    distance={activity.distance ?? 0}
                    duration={activity.duration ?? "N/A"}
                    intensity={activity.intensity ?? "N/A"}
                    time={activity.dateCreated ?? ""}
                    dateCreated={activity.dateCreated ?? ""}
                    pace={activity.pace ?? 0}
                    elevationGained={activity.elevationGained ?? 0}
                    cadence={activity.cadence ?? 0}
                    notes={activity.notes ?? ""}

                />
            ))}
            </div>
        </div>
    );
}
export default Feed;