import { useNavigate, useParams } from 'react-router-dom';
import { API } from '../../../env';
import { useState } from 'react';

const DeleteItem = () => {
    const { id } = useParams(); // Get the item ID from the route params
    const navigate = useNavigate();
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setSubmitDisabled(true); // Disable button while deleting
            try {
                const response = await fetch(`${API}/api/v1/article/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Item deleted successfully');
                    navigate('/items'); // Redirect to the items list page after deletion
                    return;
                }
                alert('The item could not be deleted. Please try again.');
            } catch (error) {
                console.log(error);
                alert('Error deleting the item');
            }
            setSubmitDisabled(false); // Re-enable buttons if delete fails
        }
    };

    return (
        <div className="delete-item-container">
            <button 
                className="btn btn-delete" 
                onClick={handleDelete} 
                disabled={submitDisabled}
            >
                Delete Item
            </button>
        </div>
    );
};

export default DeleteItem;
