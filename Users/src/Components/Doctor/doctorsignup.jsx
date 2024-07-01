import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const DoctorSignUp = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const [metaMaskAccount, setMetaMaskAccount] = useState(location.state?.metaMaskAccount || "Failed to Fetch Wallet Address");

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.metaMaskAccount || formData.metaMaskAccount === 'Failed to Fetch Wallet Address') {
            alert("MetaMask account not connected.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/registerdoctor', formData);

            if (response.status === 200) {
                alert("Registration successful!");
                navigate('/Doctor/Viewprofile', { state: { formData } });
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

export default DoctorSignUp;
