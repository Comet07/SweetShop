import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 1. Import the useAuth hook

const PrivateRoute = ({ children }) => {
    const { user } = useAuth(); // 2. Get the user object from our global context
    const location = useLocation();

    // 3. Check if the user object exists. This is more reliable than checking
    //    localStorage because the context has already validated the token.
    if (user) {
        return children; // If the user is authenticated, render the component
    }

    // 4. If no user, redirect to the login page, saving the current location
    //    so we can redirect back after a successful login.
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;