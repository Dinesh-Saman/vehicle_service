import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function UpdateItem() {
    const { id } = useParams(); // Get the item ID from the URL parameters
    const [itemName, setName] = useState('');
    const [itemID, setID] = useState('');
    const [quantity, setQuantity] = useState('');
    const [minimumAmount, setMin] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the existing item details when the component mounts
        axios.get(`http://localhost:3001/inventory/${id}`)
            .then(result => {
                const { ItemName, ItemId, Quantity, MinimumAmount } = result.data;
                setName(ItemName);
                setID(ItemId);
                setQuantity(Quantity);
                setMin(MinimumAmount);
            })
            .catch(err => console.error(err));
    }, [id]);

    const submit = (e) => {
        e.preventDefault();

        // Validation to check if all fields are filled
        if (!itemName || !itemID || !quantity || !minimumAmount) {
            setErrorMessage("All fields must be filled.");
            return;
        }

        // Validation for item name
        if (!itemName.trim()) {
            setErrorMessage("Item Name cannot be empty.");
            return;
        }
        if (!/^[a-zA-Z]+$/.test(itemName)) {
            setErrorMessage("Item Name cannot contain numbers or special characters.");
            return;
        }

        // Validation for quantity and minimum amount
        if (isNaN(quantity) || quantity < 0) {
            setErrorMessage("Quantity must be a positive number.");
            return;
        }
        if (isNaN(minimumAmount) || minimumAmount < 0) {
            setErrorMessage("Minimum Amount must be a positive number.");
            return;
        }

        // **Added Validation: Minimum Amount cannot be greater than Quantity**
        if (Number(minimumAmount) > Number(quantity)) {
            setErrorMessage("Minimum Amount cannot be greater than Quantity.");
            return; // Prevents form submission
        }

        // Validation for item ID
        if (!/^[A-Z][0-9]*$/.test(itemID)) {
            setErrorMessage("Item ID must start with a capital letter followed by numbers.");
            return;
        }

        // Clear previous error messages if all validations pass
        setErrorMessage('');

        // Send the updated item details to the server
        axios.put(`http://localhost:3001/inventory/${id}`, {
            ItemName: itemName,
            ItemId: itemID,
            Quantity: quantity,
            MinimumAmount: minimumAmount
        })
        .then(() => {
            navigate('/inventory'); // Navigate back to the inventory page after successful update
        })
        .catch(err => console.log(err)); // Log any errors during the update
    };

    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: 'transparent' // Removed background color
        }}>
            <div 
                className='w-50 bg-white rounded p-4 shadow' 
                style={{ 
                    opacity: 0.9, // Decreased transparency
                    borderRadius: '15px' 
                }}
            >
                <h2 className="text-center mb-4">Update Item</h2>
                <form onSubmit={submit}>
                    <div className='mb-3'>
                        <label>Item Name</label>
                        <input 
                            type="text" 
                            placeholder="Enter item" 
                            className="form-control"
                            value={itemName}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^a-zA-Z]/g, '');
                                setName(value);
                            }} 
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
                        />
                    </div>
                    <div className='mb-3'>
                        <label>Minimum Quantity</label>
                        <input 
                            type="number" 
                            placeholder="Enter Minimum Amount" 
                            className="form-control"
                            value={minimumAmount}
                            onChange={(e) => setMin(e.target.value)}
                        />
                    </div>
                    {errorMessage && <div className="text-danger text-center mb-3">{errorMessage}</div>}
                    <button 
                        type="submit" 
                        className="btn btn-danger" 
                        style={{ 
                            backgroundColor: '#8B0000', 
                            color: 'white', 
                            width: '150px', 
                            display: 'block', 
                            margin: '0 auto' 
                        }}
                    >
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UpdateItem;
