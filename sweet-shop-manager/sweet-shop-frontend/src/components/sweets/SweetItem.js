import React, { useState } from 'react';
import { deleteSweet } from '../../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// We no longer need to import local images!

// Helper function to generate a dynamic placeholder image URL
const getSweetImage = (name) => {
    const size = '400x300';
    const backgroundColor = 'e91e63'; // Your app's theme color
    const textColor = 'ffffff';
    // URL-encode the sweet's name to handle spaces and special characters
    const text = encodeURIComponent(name);
    return `https://via.placeholder.com/${size}/${backgroundColor}/${textColor}?text=${text}`;
};

const SweetItem = ({ sweet, onSweetDeleted }) => {
    const { user } = useAuth();
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);
    const isAdmin = user && user.role === 'Admin';

    const handleDelete = async () => {
        setError('');
        if (window.confirm(`Are you sure you want to delete ${sweet.name}?`)) {
            setDeleting(true);
            try {
                await deleteSweet(sweet._id);
                onSweetDeleted(sweet._id);
            } catch (err) {
                console.error("Error deleting the sweet:", err);
                setError(err.response?.data?.msg || 'Failed to delete sweet.');
            } finally {
                setDeleting(false);
            }
        }
    };

    return (
        <div className="sweet-item">
            {/* The src now uses our dynamic URL generator */}
            <img src={getSweetImage(sweet.name)} alt={sweet.name} className="sweet-image" />
            <div className="sweet-details">
                <h3>{sweet.name}</h3>
                <p><strong>Category:</strong> {sweet.category}</p>
                <p className="sweet-price">${sweet.price.toFixed(2)}</p>
                <p><strong>In Stock:</strong> {sweet.quantity}</p>

                {error && <p className="error-msg">{error}</p>}

                {isAdmin && (
                    <div className="admin-actions">
                        <Link to={`/edit/${sweet._id}`} className="btn btn-edit">Edit</Link>
                        <button onClick={handleDelete} className="btn btn-danger" disabled={deleting}>
                            {deleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SweetItem;