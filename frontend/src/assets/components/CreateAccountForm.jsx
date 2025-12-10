import { useState } from 'react';
import { Navigate } from 'react-router-dom';

var id = 0;

export default function CreateAccountForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedin] = useState(false);


    function updateUsername(newUsername) {
        setUsername(newUsername);
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
        if (username === '' || email === '' || password === '') {
            alert('Please fill in all fields!');
            return;
        }
        
        //creates user info
        const newUser = {username, email, password};
    
        // Send the newUser to the backend
        fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        })
            .then((response) => response.json())
            .then((data) => {
            console.log(data);
                if (data.message === 'User registered successfully') {
                    // Store the token and user information in localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
    
                    alert(`Registration successful! Welcome!`);
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
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Enter your username"
                        required
                        onChange={(e) => updateUsername(e.target.value)}
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