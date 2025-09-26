import React, { useState, useEffect } from 'react';
import { getAllSweets } from '../../services/api';
import SweetItem from './SweetItem';

const SweetList = () => {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // 1. Add state for error handling

    useEffect(() => {
        const fetchSweets = async () => {
            try {
                const { data } = await getAllSweets();
                setSweets(data);
            } catch (err) {
                console.error("Error fetching sweets:", err);
                // 2. Set a user-friendly error message
                setError('Could not fetch sweets. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchSweets();
    }, []);

    const handleSweetDeleted = (deletedSweetId) => {
        // 3. Use the functional form of setState for robust updates
        setSweets(prevSweets => prevSweets.filter(sweet => sweet._id !== deletedSweetId));
    };

    if (loading) {
        return <p>Loading sweets...</p>;
    }

    // 4. Render an error message if the fetch failed
    if (error) {
        return <p className="error-msg">{error}</p>;
    }

    return (
        <div>
            <h2>Our Sweets</h2>
            <div className="sweet-list">
                {sweets.length > 0 ? (
                    sweets.map(sweet => (
                        <SweetItem
                            key={sweet._id}
                            sweet={sweet}
                            onSweetDeleted={handleSweetDeleted}
                        />
                    ))
                ) : (
                    <p>No sweets are available at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default SweetList