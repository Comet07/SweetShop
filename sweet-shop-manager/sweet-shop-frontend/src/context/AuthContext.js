import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // You may need to install this: npm install jwt-decode

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Optional: Check if token is expired
                if (decoded.exp * 1000 > Date.now()) {
                    setUser({ id: decoded.id, role: decoded.role });
                } else {
                    localStorage.removeItem('token'); // Clean up expired token
                }
            } catch (error) {
                console.error("Invalid token", error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const loginUser = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser({ id: decoded.id, role: decoded.role });
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);