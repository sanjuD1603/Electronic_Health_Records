import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

const PatientSignUp = () => {
    const location = useLocation();
    const metaMaskAccount = location.state?.metaMaskAccount || '';

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        gender: '',
        address: '',
        phoneNumber: '',
        bloodgroup: '',
        metaMaskAccount: metaMaskAccount,
        insuranceProvider: '',
        policyNumber: ''
    });

    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            metaMaskAccount: metaMaskAccount
        }));
    }, [metaMaskAccount]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleChangeBlood = (event) => {
        setFormData({
            ...formData,
            bloodgroup: event.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.metaMaskAccount) {
            try {
                const data = { ...formData };

                const response = await fetch('/api/registerpatient', {
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
            <h1>Patient Registration</h1>
            <div id="signup-form">
                <form onSubmit={handleSubmit}>
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
                        Select Gender
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Please Select your Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        {formData.gender && <p>Selected Gender: {formData.gender}</p>}
                    </label>
                    <br />
                    <label>
                        Select Blood Group
                        <select
                            id="bloodGroup"
                            name="bloodgroup"
                            value={formData.bloodgroup}
                            onChange={handleChangeBlood}
                        >
                            <option value="" disabled>Select your blood group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                        {formData.bloodgroup && <p>Selected Blood Group: {formData.bloodgroup}</p>}
                    </label>
                    <br />
                    <label>
                        Insurance Provider
                        <input 
                            type="text"
                            name="insuranceProvider"
                            value={formData.insuranceProvider}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Policy Number
                        <input 
                            type="text"
                            name="policyNumber"
                            value={formData.policyNumber}
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

export default PatientSignUp;
