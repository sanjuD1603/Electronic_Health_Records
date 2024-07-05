import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setupContract } from "../Ethereum/Contracts/web3";

const DoctorSignUp = () => {
    // console.log("Doctor SignUp");
    const location = useLocation();
    const navigate = useNavigate();

    console.log(location.state);

    const [metaMaskAccount, setMetaMaskAccount] = useState(location.state?.localmetaMaskAccount || "Failed to Fetch Wallet Address");
    const [error, setError] = useState(null);
    const [state, setState] = useState({ web3: null, contract: null });
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

    // useEffect(() => {
    //     const initialize = async () => {
    //       try {
    //         const { web3, contract } = await setupContract();
    //         setState({ web3, contract });
    //       } catch (error) {
    //         console.error("Error initializing contract:", error);
    //       }
    //     };
    //     initialize();
    //   }, []);

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
            // const {web3, contract} = state;

            if (!contract) {
                throw new Error("Contract not initialized.");
            }

            // Register doctor on blockchain
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
                ).send({ from: formData.metaMaskAccount,
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
                  console.log(events);
                  if (events.length > 0) {
                    const event = events.find(e => e.returnValues.metaMaskAccount.toLowerCase() === formData.metaMaskAccount.toLowerCase());
                    console.log(event);
                    if (event) {
                      const returnValues = event.returnValues.doctor;
                    //   console.log("/Viewprofile");
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

            // navigate('/Doctor/Viewprofile', { state: { formData } });
        } catch (error) {
            setError(error.response?.data?.message || 'Registration error.');
            console.error("Registration error:", error.message);
        }
    };

    return (
        <>
        <h1>Doctor Registration Form</h1>
            <div id="signup-form">
                <form onSubmit={handleSubmit}>
                    <br />
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
                            name="doctorAddress" 
                            value={formData.doctorAddress} 
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

export default DoctorSignUp;
