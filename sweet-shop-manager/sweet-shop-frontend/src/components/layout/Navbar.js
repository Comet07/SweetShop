import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 1. Import the useAuth hook

const Navbar = () => {
    const navigate = useNavigate();
    // 2. Get the user object and logout function from context
    const { user, logoutUser } = useAuth();

    const handleLogout = () => {
        logoutUser(); // 3. Use the context function for logout
        navigate('/login');
        // 4. The window.location.reload() is no longer needed!
    };

    return (
        <nav className="navbar">
            <h1><Link to="/">Sweet Shop</Link></h1>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                {/* 5. Check for the user object from context */}
                {user ? (
                    <>
                        {/* Conditionally show admin links based on role */}
                        {user.role === 'Admin' && (
                            <li><Link to="/add">Add Sweet</Link></li>
                        )}
                        <li><button onClick={handleLogout} className="btn-logout">Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;