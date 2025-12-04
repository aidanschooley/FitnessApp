// Importing necessary components and libraries
import CreateAccountForm from "../components/CreateAccountForm.jsx";
import Dashboard from "./Dashboard.jsx";
import NoPage from "./NoPage";

export default function CreateAccount() {
    const user = localStorage.getItem('user'); //Retrieve user data from local storage
    
    // If the user is not logged in render the create account form
    // Otherwise render the NoPage component to help them return to the homepage.
    if (user){
        return <> 
            {/*Sends loggedin user to No page */}
            <NoPage />
        </>

    } else{
        return <>
            {/*Sends non signed in guest to createAccoutnform component */}
            <CreateAccountForm />
        </>
    }
}