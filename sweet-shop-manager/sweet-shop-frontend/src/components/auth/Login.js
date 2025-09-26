import React, { useState } from 'react';
import { login } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 1. Import the useAuth hook

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { loginUser } = useAuth(); // 2. Get the loginUser function from context

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await login(formData);
            // 3. Use the context function to handle login logic
            loginUser(data.token);
            navigate('/');
            // 4. The window.location.reload() is no longer needed!
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed. Please try again.');
            console.error('Login failed', err);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={onSubmit}>
                <h2>Login</h2>
                {error && <p className="error-msg">{error}</p>}
                <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="Email Address" required />
                <input type="password" name="password" value={formData.password} onChange={onChange} placeholder="Password" required />
                <button type="submit" className="btn">Login</button>
            </form>
        </div>
    );
};

export default Login;