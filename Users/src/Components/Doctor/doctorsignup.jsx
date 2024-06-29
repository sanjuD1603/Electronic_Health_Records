import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import "../assets/signup.css";

const SignUp = () => {
    const location = useLocation();
    const metaMaskAccount = location.state?.metaMaskAccount || '';

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        address: '',
        phoneNumber: '',
        metaMaskAccount: metaMaskAccount,
        specialization: '',
        medicalLicenseNumber: '',
        yearsOfExperience: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.metaMaskAccount) {
            try {
                // Prepare the data to send to the backend
                const data = { ...formData };
                const response = await axios.post('http://localhost:5000/api/registerdoctor', data);
                if (response.status === 200) {
                    setSuccess("Registration successful!");
                    setError('');
                    navigate('/Doctor/Viewprofile', { state: { formData: data } });
                } else {
                    setError(response.data.message || 'Registration failed.');
                    console.error("Registration failed.", response.data);
                }
            } catch (error) {
                setError(error.response?.data?.message || 'Registration error.');
                console.error("Registration error:", error);
            }
        } else {
            setError("MetaMask account not connected.");
            console.error("MetaMask account not connected.");
        }
    };

    return (
        <>
            <div id="signup-form">
                <form onSubmit={handleSubmit}>
                    <h1>Doctor Registration</h1>
                    {formData.metaMaskAccount && (
                        <div>
                            MetaMask Account: {formData.metaMaskAccount}
                            <br />
                        </div>
                    )}
                    {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
                    {success && <div className="success-message" style={{ color: 'green' }}>{success}</div>}
                    
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
                            min="0"
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
