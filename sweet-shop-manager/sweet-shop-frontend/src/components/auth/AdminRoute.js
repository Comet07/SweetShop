import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    // 1. Check if a user is authenticated AND if their role is 'Admin'
    if (user && user.role === 'Admin') {
        return children; // If they are an admin, render the protected component
    }

    // 2. If a user is logged in but is NOT an admin, redirect them away.
    if (user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // 3. If no user is logged in at all, redirect to the login page.
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AdminRoute;