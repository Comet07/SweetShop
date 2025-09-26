import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Layout
import Navbar from './components/layout/Navbar';

// Components
import SweetList from './components/sweets/SweetList';
import AddSweet from './components/sweets/AddSweet';
import EditSweet from './components/sweets/EditSweet';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Routing
import AdminRoute from './components/auth/AdminRoute'; // Import the new AdminRoute

// Styling
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <main className="container">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<SweetList />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Private Admin Routes - Now using AdminRoute for proper role checking */}
                        <Route
                            path="/add"
                            element={<AdminRoute><AddSweet /></AdminRoute>}
                        />
                        <Route
                            path="/edit/:id"
                            element={<AdminRoute><EditSweet /></AdminRoute>}
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;