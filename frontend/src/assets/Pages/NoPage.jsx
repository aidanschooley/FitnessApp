// Importing necessary components and libraries
import { Link } from "react-router-dom";
export default function NoPage(){   
    return <>
        <h1> You seem to be lost </h1>
        <h2>Lets help you find your way back </h2>
        {/**Link to homepage */} 
        <Link to="/" > Go to Homepage</Link>
    </>
}