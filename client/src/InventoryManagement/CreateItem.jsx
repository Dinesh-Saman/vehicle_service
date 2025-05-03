import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateItem() {
    const [itemName, setName] = useState('');
    const [itemID, setID] = useState('');
    const [quantity, setQuantity] = useState('');
    const [minimumAmount, setMin] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const submit = (e) => {
        e.preventDefault();

        // Validation checks
        if (!itemName || !itemID || !quantity || !minimumAmount) {
            setErrorMessage("All fields must be filled.");
            return;
        }
        if (!itemName.trim()) {
            setErrorMessage("Item Name cannot be empty.");
            return;
        }
        if (!/^[a-zA-Z\s]+$/.test(itemName)) {
            setErrorMessage("Item Name cannot contain numbers or special characters.");
            return;
        }
        if (isNaN(quantity) || quantity < 0) {
            setErrorMessage("Quantity must be a positive number.");
            return;
        }
        if (isNaN(minimumAmount) || minimumAmount < 0) {
            setErrorMessage("Minimum Amount must be a positive number.");
            return;
        }
        if (Number(minimumAmount) > Number(quantity)) {
            setErrorMessage("Minimum Amount cannot be greater than Quantity.");
            return;
        }
        if (!/^[A-Z][0-9]*$/.test(itemID)) {
            setErrorMessage("Item ID must start with a capital letter followed by numbers.");
            return;
        }

        setErrorMessage('');
        setLoading(true);  // Set loading state

        // Sending data via axios
        axios.post('http://localhost:3001/inventory/create', {
            ItemName: itemName,
            ItemId: itemID,
            Quantity: quantity,
            MinimumAmount: minimumAmount
        })
        .then(result => {
            console.log(result);
            setLoading(false);
            navigate('/inventory'); // Navigate to the inventory list
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
            setErrorMessage("Error occurred while submitting.");
        });
    };

    return (
        <div className="d-flex vh-100 justify-content-center align-items-center">
            <div className='w-50 bg-white rounded p-4' style={{ opacity: 0.9, borderRadius: '15px' }}>
                <form onSubmit={submit}>
                    <h2 className="text-center mb-4">Add Items</h2>
                    <div className='mb-3'>
                        <label>Item Name</label>
                        <input 
                            type="text" 
                            placeholder="Enter item" 
                            className="form-control"
                            value={itemName}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                setName(value);
                            }} 
                            disabled={loading}
                        />
                    </div>
                    <div className='mb-3'>
                        <label>Item ID (Starts with a capital letter followed by numbers)</label>
                        <input 
                            type="text" 
                            placeholder="Enter ID" 
                            className="form-control"
                            value={itemID}
                            onChange={(e) => setID(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className='mb-3'>
                        <label>Quantity</label>
                        <input 
                            type="number" 
                            placeholder="Enter Quantity" 
                            className="form-control"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className='mb-3'>
                        <label>Minimum Amount</label>
                        <input 
                            type="number" 
                            placeholder="Enter Min Amount" 
                            className="form-control"
                            value={minimumAmount}
                            onChange={(e) => setMin(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    {errorMessage && <div className="text-danger text-center">{errorMessage}</div>}
                    <div className="text-center">
                        <button 
                            type="submit" 
                            className="btn" 
                            style={{ backgroundColor: '#8B0000', color: 'white' }}
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateItem;
