import FeedPost from "./feedpost";
import { useEffect } from 'react';
import { useState } from 'react';
function Feed() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    function fetchFeedPosts() {
        
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user.idUsers;
        fetch(`http://localhost:5000/api/activities?userid=${user.idUsers}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
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
                        setActivities([data]);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        alert(error.message);
                        setLoading(false);
                    });
      
     
    }
      useEffect(() => {
            fetchFeedPosts();
        }, []);
    if (loading) return <p>Loading feed...</p>;
    if (activities.length === 0) return <p>No activities yet.</p>;
    return (
        <div>
            
            {activities.map((activity, index) => (
                <FeedPost key={index} distance={activity.distance} duration={activity.duration} pace={activity.pace} elevationGained={activity.elevationGained} cadence={activity.cadence} intensity={activity.intensity} picture={activity.picture} rpm={activity.rpm} stroke={activity.stroke} activityType={activity.activityType} notes={activity.notes}/>
            ))}
        </div>
    );
}
export default Feed;