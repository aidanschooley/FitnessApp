import { useState } from 'react';
import { Navigate } from 'react-router-dom';

var id = 0;

export default function CreateAccountForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedin] = useState(false);


    function updateFirstName(newFirstName) {
        setFirstName(newFirstName);
    }

    function updateLastName(newLastName) {
        setLastName(newLastName);
    }

    function updateEmail(newEmail) {
        setEmail(newEmail);
    }

    function updatePassword(newPassword, inputElement) {
        setPassword(newPassword);

        // Check password strength and set custom validity
        //Password must be length 6 or more,  less than 24, at least one non-letter character, and not empty
        if (newPassword.length < 6) {
            inputElement.setCustomValidity('Password is too short!');
        } else if (newPassword.length >= 24) {
            inputElement.setCustomValidity('Password is too long!');
        } else if (!/[^\w]/.test(newPassword)) { // Check for at least one non-letter character
            inputElement.setCustomValidity('Password must contain at least one non-alphanumeric character!');
        } else {
            inputElement.setCustomValidity(''); // Clear custom validity if password is valid
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        //chesks if the fields are filled
        if (firstName === '' || lastName === '' || email === '' || password === '') {
            alert('Please fill in all fields!');
            return;
        }
        //created time created and updayed
        const createdAt = new Date().toLocaleString() + "";
        const updatedAt = new Date().toLocaleString() + "";
        const role = "user";
        
        //creates user info
        const newUser = { id, firstName, lastName, email, password, role, createdAt, updatedAt };
    
        // Send the newUser to the backend
        fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    // Store the token and user information in localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
    
                    alert(`Registration successful for ${firstName} ${lastName}`);
                    setLoggedin(true); // Redirect to the homepage
                } else if (data.message === 'Email address is already registered.') {
                    alert('Email already exists. Go Login');
                } else {
                    alert('Failed to register. Please try again.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
    }
    //Sends to home page if logged in
    if (loggedIn) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="container mt-5">
            <h1>Create Account</h1>

            <hr></hr>
            {/*First name required */}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        placeholder="Enter your first name"
                        required
                        onChange={(e) => updateFirstName(e.target.value)}
                    />
                </div>
                {/*last name required */}
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        placeholder="Enter your last name"
                        required
                        onChange={(e) => updateLastName(e.target.value)}
                    />
                </div>
                {/*Email addres required */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter your email"
                        required
                        onChange={(e) => updateEmail(e.target.value)}
                    />
                </div>
                {/*Password required */}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter your password"
                        required
                        onChange={(e) => updatePassword(e.target.value, e.target)}
                    />
                </div>
                {/*Submit Button */}
                <button type="submit" className="btn btn-primary">Create Account</button>
            </form>
        </div>
    );
}