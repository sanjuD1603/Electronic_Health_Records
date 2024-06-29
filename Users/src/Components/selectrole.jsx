import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import axios from 'axios';
import doctorImage from './assets/doctor-icon.png';
import patientImage from './assets/patient-icon.png';
=======
import doctorImage from './assets/doctor-icon.png'; 
import patientImage from './assets/patient-icon.png'; 
import './assets/selectrole.css'; 
>>>>>>> 152fc9a66d7cc50ad540c2768044597917385e5c

const SelectRole = () => {

    const navigate = useNavigate('');
    const [metaMaskAccount, setMetaMaskAccount] = useState('');

    // useEffect(() => {
    //     console.log("MetaMask Account state updated:", metaMaskAccount);
    // }, [metaMaskAccount]);

    const connectMetaMask = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                setMetaMaskAccount(account);
                console.log("MetaMask Account:", account);
                return account;
            } catch (error) {
                console.error("MetaMask error:", error);
                return null;
            }
        } else {
            console.error("MetaMask not detected.");
            return null;
        }
    };

<<<<<<< HEAD
    const saveAccountToDB = async (account, role) => {
        try {

            const response = await axios.post('http://localhost:5000/api/accounts', { address: account, role });

            if (response.status === 201) {
                console.log('Account created:', response.data);
                if (role === 'doctor') {
                    navigate('/Doctor/doctorsignup', {state: {metaMaskAccount: account}});
                } else {
                    // navigate('/Patient/patientsignup', {state: {metaMaskAccount: account, id: 1} });
                }
            } else if (response.status === 200) {
                console.log('Account exists, redirecting to profile:', response.data);
                if (role === 'doctor') {
                    navigate('/Doctor/Viewprofile', { state: {metaMaskAccount: account } });
                } else {

                    navigate('/Patient/viewprofile', { state: {metaMaskAccount: account } });
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert('Address and role are required.');
            } else if (error.response && error.response.status === 500) {
                alert('Internal server error. Please try again later.');
            } else {
                console.error('Error saving account to DB:', error);
            }
        }
    };
=======

    const handlePatientClick = () => {
        navigate('/Paitent/paitentsignup'); 
>>>>>>> 152fc9a66d7cc50ad540c2768044597917385e5c

    const handleDoctorClick = async () => {
        const account = await connectMetaMask();
        if (account) {
            saveAccountToDB(account, 'doctor');
        }
    };

    const handlePatientClick = async () => {
        const account = await connectMetaMask();
        if (account) {
            saveAccountToDB(account, 'patient');
            console.log(account);
        }

    };

    const disconnectMetaMask = () => {
        console.log("Disconnecting MetaMask account");
        // Clear the MetaMask account state
        setMetaMaskAccount('');
        // Optionally, disconnect from MetaMask provider
        if (window.ethereum && window.ethereum.disconnect) {
            window.ethereum.disconnect();
        }
    };
    

    return (
        <div className="select-role">
            <h1>⚕️Select Your Role⚕️</h1>
            <div className="role-buttons">
                <button onClick={handleDoctorClick} className="role-button">
                    <img src={doctorImage} alt="Doctor" className="role-image" />
                    <span className='role-text'>Doctor</span>
                </button>
                <button onClick={handlePatientClick} className="role-button">
                    <img src={patientImage} alt="Patient" className="role-image" />
                    <span className='role-text'>Patient</span>
                </button>
            </div>
            {metaMaskAccount && (
                <div>
                    <p>Connected MetaMask Account: {metaMaskAccount}</p>
                    <button onClick={disconnectMetaMask} style={{ backgroundColor: 'red', color: 'white' }}>
                        Disconnect Wallet
                    </button>
                </div>
            )}
        </div>
    );
};

}
export default SelectRole;
