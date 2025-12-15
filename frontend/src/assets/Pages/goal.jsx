import SideMenu from "../components/sideMenu.jsx";
import Login from "./Login.jsx";
import CreateGoal from "../components/CreateGoal.jsx";

function Goals() {
    const user = localStorage.getItem('user'); // Retrieve user data from local strorage
    if (user){
        return (
            <div>
                <SideMenu />
                <h1>Goals Page</h1>
                <p>This is where your goals will be displayed.</p>
                <CreateGoal />
            </div>
        );
    }else{
        return <>
            {/*Sends not signed in guest to login page */}
            <Login />
        </>   
}
    }

export default Goals;