import React, { useState } from "react";
import "../assets/signup.css";

const SignUp = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        address: '',
        phoneNumber: '',
        metaMaskAccount: '',
        specialization: '',
        medicalLicenseNumber: '',
        yearsOfExperience: '',
        
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
                const response = await fetch('/api/registerdoctor', {
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
                    <button type="button" onClick={connectMetaMask}>
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
                        First Name
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
                        Last Name
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
                        Date of Birth
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
                        Email
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
                        Address
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
                        Phone Number
                        <input 
                            type="tel" 
                            name="phoneNumber" 
                            value={formData.phoneNumber} 
                            onChange={handleChange} 
                            required 
                        />
                    </label>
                    <br />
                    <label>
                        Specialization
                        <input 
                            type="text"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Medical License Number
                        <input 
                            type="text"
                            name="medicalLicenseNumber"
                            value={formData.medicalLicenseNumber}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Years of Experience
                        <input 
                            type="number"
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />
                
                    <button type="submit">Register</button>
                </form>
            </div>
        </>
    );
};

export default SignUp;
