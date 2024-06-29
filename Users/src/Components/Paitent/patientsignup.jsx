
import React, { useState } from "react";
import '../assets/paitentsignup.css'

const PatientSignUp = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        address: '',
        phoneNumber: '',
        metaMaskAccount: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const connectMetaMask = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                setFormData({
                    ...formData,
                    metaMaskAccount: account
                });
            } catch (error) {
                console.error("MetaMask error:", error);
            }
        } else {
            console.error("MetaMask not detected.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.metaMaskAccount) {
            try {
                // Prepare the data to send to the backend
                const data = { ...formData };
                
                // Send data to the backend
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    console.log("Registration successful!");
                } else {
                    console.error("Registration failed.");
                }
            } catch (error) {
                console.error("Registration error:", error);
            }
        } else {
            console.error("MetaMask account not connected.");
        }
    };

    return (
        <>
            <div id="signup-form">
                <form onSubmit={handleSubmit}>
                    <button className="button-57" type="button"  onClick={connectMetaMask}>
                        {formData.metaMaskAccount ? `Connected: ${formData.metaMaskAccount}` : "Connect MetaMask"}
                    </button>
                    <br />
                    {formData.metaMaskAccount && (
                        <div>
                            MetaMask Account: {formData.metaMaskAccount}
                            <br />
                        </div>
                    )}
                    <label>
                        First Name:
                        <input 
                            type="text" 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleChange} 
                            required 
                        />
                    </label>
                    <br />
                    <label>
                        Last Name:
                        <input 
                            type="text" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleChange} 
                            required 
                        />
                    </label>
                    <br />
                    <label>
                        Date of Birth:
                        <input 
                            type="date" 
                            name="dateOfBirth" 
                            value={formData.dateOfBirth} 
                            onChange={handleChange} 
                            required 
                        />
                    </label>
                    <br />
                    <label>
                        Email:
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                        />
                    </label>
                    <br />
                    <label>
                        Address:
                        <input 
                            type="text" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange} 
                            required 
                        />
                    </label>
                    <br />
                    <label>
                        Phone Number:
                        <input 
                            type="tel" 
                            name="phoneNumber" 
                            value={formData.phoneNumber} 
                            onChange={handleChange} 
                            required 
                        />
                    </label>
                    <br />
                    <button className="button-57" type="submit">Register</button>
                </form>
            </div>
        </>
    );
};

export default PatientSignUp;
