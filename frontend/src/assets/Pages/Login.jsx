// Importing necessary components and libraries
import NoPage from "./NoPage.jsx";
import { useState } from 'react';
import Dashboard from "./Dashboard.jsx";
import LoginForm from "../components/LoginForm.jsx";
import { Navigate } from 'react-router-dom';
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
                    


export default function Login() {
    const user = localStorage.getItem('user'); // Retrieve user data from local strorage

    // If the user is not logged in render the login form
    // If the user is logged in as a normal user or as an admin, render the NotPage component to help them return to the homepage.
    if (user){
        return <>
            <Dashboard/>
            {/*Sends signed-in user to nopage */}
            <NoPage />
        </>  
    } else{
        return <>
            <Navigation />
            {/*Sends not signed in guest to login page */}
            <LoginForm />
        </>   
    }
}