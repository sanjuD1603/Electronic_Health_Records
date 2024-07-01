import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/paitentsignup.css'; // Corrected import path assuming it's correct now

const PatientSignUp = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        address: '',
        phoneNumber: '',
        metaMaskAccount: location.state?.metaMaskAccount || '',
        bloodgroup: '',
        insuranceProvider: '',
        policyNumber: '',
        gender: '', // Added state for gender
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
                const response = await axios.post('http://localhost:5000/api/registerpatient', formData);

                if (response.status === 200) {
                    setSuccess("Registration successful!");
                    setError('');
                    navigate('/Patient/viewprofile', { state: { formData } });
                } else {
                    setError(response.data.message || 'Registration failed.');
                    setSuccess('');
                    console.error("Registration failed.", response.data);
                }
            } catch (error) {
                setError(error.response?.data?.message || 'Registration error.');
                setSuccess('');
                console.error("Registration error:", error);
            }
        } else {
            setError("MetaMask account not connected.");
            setSuccess('');
            console.error("MetaMask account not connected.");
        }
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

    return (
        <div id="signup-form">
            <form onSubmit={handleSubmit}>
                <button className="button-57" type="button" onClick={connectMetaMask}>
                    {formData.metaMaskAccount ? `Connected: ${formData.metaMaskAccount}` : "Connect MetaMask"}
                </button>
                <br />
                {formData.metaMaskAccount && (
                    <div>
                        MetaMask Account: {formData.metaMaskAccount}
                        <br />
                    </div>
                )}
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {success && <div style={{ color: 'green' }}>{success}</div>}
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

                <label>
                    Select Gender:
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Please Select your Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </label>
                {formData.gender && <p>Selected Gender: {formData.gender}</p>}
                <br />

                <label>
                    Select Blood Group:
                    <select
                        id="bloodGroup"
                        name="bloodgroup"
                        value={formData.bloodgroup}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select your blood group</option>
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
                {formData.bloodgroup && <p>Selected Blood Group: {formData.bloodgroup}</p>}
                <br />

                <label>
                    Insurance Provider:
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
                    Policy Number:
                    <input
                        type="text"
                        name="policyNumber"
                        value={formData.policyNumber}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />

                <button className="button-57" type="submit">Register</button>
            </form>
        </div>
    );
};

export default PatientSignUp;
