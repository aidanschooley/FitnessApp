import SideMenu from "../components/sideMenu";
import Login from "./Login.jsx";
import WorkoutSubmission from "../components/WorkoutSubmission.jsx";

function Workout() {
    const user = localStorage.getItem('user'); // Retrieve user data from local strorage
    if (!user){
    return (
        <div>
            <SideMenu />
            <WorkoutSubmission />
        </div>
    );
}else{
    return <>
        {/*Sends not signed in guest to login page */}
        <Login />
    </>
}
}

export default Workout;