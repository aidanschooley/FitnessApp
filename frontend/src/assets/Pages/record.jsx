import SideMenu from "../components/sideMenu";
import Login from "./Login.jsx";

function Record() {
    const user = localStorage.getItem('user'); // Retrieve user data from local strorage
    if (user){  
    return (
        <div>
            <SideMenu />
            <h1>Record Page</h1>
            <p>This is where your records will be displayed.</p>
        </div>
    );
} else{
    return <>
        {/*Sends not signed in guest to login page */}
        <Login />
    </>
}
}

export default Record;