function SignOut() {
    // Clear user data from local storage
    function SignOutProcess() {    
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Optionally, you can redirect the user to the login page or home page
    window.location.href = '/login'; // Adjust the path as needed
    }
    return <><button onClick={() => { SignOutProcess(); }}>Sign Out</button></>;
}

export default SignOut;