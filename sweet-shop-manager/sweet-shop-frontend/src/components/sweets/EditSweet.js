import React, { useState, useEffect } from 'react';
import { getSweetById, updateSweet } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const EditSweet = () => {
    const [formData, setFormData] = useState({ name: '', category: '', price: '', quantity: '' });
    const [loading, setLoading] = useState(true); // 1. Start with loading true for the initial fetch
    const [submitting, setSubmitting] = useState(false); // State for form submission
    const [error, setError] = useState(''); // State for inline error messages
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchSweet = async () => {
            try {
                const { data } = await getSweetById(id);
                setFormData(data);
            } catch (err) {
                console.error('Error fetching sweet details:', err);
                setError('Could not find the sweet to edit.');
                // Optional: Redirect after a delay if the sweet is not found
                // setTimeout(() => navigate('/'), 3000);
            } finally {
                setLoading(false); // 2. Stop loading once fetch is complete
            }
        };
        fetchSweet();
    }, [id]); // Removed navigate from dependencies as it's not used in the effect

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setSubmitting(true); // 3. Indicate submission is in progress

        try {
            // 4. Ensure price and quantity are numbers before sending
            const sweetData = {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity, 10)
            };
            await updateSweet(id, sweetData);
            navigate('/');
        } catch (err) {
            // 5. Use inline error state instead of alert()
            setError(err.response?.data?.msg || 'Failed to update sweet.');
            console.error('Error updating sweet:', err);
        } finally {
            setSubmitting(false); // 6. Re-enable form after submission
        }
    };

    if (loading) {
        return <div className="form-container"><h2>Loading Sweet Details...</h2></div>;
    }

    return (
        <div className="form-container">
            <form onSubmit={onSubmit}>
                <h2>Edit Sweet</h2>
                {error && <p className="error-msg">{error}</p>}
                <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Name" required disabled={submitting} />
                <input type="text" name="category" value={formData.category} onChange={onChange} placeholder="Category" required disabled={submitting} />
                <input type="number" name="price" value={formData.price} onChange={onChange} placeholder="Price" required step="0.01" min="0" disabled={submitting} />
                <input type="number" name="quantity" value={formData.quantity} onChange={onChange} placeholder="Quantity" required min="0" disabled={submitting} />
                <button type="submit" className="btn" disabled={submitting}>
                    {submitting ? 'Updating...' : 'Update Sweet'}
                </button>
            </form>
        </div>
    );
};

export default EditSweet;