import React, { useState } from 'react';
import { addSweet } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const AddSweet = () => {
    const [formData, setFormData] = useState({ name: '', category: '', price: '', quantity: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (parseFloat(formData.price) < 0 || parseInt(formData.quantity, 10) < 0) {
                setError('Price and quantity cannot be negative.');
                setLoading(false);
                return;
            }

            const sweetData = {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity, 10)
            };
            await addSweet(sweetData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to add sweet. Please check the details and try again.');
            console.error('Error adding sweet:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={onSubmit}>
                <h2>Add a New Sweet</h2>
                {error && <p className="error-msg">{error}</p>}
                <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Name" required disabled={loading} />
                <input type="text" name="category" value={formData.category} onChange={onChange} placeholder="Category" required disabled={loading} />
                <input type="number" name="price" value={formData.price} onChange={onChange} placeholder="Price" required step="0.01" min="0" disabled={loading} />
                <input type="number" name="quantity" value={formData.quantity} onChange={onChange} placeholder="Quantity" required min="0" disabled={loading} />
                <button type="submit" className="btn" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Sweet'}
                </button>
            </form>
        </div>
    );
};

export default AddSweet;
