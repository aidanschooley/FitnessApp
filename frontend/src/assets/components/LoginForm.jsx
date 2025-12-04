import { useState } from 'react';
import { Navigate } from 'react-router-dom';


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedin] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();

        // Send login data to the backend
        fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => {
                if (response.ok) {
                    //return json file
                    return response.json();
                } else {
                    throw new Error('Invalid email or password');
                }
            })
            .then((data) => {
                //after response, returns to Home page
                <Navigate to="/" replace />
                alert(`Welcome, ${data.user.firstName} ${data.user.lastName}!`);
                //sets token and user to local storage
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setLoggedin(true);
            })
            .catch((error) => {
                console.error('Error:', error);
                alert(error.message);
            });
    }
    //when logged in, Navigates to Home
    if (loggedIn) {
        return <Navigate to="/" replace />;
    }

    return (

        <div className="container mt-5">
            <h1>Login</h1>

            <hr></hr>
            {/*Email Address */}
            <form className="mt-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                {/*Password */}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter your password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <a href="/register">Don't have an account? Register here.</a>
        </div>
    );
}