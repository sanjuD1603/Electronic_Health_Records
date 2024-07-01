import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PatientSignUp = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [metaMaskAccount, setMetaMaskAccount] = useState(location.state?.metaMaskAccount || "Failed to Fetch Wallet Address");

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        gender: '',
        address: '',
        phoneNumber: '',
        bloodgroup: '',
        metaMaskAccount: '',
        insuranceProvider: '',
        policyNumber: ''
    });

    useEffect(() => {
        const fetchAccount = async () => {
            if (metaMaskAccount === 'Failed to Fetch Wallet Address') {
                try {
                    const response = await axios.get('http://localhost:5000/api/accounts');
                    setMetaMaskAccount(response.data.account || 'Failed to Fetch Wallet Address');
                } catch (error) {
                    console.error("Error fetching MetaMask account:", error);
                }
            }
        };
        fetchAccount();
    }, [metaMaskAccount]);

    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            metaMaskAccount
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
    
        if (!formData.metaMaskAccount || formData.metaMaskAccount === 'Failed to Fetch Wallet Address') {
            alert("MetaMask account not connected.");
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:5000/api/registerpatient', formData);
    
            if (response.status === 200 || response.status === 201) {
                alert("Registration successful!");
                navigate('/Patient/viewprofile', { state: { metaMaskAccount: formData.metaMaskAccount } });
            } else {
                alert(response.data.message || 'Registration failed.');
                console.error("Registration failed.", response.data);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Registration error.');
            console.error("Registration error:", error);
        }
    };
    

    return (
        <>
            <h1>Patient Registration</h1>
            <div id="signup-form">
                <form onSubmit={handleSubmit}>
                    {metaMaskAccount && (
                        <div>
                            MetaMask Account: {metaMaskAccount}
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
                            required
                        >
                            <option value="" disabled>Please Select your Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </label>
                    <br />
                    <label>
                        Select Blood Group
                        <select
                            id="bloodGroup"
                            name="bloodgroup"
                            value={formData.bloodgroup}
                            onChange={handleChangeBlood}
                            required
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
