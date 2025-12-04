// Importing necessary components and libraries
import CreateAccountForm from "../components/CreateAccountForm"
import Navigation from "../components/Navigation";
import NavigationAdmin from "../components/NavigationAdmin";
import NavigationUser from "../components/NavigationUser";
import NoPage from "./NoPage";

export default function CreateAccount() {
    const user = localStorage.getItem('user'); //Retrieve user data from local storage
    const role = user ? JSON.parse(user).role : null; // Gets the role of the user (user or admin)
    
    // If the user is not logged in render the create account form
    // Otherwise render the NoPage component to help them return to the homepage.
    if (role == "user"){
        return <> 
            <NavigationUser />
            {/*Sends loggedin user to No page */}
            <NoPage />
        </>
    } else if (role == "admin"){
        return <> 
            <NavigationAdmin />
            {/*Sends loggedin user to No page */}
            <NoPage />
        </>
    } else{
        return <>
            <Navigation />
            {/*Sends non signed in guest to createAccoutnform component */}
            <CreateAccountForm />
        </>
    }
}