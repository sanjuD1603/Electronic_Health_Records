import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setupContract } from "../Ethereum/Contracts/web3";
 // Make sure the CSS file path is correct
import Navbar from "../Navbar";
const DoctorSignUp = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [metaMaskAccount, setMetaMaskAccount] = useState(location.state?.metaMaskAccount || "Failed to Fetch Wallet Address");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        doctorAddress: '',
        phoneNumber: '',
        metaMaskAccount: metaMaskAccount,
        specialization: '',
        medicalLicenseNumber: '',
        yearsOfExperience: '',
    });

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
            const contract = await setupContract();
            if (!contract) {
                throw new Error("Contract not initialized.");
            }

            const transaction = await contract.methods
                .registerDoctor(
                    formData.firstName,
                    formData.lastName,
                    formData.dateOfBirth,
                    formData.email,
                    formData.doctorAddress,
                    formData.phoneNumber,
                    formData.metaMaskAccount,
                    formData.specialization,
                    formData.medicalLicenseNumber,
                    formData.yearsOfExperience
                ).send({
                    from: formData.metaMaskAccount,
                    gas: 5000000,
                    gasPrice: "20000000000",
                });

            console.log("Doctor Transaction Hash: ", transaction.transactionHash);
            setSuccess("Registration successful!");

            try {
                const events = await contract.getPastEvents("DoctorExists", {
                    filter: { metaMaskAccount: formData.metaMaskAccount },
                    fromBlock: 0,
                    toBlock: 'latest'
                });

                if (events.length > 0) {
                    const event = events.find(e => e.returnValues.metaMaskAccount.toLowerCase() === formData.metaMaskAccount.toLowerCase());

                    if (event) {
                        const returnValues = event.returnValues.doctor;
                        navigate("/Doctor/Viewprofile", {
                            state: {
                                metaMaskAccount: formData.metaMaskAccount,
                                doctor: returnValues,
                            },
                        });
                    } else {
                        console.error("No matching 'DoctorExists' event found for account:", formData.metaMaskAccount);
                    }
                } else {
                    console.error("No 'DoctorExists' event found.");
                }
            } catch (error) {
                console.error("Error fetching 'DoctorExists' events:", error.message);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Registration error.');
            console.error("Registration error:", error.message);
        }
    };

    const formatWalletAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 4)}...${address.slice(-2)}`;
      };

    return (
        <>
        <Navbar/>
            <h1>Doctor Registration Form</h1>
            <div id="signup-form">
                <div className="meta-mask-account">
                    MetaMask Account: {formatWalletAddress(formData.metaMaskAccount)}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-column">
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
                        <label>
                            Address
                            <input 
                                type="text" 
                                name="doctorAddress" 
                                value={formData.doctorAddress} 
                                onChange={handleChange} 
                                required 
                            />
                        </label>
                    </div>
                    <div className="form-column">
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
                    </div>
                    <div className="button-57-wrapper">
        <button className="button-57" type="submit">Register</button>
    </div>
                </form>
            </div>
        </>
    );
};

export default DoctorSignUp;
