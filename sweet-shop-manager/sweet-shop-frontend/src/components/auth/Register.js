import React, { useState } from 'react';
import { register } from '../../services/api';
import { useNavigate } from 'react-router-dom';
// We will create and use an AuthContext soon
// import { useAuth } from '../../context/AuthContext';

const Register = () => {
    // The 'role' field is removed from the initial state
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    // const { loginUser } = useAuth(); // This would be the ideal way with context

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            // The backend will automatically assign the 'User' role
            const { data } = await register(formData);

            // Instead of reloading, we would update a global context
            localStorage.setItem('token', data.token);
            // loginUser(data.token); // Example of updating context

            navigate('/'); // Navigate to the homepage
            // The page reload is removed.
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed.');
            console.error('Registration failed', err);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={onSubmit}>
                <h2>Register</h2>
                {error && <p className="error-msg">{error}</p>}
                <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Name" required />
                <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="Email Address" required />
                <input type="password" name="password" value={formData.password} onChange={onChange} placeholder="Password" required minLength="6" />
                {/* The role select dropdown has been removed for security */}
                <button type="submit" className="btn">Register</button>
            </form>
        </div>
    );
};

export default Register;